import ticketModel from "./models/ticketsModel.js";
import { genRandomString } from "../../../utils.js";

export async function createTicket(total, email) {
  try {
    let ticket = await ticketModel.create({
      code: genRandomString(10),
      amount: total,
      purchaser: email,
    });
    return ticket;
  } catch (error) {
    throw new Error(error);
  }
}
