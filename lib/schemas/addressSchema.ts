import {z} from "zod";

export const addressSchema = z.object({
    firstAddressLine: z.string().min(3, "Address line is required"),
    secondAddressLine: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().regex(/^\d{4,6}$/, "Invalid postal code"),
    country: z.string().min(2, "Country is required"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;