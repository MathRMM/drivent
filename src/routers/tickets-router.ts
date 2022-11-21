import { Router } from "express";
import { validateBody, authenticateToken } from "@/middlewares";
import { getTicketTypesByUserId, getTicket, postTicket } from "@/controllers/tickets-controller";
import { ticketTypeSchema } from "@/schemas";

const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypesByUserId)
  .get("/", getTicket)
  .post("/", validateBody(ticketTypeSchema), postTicket);

export { ticketRouter };
