import { AuthenticatedRequest } from "@/middlewares";
import { getTicketTypeByUserId } from "@/services/tickets-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketTypesByUserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticket = await getTicketTypeByUserId(userId);
    return res.status(httpStatus.OK).send(ticket);
  }  catch (error) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
