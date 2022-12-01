import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingByUserId(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);
  if (isNaN(roomId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const booking = await bookingService.postBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    if (error.name === "Forbidden") return res.status(httpStatus.FORBIDDEN).send(error);
    if (error.name === "InvalidDataError") return res.status(httpStatus.FORBIDDEN).send(error);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const bookingId = Number(req.params.bookingId);
  const roomId = Number(req.body.roomId);
  if (isNaN(bookingId) || isNaN(roomId)) return res.sendStatus(httpStatus.BAD_REQUEST);
  
  try {
    const booking = await bookingService.putBooking(userId, bookingId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    if (error.name === "Forbidden") return res.status(httpStatus.FORBIDDEN).send(error);
    if (error.name === "InvalidDataError") return res.status(httpStatus.FORBIDDEN).send(error);
  }
}
