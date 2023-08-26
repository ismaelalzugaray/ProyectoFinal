import { fileURLToPath } from "url";
import { dirname } from "path";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "./src/config/config.js";
import cartModel from "./src/services/mongoDB/models/cartsModel.js";
import productModel from "./src/services/mongoDB/models/productsModel.js";
import { faker } from "@faker-js/faker";
import customError from "./src/services/errors/customErrors.js";
import EErrors from "./src/services/errors/errorEnums.js";
import { generateProductErrorInfo } from "./src/services/errors/messages/productCreationMessageError.js";
import multer from "multer";

//STATIC FILES
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//MULTER
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    if (files.fieldname.startsWith("profile")) {
      cb(null, `${__dirname}/src/public/files/profile`);
    }
    if (files.fieldname.startsWith("product")) {
      cb(null, `${__dirname}/src/public/files/products`);
    }
    if (files.fieldname.startsWith("document")) {
      cb(null, `${__dirname}/src/public/files/documents`);
    }
  },

  filename: function (req, file, cb) {
    //console.log(file)
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, `${file.fieldname}-${Date.now()}.${ext} `);
  },
});

export const uploader = multer({
  storage,
  onError: function (err, next) {
    console.log(err);
    next();
  },
});

//BCRYPT

//Generamos el hash

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validamos la contraseña con el hash en la DB

export const passValidation = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

//JWT
export const generateJwt = (user) => {
  return jwt.sign({ user }, config.privateKey, { expiresIn: "24h" });
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");
    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: El usuario no tiene permisos con este rol.");
    }
    next();
  };
};

//MIDDLEWARES VARIOS
export const productDataValidation = (req, res, next) => {
  const { title, category, stock, price, description, code, status } = req.body;

  if (!title || !category || !stock || !price || !description || !code) {
    customError.createError({
      name: "Product creation Error",
      cause: generateProductErrorInfo(req.body),
      message: "Error al crear el producto",
      code: EErrors.MISSING_DATA,
    });
  }

  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof stock !== "number" ||
    typeof price !== "number" ||
    typeof description !== "string" ||
    typeof code !== "string" ||
    typeof status !== "boolean"
  ) {
    customError.createError({
      name: "Product creation Error",
      cause: generateProductErrorInfo(req.body),
      message: "Error al crear el producto",
      code: EErrors.INVALID_TYPES_ERROR,
    });
  }

  next();
};

export const userDataValidation = (req, res, next) => {
  const { firstName, lastName, email, age, password } = req.body;

  if (
    firstName !== "" &&
    lastName !== "" &&
    email !== "" &&
    age !== "" &&
    password !== ""
  ) {
    next();
  } else {
    res
      .status(400)
      .send({ status: "Error", message: "Debe completar todos los campos" });
  }
};

export const cidValidation = async (req, res, next) => {
  try {
    let cid = req.params.cid.trim();
    if (await cartModel.findOne({ _id: cid })) {
      next();
    } else {
      throw new Error("Carrito no encontrado");
    }
  } catch (error) {
    res
      .status(500)
      .send({ Error: error, msg: "No se pudo encontrar el carrito" });
  }
};

export const pidValidation = async (req, res, next) => {
  try {
    let pid = req.params.pid.trim();
    if (await productModel.findOne({ _id: pid })) {
      next();
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    res
      .status(500)
      .send({ Error: error, msg: "No se pudo encontrar el Producto" });
  }
};

export const adminValidation = (req, res, next) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    const userToken = {
      firstName: "Admin",
      lastName: "Account",
      email: "adminCoder@coder.com",
      rol: "admin",
      isAdmin: true,
    };

    const accessToken = generateJwt(userToken);

    res.cookie("jwtToken", accessToken, { maxAge: 600000, httpOnly: true });

    res.status(201).send({ message: "Login completado con exito" });
  } else {
    next();
  }
};

export const checkRol = (rol) => (req, res, next) => {
  !rol.includes(req.user.rol)
    ? res.status(401).send({ message: "usuario no autorizado" })
    : next();
};

//RANDOM STRING
export const genRandomString = (length) => {
  let chars = "abcdefghijklmnopqrstuvwxyz123456789";
  let charLength = chars.length;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

//MOCKING PRODUCTS
export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    category: faker.commerce.department(),
    stock: faker.random.numeric(2),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    code: faker.random.alphaNumeric(5),
    status: faker.datatype.boolean(0.5),
  };
};
