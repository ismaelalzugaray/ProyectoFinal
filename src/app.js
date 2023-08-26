//DEPENDENCIES IMPORTS
import cookieParser from "cookie-parser";
import express from "express";
import passport from "passport";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import initializePassport from "./config/passportConfig.js";
import { addLogger } from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express"

//ROUTES IMPORTS
import productRoutes from "./routes/productRouter.js";
import cartRoutes from "./routes/cartRouter.js";
import userRoutes from "./routes/userRouter.js";
import viewsRoutes from "./routes/viewsRouter.js";
import testRoutes from "./routes/testRouter.js";

//CONST IMPORTS
import { __dirname } from "../utils.js";
import config from "./config/config.js";

//MODELS
import productModel from "./services/mongoDB/models/productsModel.js";
import messageModel from "./services/mongoDB/models/messagesModel.js";

//MONGO SINGLETON
import MongoSingleton from "./config/mongoSingleton.js";

//EXPRESS SERVER INIT
export const app = express();
const httpServer = app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto: ${config.port} `);
});


//SWAGGER CONFIG
const swagggerOptions = {
  definition: {
    openapi: "3.1.0" ,
    info:{
      title: "Documentacion API KretzCommerce",
      description: "Documentacion para uso de swagger"
    }
  },
  apis: [`./src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swagggerOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

//COOKIEPARSER MIDDLEWARES
app.use(cookieParser("eKretzCommerce"));

//PASSPORT MIDDLEWARES
initializePassport();
app.use(passport.initialize());

//APP SETTINGS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addLogger);
app.use(express.static(__dirname + `/src/public`))

//HANDLEBARS SETTINGS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");

//STATIC FILES
app.use(express.static(__dirname + "/src/public"));

//ROUTES
app.use("/", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/views", viewsRoutes);

//SOCKET SERVER INIT
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo usuario conectado!");

  //CREA PRODUCTO
  socket.on("product", async (data) => {
    let result = await productModel.create(data);
  });

  //BORRA PRODUCTO
  socket.on("id", async (data) => {
    let result = await productModel.deleteOne({ _id: data });
  });

  //CREA MENSAJE Y ENVIA HISTORIAL DE MENSAJE
  socket.on("message", async (data) => {
    let result = await messageModel.create(data);
    let messages = await messageModel.find();
    socketServer.emit("messagesRecord", messages);
  });

  //ENVIA USUARIO QUE ENTRO
  socket.on("usersConnected", async (data) => {
    socket.broadcast.emit("usersConnected", data.user);
  });
});

const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.error(error);
  }
};
mongoInstance();
