import * as productServices from "../services/mongoDB/productsServices.js";
import { generateProducts } from "../../utils.js";
import {delMail} from "../controllers/emailController.js"

//OBTENEMOS TODOS LOS PRODUCTOS
export async function getProducts(req, res) {
  try {
    let { limit, page, sort, query } = req.query;
    const response = await productServices.getAll(limit, page, sort, query);
    res.status(200).json(response);
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
}

//OBTENEMOS PRODUCTOS POR ID
export async function getProductById(req, res) {
  try {
    const id = req.params.pid;
    const response = await productServices.getById(id);
    res.status(200).send({payload: response})
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
}

//CREAMOS UN PRODUCTO
export async function createProduct(req, res) {
  try {
    const { body } = req;

    if(req.user.email !== "adminCoder@coder.com")
    body.owner = req.user.email

    const response = await productServices.saveProduct(body);
    res.status(200).json(response);
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
}

//ACTUALIZAMOS UN PRODUCTO
export async function updateOne(req, res) {
  try {
    let id = req.params.pid;
    let body = req.body;

    let product = await productServices.getById(id)

    if(req.user.rol !== "admin"){

      if (product[0].owner == req.user.email){
         const response = await productServices.updateProduct(id, body);
      
         return res.status(200).send({
         status: "Success",
         message: "Producto actualizado con exito",
         payload: response,
       });
      }else{
       return res.status(400).send({status: "error", message: "No tiene permisos para eliminar este producto"})
      }
    }

    const response = await productServices.updateProduct(id, body);
    res.status(200).send({
      status: "Success",
      message: "Producto actualizado con exito",
      payload: response,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
}

//ELIMINAMOS UN PRODUCTO
export async function deleteOne(req, res) {
  try {
    let id = req.params.pid;

    let product = await productServices.getById(id)
    if(req.user.rol !== "admin"){

      if (product[0].owner == req.user.email){
         //const response = await productServices.deleteProduct(id);
      
         return res.status(200).send({
         status: "Success",
         message: "Producto eliminado con exito",
         payload: response,
       });
      }else{
       return res.status(400).send({status: "error", message: "No tiene permisos para eliminar este producto"})
      }
    }

    const response = await productServices.deleteProduct(id);

    let mail = delMail(product[0].owner)
      
         res.status(200).send({
         status: "Success",
         message: "Producto eliminado con exito",
         payload: response})
    
  } catch (error) {
    req.logger.error(error);
    res.status(400).json(error.message);
  }
}

//GENERAMOS PRODUCTOS MOCKEADOS
export async function getMockingProducts(req, res) {
  try {
    let users = [];
    for (let i = 0; i < 100; i++) {
      users.push(generateProducts());
    }
    res.send({ status: "Success", payload: users });
  } catch (error) {
    req.logger.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo obtener los usuarios:" });
  }
}
