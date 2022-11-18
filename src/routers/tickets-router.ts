import { Router } from "express";
import { validateBody, authenticateToken } from "@/middlewares";
import { getTicketTypesByUserId } from "@/controllers/tickets-controller";

const ticketRouter = Router();

ticketRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypesByUserId);

export { ticketRouter };
