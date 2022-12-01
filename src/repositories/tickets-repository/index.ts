import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

async function findManyTypes() {
  return await prisma.ticketType.findMany();
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return await prisma.ticket.findFirst({
    where: {
      Enrollment: {
        id: enrollmentId,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketWithTypeAndEnrollmentById(ticketId: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
      Enrollment: true,
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
      ticketTypeId: obj.ticketTypeId || 0,
      enrollmentId: obj.enrollmentId || 0,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketByUserId(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      TicketType: true
    }
  });
}

export type UpsertTickets = {
  ticketTypeId?: number;
  enrollmentId?: number;
  ticketId?: number;
};

const ticketsRepository = {
  findTicketByEnrollmentId,
  findManyTypes,
  upsertTickets,
  findTicketWithTypeAndEnrollmentById,
  findTicketByUserId
};

export default ticketsRepository;
