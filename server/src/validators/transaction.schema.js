const { z } = require("zod");

const createTransactionSchema = z.object({
  date: z.string().min(1),
  name: z.string().min(1).max(160),

  principal: z.number().positive(),
  rateAnnual: z.number().nonnegative(),
  durationMonths: z.number().int().positive(),

  frequency: z.enum(["MONTHLY", "YEARLY"]),
  interestType: z.enum(["SIMPLE", "COMPOUND"]),
  direction: z.enum(["GIVEN", "TAKEN"]),

  modeOfPayment: z.string().max(60).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  accountId: z.string().optional().nullable()
});

const addPaymentSchema = z.object({
  date: z.string().min(1),
  amount: z.number().positive(),
  note: z.string().max(200).optional().or(z.literal(""))
});

module.exports = { createTransactionSchema, addPaymentSchema };
