const socket = io();

const submitButton = document.getElementById("addButton");
const deleteButton = document.getElementById("delButton");

//Funcion para obtener id
function getId() {
  const idToDelete = document.getElementById("delId").value;
  return idToDelete;
}

function toBoolean(string) {
  return string === "true";
}

let productToAdd;

//OBTENEMOS DATA DEL FORM Y LA TRANSFORMAMOS A UN OBJETO
function getData() {
  const title = document.getElementById("addTitle").value;
  const description = document.getElementById("addDescription").value;
  const price = parseInt(document.getElementById("addPrice").value);
  const code = document.getElementById("addCode").value;
  const stock = parseInt(document.getElementById("addStock").value);
  const category = document.getElementById("addCategory").value;
  const estado = document.getElementById("addStatus").value;

  if (
    !(
      title == "" ||
      description == "" ||
      code == "" ||
      price == "" ||
      stock == "" ||
      category == ""
    )
  ) {
    productToAdd = {
      title: title,
      description: description,
      price: price,
      code: code,
      stock: stock,
      category: category,
      status: toBoolean(estado),
    };

    return productToAdd;
  } else {
    return alert("Debe completar todos los campos");
  }
}

//ENVIAMOS EL PRODUCTO
submitButton.addEventListener("click", (evt) => {
  getData();
  socket.emit("producto", productToAdd);
});

//ENVIAMOS EL ID
deleteButton.addEventListener("click", (evt) => {
  let id = getId();
  socket.emit("id", id);
});
