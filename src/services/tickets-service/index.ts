import { findTicketTypesByUserId } from "@/repositories/tickets-repository";

export async function getTicketTypeByUserId(userId: number) {
  const ticketType = await findTicketTypesByUserId(userId);
  return ticketType;
}
