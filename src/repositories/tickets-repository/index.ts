import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

export async function findTicketTypesByUserId(userId: number): Promise<TicketType[]> {
  return await prisma.ticketType.findMany({
    where: {
      Ticket: {
        every: {
          Enrollment: {
            userId,
          }
        }
      }
    }
  });
}

export async function findTicketTypesById(id: number) {
  return await prisma.ticketType.findUnique({
    where: {
      id,
    }
  });
}

export async function findTicketByUserId(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId,
    }
  }).Ticket();
}
