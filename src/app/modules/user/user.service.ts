import { TUser, TUserInfo } from './user.interface';
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
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

//update a user
const updateAUser = async (id: number, userData: TUser) => {
  if (await User.isUserExist(id)) {
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

  const userId = userData.userId;

  const result = User.findOneAndUpdate({ userId }, userData, {
    new: true,
  }).select({
    username: 1,
    fullName: 1,
    age: 1,
    email: 1,
    address: 1,
    _id: 0,
  });
  return result;
};

export const UserService = {
  CreateUser,
  getAllUsers,
  findAUserById,
  updateAUser,
};
