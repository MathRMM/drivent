import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findTicketWithPaymentByTicketId(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Payment: true,
    },
  });
}

async function createPayment(obj: SavePayment) {
  return await prisma.payment.create({
    data: {
      ticketId: obj.ticketId,
      value: obj.value,
      cardIssuer: obj.cardIssuer,
      cardLastDigits: obj.cardLastDigits,
    },
  });
}

export type SavePayment = Omit<Payment, "createdAt" | "updatedAt" | "id">;

const paymentsRepository = {
  findTicketWithPaymentByTicketId,
  createPayment,
};

export default paymentsRepository;
