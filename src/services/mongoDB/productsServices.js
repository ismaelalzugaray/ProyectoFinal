import productModel from "./models/productsModel.js";

//OBTENEMOS TODOS LOS PRODUCTOS
export async function getAll(limit, page, sort, query) {
  try {
    let queryObj = query ? JSON.parse(query) : {};
    let limite = limit ? limit : 10;
    let pagina = page ? page : 1;
    let orden = sort ? { price: sort } : {};

    let products = await productModel.paginate(queryObj, {
      limit: limite,
      page: pagina,
      sort: orden,
      lean: true,
    });

    return products;
  } catch (error) {
    throw new Error(error);
  }
}

//OBTENEMOS UN PRODUCTO SEGUN EL ID
export async function getById(id) {
  try {
    let product = await productModel.find({ _id: id }).lean();
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//CREAMOS UN PRODUCTO
export async function saveProduct(data) {
  try {
    const product = await productModel.create(data);
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//ACTUALIZAMOS UN PRODUCTO
export async function updateProduct(id, body) {
  try {
    let product = await productModel.updateOne({ _id: id }, body);
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//ELIMINAMOS UN PRODUCTO
export async function deleteProduct(id) {
  try {
    let result = await productModel.deleteOne({ _id: id });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}
