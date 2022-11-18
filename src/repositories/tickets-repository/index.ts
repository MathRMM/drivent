import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

export async function findTicketTypesByUserId(userId: number): Promise<TicketType[]> {
  return await prisma.ticketType.findMany({
    where: {
      Ticket: {
        every: {
          Enrollment: {
            userId: userId
          }
        }
      }
    }
  });
}
