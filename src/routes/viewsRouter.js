import express from "express";
import { passportCall, checkRol } from "../../utils.js";
import * as productServices from "../services/mongoDB/productsServices.js";
import * as cartServices from "../services/mongoDB/cartServices.js";
import productModel from "../services/mongoDB/models/productsModel.js";
import userDTO from "../services/dto/userDTO.js";
import { getMockingProducts } from "../controllers/productController.js";
import userModel from "../services/mongoDB/models/usersModel.js";

const router = express.Router();

//RENDERIZA LOS PRODUCTOS SEGUN QUERY
router.get("/products", passportCall("jwt"), async (req, res) => {
  try {
    let uid = req.cookies["id"];
    let userDB = await userModel.findOne({ _id: uid });
    let { limit, page, sort, query } = req.query;
    const products = await productServices.getAll(limit, page, sort, query);
    products.prevLink = products.hasPrevPage
      ? `http://localhost:9090/api/views/products?page=${products.prevPage}`
      : "";
    products.nextLink = products.hasNextPage
      ? `http://localhost:9090/api/views/products?page=${products.nextPage}`
      : "";
    products.isValid = !(page <= 0 || page > products.totalPages);
    const { docs, ...props } = products;
    let user = new userDTO(userDB);
    res.render("productList", { user, docs, ...props });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
});

//RENDERIZA PRODUCTOS MOCKEADOS
router.get(
  "/mockingproducts",
  passportCall("jwt"),
  checkRol(["admin"]),
  getMockingProducts,
  (req, res) => {}
);

//RENDERIZA UN CARRITO SEGUN EL ID
router.get("/carts/:cid", passportCall("jwt"), async (req, res) => {
  try {
    let uid = req.cookies["id"];
    let user = await userModel.findOne({ _id: uid });
    let userDto = new userDTO(user);
    let cid = req.params.cid;
    let cart = await cartServices.getProductsInCart(cid);
    let productsInCart = cart.products;

    res.render("cartList", { productsInCart, user: userDto });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
});

//RENDERIZA TODOS LOS PRODUCTOS (AGREGA Y ELIMINA PRODUCTOS EN TIEMPO REAL)
router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  checkRol(["admin"]),
  async (req, res) => {
    try {
      let products = [];
      products = await productModel.find().lean();
      res.render("realTimeProducts", { products });
    } catch (error) {
      req.logger.error(error);
      res.status(400).json(error.message);
    }
  }
);

//RENDERIZA EL CHAT
router.get("/chat", passportCall("jwt"), checkRol(["user", "premium"]), (req, res) => {
  try {
    res.render("chat");
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
});

//RENDERIZA LA VISTA PARA EL LOGIN
router.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
});

//RENDERIZA LA VISTA PARA EL REGISTRO
router.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
});

//RENDERIZA LOS DATOS DEL USUARIO AL INGRESAR
router.get("/current", passportCall("jwt"), async (req, res) => {
  try {
    let uid = req.cookies["id"];
    if(uid){
      let user = await userModel.findOne({ _id: uid });
      let userDto = new userDTO(user);
      res.render("current", { user: userDto });
    }else{
      let user = 
      {firstName: "Admin",
      lastName: "Account",
      email: "adminCoder@coder.com",
      rol: "admin",
      isAdmin: true,
    }
    res.render("current", { user: user });
  }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

router.get("/sendmail", (req, res) => {
  res.render("sendRestoreMail");
});

router.get("/passwordchange", (req, res) => {
  res.render("passwordChange");
});

router.get(
  "/userlist",
  passportCall("jwt"),
  checkRol(["admin"]),
  async (req, res) => {
    try {
      const users = await userModel.find();
      let usersDto = [];
      users.forEach((u) => {
        let user = new userDTO(u);
        usersDto.push(user);
      });
      res.render("users", { users: usersDto });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/productview/:pid", async (req, res) => {
  let uid = req.cookies["id"];
  let user = await userModel.findOne({ _id: uid });
  let userDto = new userDTO(user);
  let pid = req.params.pid;
  let product = await productServices.getById(pid);

  res.render("oneproduct", { pid: pid, product, userDto });
});

export default router;
