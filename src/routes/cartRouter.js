import express from "express";
import * as cartController from "../controllers/cartController.js";
import {
  cidValidation,
  pidValidation,
  passportCall,
  checkRol,
} from "../../utils.js";

const router = express.Router();

//CREAMOS CARRITO
router.post(
  "/",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cartController.createCart
);

//OBTENEMOS PRODUCTO DEL CARRITO
router.get(
  "/:cid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cidValidation,
  cartController.getCart
);

//AGREGAMOS UN PRODUCTO A UN CARRITO
router.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cidValidation,
  pidValidation,
  cartController.addProductToCart
);

//ACTUALIZAMOS UN PRODUCTO DEL CARRITO
router.put(
  "/:cid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cartController.updateProductsInCart
);

//ACTUALIZAMOS LA CANTIDAD DE UN PRODUCTO
router.put(
  "/:cid/products/:pid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cartController.updateProductQuantity
);

//ELIMINAMOS UN PRODUCTO DEL CARRITO
router.delete(
  "/:cid/products/:pid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cartController.deleteProductInCart
);

//ELIMINAMOS TODOS LOS PRODUCTOS DEL CARRITO
router.delete(
  "/:cid",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cartController.deleteAllProducts
);

router.get(
  "/:cid/purchase",
  passportCall("jwt"),
  checkRol(["user", "premium"]),
  cidValidation,
  cartController.finishPurchase
);

export default router;
