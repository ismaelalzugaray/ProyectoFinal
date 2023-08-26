import dotenv from "dotenv";
import program from "../../process.js";

const environment = program.opts().mode;

dotenv.config({
  path:
    environment === "production"
      ? "./src/config/.env.production"
      : "./src/config/.env.development",
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.DB,
  adminName: process.env.ADMIN_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  privateKey: process.env.PRIVATE_KEY,
  environment: environment,
  gmailAccount: process.env.GMAIL_ACCOUNT,
  gmailPassword: process.env.GMAIL_APP_PASSWORD
};


 