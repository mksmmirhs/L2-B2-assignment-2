import z from 'zod';

const fullNameValidation = z.object({
  firstName: z.string({
    required_error: 'firstName is required',
    invalid_type_error: 'firstName must be a string',
  }),
  lastName: z.string({
    required_error: 'lastName is required',
    invalid_type_error: 'lastName must be a string',
  }),
});

const addressValidation = z.object({
  street: z.string({
    required_error: 'street is required',
    invalid_type_error: 'street must be a string',
  }),
  city: z.string({
    required_error: 'city is required',
    invalid_type_error: 'city must be a string',
  }),
  country: z.string({
    required_error: 'country is required',
    invalid_type_error: 'country must be a string',
  }),
});

const ordersValidation = z.object({
  productName: z.string({
    required_error: 'productName is required',
    invalid_type_error: 'productName must be a string',
  }),
  price: z.number({
    required_error: 'price is required',
    invalid_type_error: 'price must be a number',
  }),
  quantity: z.number({
    required_error: 'quantity is required',
    invalid_type_error: 'quantity must be a number',
  }),
});

const userValidation = z.object({
  userId: z.number({
    required_error: 'userId is required',
    invalid_type_error: 'userId must be a number',
  }),
  username: z.string({
    required_error: 'username is required',
    invalid_type_error: 'username must be a string',
  }),
  password: z.string({
    required_error: 'username is required',
    invalid_type_error: 'username must be a string',
  }),
  fullName: fullNameValidation,
  age: z.number({
    required_error: 'age is required',
    invalid_type_error: 'age must be a number',
  }),
  email: z.string({
    required_error: 'email is required',
    invalid_type_error: 'email must be a string',
  }),
  isActive: z.boolean({
    required_error: 'isActive is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
  hobbies: z
    .string({
      required_error: 'hobbies is required',
      invalid_type_error: 'hobbies must be a array of string',
    })
    .array(),
  address: addressValidation,
  orders: ordersValidation.array().optional(),
});
export const UserValidation = { userValidation, ordersValidation };
