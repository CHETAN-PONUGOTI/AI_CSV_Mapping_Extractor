import { z } from 'zod';

export const CrmLeadSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email().nullable().or(z.literal('')),
  country_code: z.string().nullable(),
  mobile_without_country_code: z.string().nullable().or(z.literal('')),
  crm_status: z.enum(['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']).default('DID_NOT_CONNECT'),
}).refine(data => data.email || data.mobile_without_country_code, {
  message: "Record must contain either email or mobile number",
});