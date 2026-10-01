import * as z from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.'),

  password: z
    .string()
    .min(
      6,
      'Password must be at least 6 characters.',
    ),
})

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      'Name must be at least 2 characters.',
    ),

  email: z
    .string()
    .email('Please enter a valid email address.'),

  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s-]{7,20}$/,
      'Please enter a valid phone number.',
    ),

  address: z
    .string()
    .trim()
    .min(
      10,
      'Address must be at least 10 characters.',
    ),

  city: z
    .string()
    .trim()
    .min(
      2,
      'City must be at least 2 characters.',
    ),

  postalCode: z
    .string()
    .trim()
    .regex(
      /^[0-9]{5,10}$/,
      'Postal code must contain 5-10 digits.',
    ),
})

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(
      2,
      'First name must be at least 2 characters.',
    ),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      'Last name must be at least 2 characters.',
    ),

  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s-]{7,20}$/,
      'Please enter a valid phone number.',
    ),

  city: z
    .string()
    .trim()
    .min(
      2,
      'City must be at least 2 characters.',
    ),

  address: z
    .string()
    .trim()
    .min(
      10,
      'Address must be at least 10 characters.',
    ),
})

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      2,
      'Product name must be at least 2 characters.',
    ),

  price: z
    .string()
    .min(
      1,
      'Price is required.',
    )
    .refine(
      value =>
        !Number.isNaN(Number(value)) &&
        Number(value) >= 0,
      'Price must be a valid positive number.',
    ),

  stock: z
    .string()
    .min(
      1,
      'Stock is required.',
    )
    .refine(
      value =>
        Number.isInteger(Number(value)) &&
        Number(value) >= 0,
      'Stock must be a whole number.',
    ),

  category: z
    .string()
    .min(
      1,
      'Please select a category.',
    ),
})