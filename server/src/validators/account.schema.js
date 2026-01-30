const { z } = require("zod");

const createAccountSchema = z.object({
  name: z.string().min(1).max(120),
  contact: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  tags: z.array(z.string().max(30)).optional()
});

module.exports = { createAccountSchema };
