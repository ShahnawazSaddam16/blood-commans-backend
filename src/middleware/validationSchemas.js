const { z } = require("zod");

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const bloodStatuses = [
  "pending",
  "accepted",
  "blood_available",
  "in_transit",
  "done",
  "rejected",
  "cancelled",
];
const hospitalStatuses = ["open", "fulfilled", "closed"];
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB id");
const neededBySchema = z.union([
  z.iso.datetime({ offset: true, local: true }),
  z.iso.date(),
  z.literal("")
]);

const generateBloodRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.email().trim().toLowerCase(),
    bloodtype: z.enum(bloodTypes),
    hospitalname: z.string().trim().min(1).max(150),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number"),
    bloodrequirement: z.number().int().positive().max(1000),
    rememberMe: z.boolean().optional().default(false),
  })
  .strict();

const hospitalLoginSchema = z
  .object({
    hospitalId: z.string().trim().min(1).max(100).toLowerCase(),
    password: z.string().min(6).max(128),
  })
  .strict();

const idParamsSchema = z.object({ id: objectId }).strict();

const positivePageQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

const publicBloodRequestQuerySchema = positivePageQuerySchema
  .extend({
    bloodtype: z.enum(bloodTypes).optional(),
    urgency: z.enum(["normal", "urgent", "critical"]).optional(),
    search: z.string().trim().max(100).optional(),
  })
  .strict();

const hospitalMyRequestQuerySchema = positivePageQuerySchema
  .extend({
    status: z.enum(hospitalStatuses).optional(),
  })
  .strict();

const allBloodRequestQuerySchema = positivePageQuerySchema
  .extend({
    status: z.enum(["active", ...bloodStatuses]).optional(),
    bloodtype: z.enum(bloodTypes).optional(),
    search: z.string().trim().max(100).optional(),
  })
  .strict();

const createHospitalBloodRequestSchema = z
  .object({
    hospitalname: z.string().trim().min(1).max(150),
    bloodtype: z.enum(bloodTypes),
    bloodrequirement: z.number().int().positive().max(1000),
    urgency: z
      .enum(["normal", "urgent", "critical"])
      .optional()
      .default("normal"),
    contactnumber: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/)
      .optional()
      .default(""),
    description: z.string().trim().max(1000).optional().default(""),
    neededBy: neededBySchema.nullable().optional().default(null),
  })
  .strict();

const updateHospitalBloodRequestSchema = z
  .object({
    hospitalname: z.string().trim().min(1).max(150).optional(),
    bloodtype: z.enum(bloodTypes).optional(),
    bloodrequirement: z.number().int().positive().max(1000).optional(),
    urgency: z.enum(["normal", "urgent", "critical"]).optional(),
    contactnumber: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/)
      .optional(),
    description: z.string().trim().max(1000).optional(),
    neededBy: neededBySchema.nullable().optional(),
    status: z.enum(hospitalStatuses).optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );

const editBloodRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    email: z.email().trim().toLowerCase().optional(),
    bloodtype: z.enum(bloodTypes).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/)
      .optional(),
    hospitalname: z.string().trim().min(1).max(150).optional(),
    bloodrequirement: z.number().int().positive().max(1000).optional(),
    description: z.string().trim().max(1000).optional(),
    contactnumber: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{7,20}$/)
      .optional(),
    neededBy: neededBySchema.nullable().optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    "At least one field is required",
  );

const updateBloodStatusSchema = z
  .object({
    status: z.enum(bloodStatuses),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

const deleteStatusParamsSchema = z
  .object({
    status: z.enum(["done", "rejected", "cancelled"]),
  })
  .strict();

module.exports = {
  generateBloodRequestSchema,
  hospitalLoginSchema,
  idParamsSchema,
  publicBloodRequestQuerySchema,
  hospitalMyRequestQuerySchema,
  allBloodRequestQuerySchema,
  createHospitalBloodRequestSchema,
  updateHospitalBloodRequestSchema,
  editBloodRequestSchema,
  updateBloodStatusSchema,
  deleteStatusParamsSchema,
};
