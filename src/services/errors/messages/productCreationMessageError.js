export const generateProductErrorInfo = (product) => {
  return `Los datos enviados estan incompletos o no son validos.
    Los datos requeridos son los siguientes:
    Title: type String, recibido: ${product.title}, ${typeof product.title}
    Category: type String, recibido: ${product.category}, ${typeof product.category}
    Stock: type Number, recibido: ${product.stock}, ${typeof product.stock}
    Price: type Number, recibido: ${product.price}, ${typeof product.price}
    Description type String, recibido: ${product.description}, ${typeof product.description}
    Code: type String, recibido: ${product.code}, ${typeof product.code}
    Status: type Boolean, recibido: ${product.status}, ${typeof product.status}`;
};
