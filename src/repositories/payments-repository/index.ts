import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function findTicketWithPaymentByTicketId(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Payment: true,
      Enrollment: true,
    },
  });
}

async function findPaymentWithTicketTypeByUserId(userId: number) {
  return await prisma.payment.findFirst({
    where: {
      Ticket: {
        Enrollment: {
          userId,
        },
      },
    },
    include: {
      Ticket: {
        include: {
          TicketType: true
        }
      }
    }
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
  findPaymentWithTicketTypeByUserId,
  createPayment,
};

export default paymentsRepository;
