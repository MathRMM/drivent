import { findTicketTypesByUserId, findTicketByUserId, findTicketTypesById } from "@/repositories/tickets-repository";
import { notFoundError } from "@/errors";
import { Ticket, TicketType } from "@prisma/client";

export async function getTicketTypeByUserId(userId: number) {
  const ticketType = await findTicketTypesByUserId(userId);
  return ticketType;
}

export async function getTicketByUserId(userId: number): Promise<TicketWithTypes> {
  const [ticket] = await findTicketByUserId(userId);
  if (!ticket) throw notFoundError();
  const ticketType = await findTicketTypesById(ticket.ticketTypeId);
  if (!ticketType) throw notFoundError();
  return {
    ...ticket,
    ...(!!ticketType && { TicketType: ticketType })
  };
}

type TicketWithTypes = Ticket & { TicketType: TicketType }
