import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import hotelsService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError")
      return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  if(isNaN(hotelId)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const rooms = await hotelsService.getRooms(hotelId, userId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if(error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error.message);
  }
}
