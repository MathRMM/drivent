import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import { invalidDataError } from "@/errors";
import httpStatus from "http-status";
import paymentsService from "@/services/payments-service";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId = Number(req.query.ticketId);
  if (isNaN(ticketId)) return res.status(httpStatus.BAD_REQUEST).send(invalidDataError(["TicketId is empty"]));

  try {
    const payment = await paymentsService.getPaymentByTicketId(ticketId, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    //console.log(error);
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(invalidDataError(error.message));
    if (error.name === "UnauthorizedError")
      return res.status(httpStatus.UNAUTHORIZED).send(invalidDataError(error.message));
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const payment = await paymentsService.createPayment(req.body, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(invalidDataError(error.message));
    if (error.name === "UnauthorizedError")
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(invalidDataError(error));
  }
}
