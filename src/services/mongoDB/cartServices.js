import cartModel from "./models/cartsModel.js";

export async function createCart() {
  try {
    let cart = await cartModel.create({ product: [] });
    return cart;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getProductsInCart(cartId) {
  try {
    let response = await cartModel.findOne({ _id: cartId }).populate().lean();
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function addProductToCart(cid, pid) {
  try {
    //obtenemos el carrito
    let cart = await cartModel.findOne({ _id: cid });
    let productsInCart = cart.products;
    //comprobamos que no exista el producto en el carrito
    let index = productsInCart.findIndex((p) => p.product._id == pid);
    //si existe lo guardamos en una variable
    let obj = productsInCart[index];

    if (index >= 0) {
      //si existe modificamos la variable aumentandole en 1 la propiedad quantity
      obj.quantity++;
      //modificamos el objeto en el array que trajimos de mongo
      productsInCart[index] = obj;
      //y por ultimo hacemos el update
      let result = await cartModel.findByIdAndUpdate(
        { _id: cid },
        { products: productsInCart }
      );
      return result;
    } else {
      //si no existe creamos un nuevo objeto
      let newObj = {
        product: pid,
        quantity: 1,
      };
      //y lo pusheamos al array
      let result = await cartModel.findByIdAndUpdate(
        { _id: cid },
        { $push: { products: newObj } }
      );
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateProductQuantity(cid, pid, quantity) {
  try {
    let cart = await cartModel.findOne({ _id: cid });
    let productsInCart = cart.products;
    //comprobamos que no exista el producto en el carrito
    let index = productsInCart.findIndex((p) => p.product._id == pid);
    let obj = productsInCart[index];

    if (index >= 0) {
      obj.quantity = quantity;
      productsInCart[index] = obj;
      let result = await cartModel.findByIdAndUpdate(
        { _id: cid },
        { products: productsInCart }
      );
      return result;
    }
    {
      return "No se encontro el producto";
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteProductInCart(pid, cid) {
  try {
    let cart = await cartModel.findOne({ _id: cid });
    let productsInCart = cart.products;
    //Obtenemos el index del producto en el array
    let index = productsInCart.findIndex((p) => p.product._id == pid);

    if (index >= 0) {
      //creamos un nuevo array sin el producto
      let newArray = productsInCart.filter((p) => p.product._id != pid);
      // hacemos un update con el nuevo array
      let response = await cartModel.findOneAndUpdate(
        { _id: cid },
        { products: newArray }
      );
      return response;
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteAllProducts(cid) {
  try {
    let response = await cartModel.findOneAndUpdate(
      { _id: cid },
      { products: [] }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateProductsInCart(cid, newProducts) {
  let cart = await cartModel.findById({ _id: cid });
  let productsInCart = cart.products;

  for (let i = 0; i < newProducts.length; i++) {
    let obj = newProducts[i];
    productsInCart.push(obj);
  }

  let response = await cartModel.findByIdAndUpdate(
    { _id: cid },
    { products: productsInCart }
  );
  return response;
}
