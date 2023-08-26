import { Command } from "commander";

const program = new Command();

program
  .option("-d", "Variable para debug", false)
  .option("-p <port>", "Puerto del server")
  .option("--mode <mode>", "Modo de trabajo", "production")
  .requiredOption("-u <user>", "El user que va usar la aplicaicon", "user");

program.parse();
console.log("Options: ", program.opts());
console.log("Mode Option: ", program.opts().mode);
console.log("Remaining arguments: ", program.args);

export default program;
