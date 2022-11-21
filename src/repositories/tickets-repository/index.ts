import { prisma } from "@/config";
import { UpsertTickets } from "@/protocols";
import { TicketStatus } from "@prisma/client";

async function findManyTypes() {
  return await prisma.ticketType.findMany();
}

async function findTicketByUserId(userId: number, ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      OR: [
        {
          Enrollment: {
            userId,
          },
        },
        {
          id: ticketId
        }
      ],
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketByTicketId(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketByTicketIdAndUserId(ticketId: number, userId: number) {
  return prisma.ticket.findFirst({
    where: {
      AND: [{ id: ticketId }, { Enrollment: { userId } }],
    },
  });
}

async function upsertTickets(obj: UpsertTickets) {
  return await prisma.ticket.upsert({
    where: {
      id: obj.ticketId || 0,
    },
    update: {
      status: TicketStatus.PAID,
    },
    create: {
      status: TicketStatus.RESERVED,
      ticketTypeId: obj.ticketTypeId,
      enrollmentId: obj.enrollmentId,
    },
  });
}

const ticketsRepository = {
  findTicketByUserId,
  findManyTypes,
  upsertTickets,
  findTicketByTicketIdAndUserId,
  findTicketByTicketId,
};

export default ticketsRepository;
