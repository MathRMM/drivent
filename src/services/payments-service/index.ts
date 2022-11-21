import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { Payment } from "@prisma/client";
import { PaymentBody } from "@/schemas";
import { SavePayment } from "@/repositories/payments-repository";

async function getPaymentByTicketId(ticketId: number, userId: number): Promise<Payment> {
  const ticket = await paymentsRepository.findTicketWithPaymentByTicketId(ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();
  return ticket.Payment[0];
}

async function createPayment(obj: PaymentBody, userId: number): Promise<Payment> {
  const cardLastDigits = String(obj.cardData.number).slice(-4);
  const ticket = await ticketsRepository.findTicketWithTypeAndEnrollmentById(obj.ticketId);
  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  await ticketsRepository.upsertTickets({
    ticketId: ticket.id,
  });

  const payment: SavePayment = {
    ticketId: obj.ticketId,
    cardIssuer: obj.cardData.issuer,
    cardLastDigits: cardLastDigits,
    value: ticket.TicketType.price,
  };

  const create = await paymentsRepository.createPayment(payment);
  return create;
}

const paymentsService = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentsService;
