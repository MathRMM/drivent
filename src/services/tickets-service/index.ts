import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { Ticket, TicketType } from "@prisma/client";

async function getTicketType(): Promise<TicketType[]> {
  const ticketType = await ticketsRepository.findManyTypes();
  return ticketType;
}

async function getTicketByUserId(userId: number): Promise<TicketWithTypes> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByUserId(userId, 0);
  if (!ticket) throw notFoundError();

  return ticket;
}

type TicketWithTypes = Ticket & { TicketType: TicketType };

async function createAndReturnReserveTicket(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  await ticketsRepository.upsertTickets({ ticketTypeId: ticketTypeId, enrollmentId: enrollment.id });
  return await ticketsRepository.findTicketByUserId(userId, 0);
}

const ticketsService = {
  getTicketType,
  getTicketByUserId,
  createAndReturnReserveTicket,
};

export default ticketsService;
