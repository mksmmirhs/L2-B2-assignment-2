import { Schema, model } from 'mongoose';
import {
  TAddress,
  TFullName,
  TOrders,
  TUser,
  UserModel,
} from './user.interface';

const fullNameSchema = new Schema<TFullName>(
  {
    firstName: {
      type: String,
      required: [true, 'first name is missing'],
    },
    lastName: {
      type: String,
      required: [true, 'last name is missing'],
    },
  },
  { _id: false },
);

const addressSchema = new Schema<TAddress>(
  {
    street: {
      type: String,
      required: [true, 'Street is missing'],
    },
    city: {
      type: String,
      required: [true, 'City is missing'],
    },
    country: {
      type: String,
      required: [true, 'Country is missing'],
    },
  },
  { _id: false },
);

const ordersSchema = new Schema<TOrders>(
  {
    productName: {
      type: String,
      required: [true, 'Product name is missing'],
    },
    price: {
      type: Number,
      required: [true, 'Price is missing'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is missing'],
    },
  },
  { _id: false },
);

const userSchema = new Schema<TUser, UserModel>({
  userId: {
    type: Number,
    required: [true, 'Username is missing'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'username is missing'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is missing'],
  },
  fullName: fullNameSchema,
  age: {
    type: Number,
    required: [true, 'Username is missing'],
  },
  email: {
    type: String,
    required: [true, 'Password is missing'],
  },
  isActive: {
    type: Boolean,
    required: [true, 'Active status is missing'],
  },
  hobbies: [String],
  address: addressSchema,
  orders: [ordersSchema],
});

// finds if id is used
userSchema.statics.isUserExist = async function (userId: number) {
  const result = await User.findOne({ userId });
  return result;
};
// finds is the user with the username still exists
userSchema.statics.isUserNameExist = async function (username: string) {
  const result = await User.findOne({ username });
  return result;
};

export const User = model<TUser, UserModel>('User', userSchema);
