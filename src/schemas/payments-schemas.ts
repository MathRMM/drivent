import Joi from "joi";
import { PaymentBody } from "@/protocols";

export const paymentsBodySchema = Joi.object<PaymentBody>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string(),
    cvv: Joi.number().required()
  })
});
