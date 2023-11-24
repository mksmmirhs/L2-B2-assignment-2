import { Schema, model } from 'mongoose';
import {
  TAddress,
  TFullName,
  TOrders,
  TUser,
  UserModel,
} from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

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

const userSchema = new Schema<TUser, UserModel>(
  {
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
      required: [true, 'age is missing'],
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
  },
  {
    versionKey: false,
  },
);

// finds if id is used
userSchema.statics.isUserExist = async function (userId: number) {
  return !!(await User.findOne({ userId }));
};
// finds is the user with the username still exists
userSchema.statics.isUserNameExist = async function (username: string) {
  return !!(await User.findOne({ username }));
};

// virtual

userSchema.virtual('user_info').get(function (this) {
  const username = this.username;
  const fullName = this.fullName;
  const age = this.age;
  const email = this.email;
  const address = this.address;

  const user_info = { username, fullName, age, email, address };
  return user_info;
});

// pre save middleware

// hashing the password
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const data = this;
  data.password = await bcrypt.hash(data.password, Number(config.salt_round));
  next();
});
userSchema.pre('findOneAndUpdate', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const data = this.getUpdate() as Partial<TUser>;
  // Check if the update operation includes the password field
  if (data.password) {
    data.password = await bcrypt.hash(data.password, Number(config.salt_round));
  }
  next();
});

// query middlewares
userSchema.pre('find', async function (next) {
  this.select({ password: 0 });
  next();
});

userSchema.pre('findOne', async function (next) {
  this.select({ password: 0 });

  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().push({ $project: { password: 0 } });
  next();
});

// post save middleware
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (doc: any, next) {
    // forcing doc to any to delete password as it is required on user type

    delete doc.password;

    next();
  },
);

export const User = model<TUser, UserModel>('User', userSchema);
