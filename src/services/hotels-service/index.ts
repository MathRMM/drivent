import { Hotel } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";
import paymentsRepository from "@/repositories/payments-repository";
import { unauthorizedError, notFoundError } from "@/errors";

async function getHotels(userId: number): Promise<Hotel[]> {
  const payment = await paymentsRepository.findPaymentWithTicketTypeByUserId(userId);
  if (!payment || !payment.Ticket.TicketType.includesHotel || !!payment.Ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  return hotelsRepository.findHotels();
}

async function getRooms(hotelId: number, userId: number) {
  const payment = await paymentsRepository.findPaymentWithTicketTypeByUserId(userId);
  if (!payment || !payment.Ticket.TicketType.includesHotel || !!payment.Ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }
  const rooms = await hotelsRepository.findRoomWithHotelByHotelId(hotelId);
  if(!rooms[0]) throw notFoundError();
  
  return rooms;
}

const hotelsService = {
  getHotels,
  getRooms
};

export default hotelsService;
