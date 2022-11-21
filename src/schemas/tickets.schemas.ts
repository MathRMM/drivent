import Joi from "joi";

export const ticketTypeSchema = Joi.object<TicketTypeBody>({
  ticketTypeId: Joi.number().required()
});

type TicketTypeBody = {
  ticketTypeId: number
}
