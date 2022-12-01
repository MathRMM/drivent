import bookingRepository from "@/repositories/booking-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { invalidDataError, notFoundError, forbiddenError } from "@/errors";
import { exclude } from "@/utils/prisma-utils";

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();
  return {
    ...exclude(booking, "createdAt", "updatedAt", "roomId", "userId"),
  };
}

async function postBooking(userId: number, roomId: number) {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket || ticket.status !== "PAID") throw forbiddenError("Ticket is not paid");
  if (!ticket.TicketType.includesHotel) throw forbiddenError("This ticket category does not allow hosting");

  if (roomId < 1) throw invalidDataError(["id is invalid"]);
  const room = await hotelsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError("all vacancies have been filled");

  const booking = await bookingRepository.upsertBooking(userId, roomId);

  return { bookingId: booking.id };
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  const ticket = await ticketsRepository.findTicketByUserId(userId);
  if (!ticket || ticket.status !== "PAID") throw forbiddenError("Ticket is not paid");
  if (!ticket.TicketType.includesHotel) throw forbiddenError("This ticket category does not allow hosting");

  if (roomId < 1 || bookingId < 1) throw invalidDataError(["id is invalid"]);
  const room = await hotelsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw forbiddenError("all vacancies have been filled");

  const isValidBooking = await bookingRepository.findBookingByUserId(userId);
  if (isValidBooking.id !== bookingId) throw forbiddenError("this booking is not yours");
  const booking = await bookingRepository.upsertBooking(userId, roomId, bookingId);

  return { bookingId: booking.id };
}

const bookingService = {
  getBookingByUserId,
  postBooking,
  putBooking,
};
export default bookingService;
