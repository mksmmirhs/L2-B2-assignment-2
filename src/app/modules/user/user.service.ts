import { TOrders, TUser, TUserInfo } from './user.interface';
import { User } from './user.model';

// creating user into database
const CreateUser = async (user: TUser): Promise<TUserInfo> => {
  if (await User.isUserExist(user.userId)) {
    throw new Error('User id already exist');
  }
  if (await User.isUserNameExist(user.username)) {
    throw new Error('Username already exist please provide unique username');
  }

  // adding virtual to the response
  const result: TUserInfo = (await User.create(user)).toJSON({
    virtuals: true,
  });
  return result;
};

// getting all users
const getAllUsers = async () => {
  // filtering the user as response requirement
  const users = User.find().select({
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    address: 1,
    _id: 0,
  });

  return users;
};

//find a user by id

const findAUserById = async (userId: number) => {
  if (!(await User.isUserExist(userId))) {
    throw new Error('No user found with specific userId');
  }
  const result = User.findOne({ userId }).select({
    userId: 1,
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    isActive: 1,
    hobbies: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

//update a user
const updateAUser = async (id: number, userData: TUser) => {
  if (!(await User.isUserExist(id))) {
    throw new Error('User not found to update');
  }

  // Check if the new userId conflicts with an existing user
  const existingUser = await User.findOne({ userId: id });
  if (
    (await User.isUserExist(userData.userId)) &&
    existingUser?.userId !== userData.userId
  ) {
    throw new Error('User id already exist provide unique one');
  }

  // Check if the new username conflicts with an existing user
  if (
    (await User.isUserNameExist(userData.username)) &&
    existingUser?.username !== userData.username
  ) {
    throw new Error(
      'Username already exist, provide unique username to update',
    );
  }

  const userId = id;

  const result = User.findOneAndUpdate({ userId }, userData, {
    new: true,
  }).select({
    userId: 1,
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    isActive: 1,
    hobbies: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

//update a user

const deleteAUserById = async (userId: number) => {
  if (!(await User.isUserExist(userId))) {
    throw new Error('No user found with specific userId');
  }
  await User.deleteOne({ userId });
  return null;
};

//add order

const addAOrder = async (id: number, Order: TOrders) => {
  if (!(await User.isUserExist(id))) {
    throw new Error('User not found to add order');
  }

  await User.updateOne({ userId: id }, { $push: { orders: Order } });
  return null;
};

// get all orders from user

const getAllOrderFromUser = async (id: number) => {
  if (!(await User.isUserExist(id))) {
    throw new Error('User not found to get orders');
  }

  const result = await User.findOne({ userId: id }).select({
    orders: 1,
    _id: 0,
  });
  return result;
};

// get total price of order of a specific user

const getTotalPriceOfOrder = async (id: number) => {
  if (!(await User.isUserExist(id))) {
    throw new Error('User not found to get orders');
  }
  const result = await User.aggregate([
    // Stage 1 find the user with id
    {
      $match: { userId: id },
    },
    // Stage 2 returns an array containing total sum of each order
    {
      $project: {
        total_price: {
          $map: {
            input: '$orders',
            as: 'order',
            in: {
              $multiply: ['$$order.price', '$$order.quantity'],
            },
          },
        },
      },
    },
    // stage 3 returns the sum of total_price array
    {
      $project: {
        totalPrice: { $sum: '$total_price' },
        _id: 0,
      },
    },
  ]);

  // if total price is zero sends no order from the user it sends it
  return result[0].totalPrice === 0 ? 'User have no order' : result[0];
};

export const UserService = {
  CreateUser,
  getAllUsers,
  findAUserById,
  updateAUser,
  deleteAUserById,
  addAOrder,
  getAllOrderFromUser,
  getTotalPriceOfOrder,
};
