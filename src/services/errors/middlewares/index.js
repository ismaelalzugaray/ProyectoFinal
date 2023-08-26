import EErrors from "../errorEnums.js";

export default (error, req, res, next) => {
  //Logica
  console.error("Error detectado entrando al Error Handler");
  console.error(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: "Error", error: error.message });
      // next();
      break;

    case EErrors.MISSING_DATA:
      res.status(400).send({ status: "Error", error: error.message });
      break;

    default:
      res.status(500).send({ status: "Error", error: "Unhandeld error!" });
      break;
  }
};
