import { Router } from "express";
import { validateBody, authenticateToken } from "@/middlewares";
import { getTicketTypesByUserId, getTicket } from "@/controllers/tickets-controller";

const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/", getTicket)
  .get("/types", getTicketTypesByUserId);

export { ticketRouter };
