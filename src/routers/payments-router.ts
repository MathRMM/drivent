import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentsBodySchema } from "@/schemas";
import { getPayment, postPayment } from "@/controllers";

const paymentsRouter = Router();

paymentsRouter
  .all("/*", authenticateToken)
  .get("/", getPayment)
  .post("/process", validateBody(paymentsBodySchema), postPayment);
export { paymentsRouter };
