import { TUser, TUserInfo } from './user.interface';
import { User } from './user.model';

// creating user into database
const CreateUser = async (user: TUser): Promise<TUserInfo> => {
  if (await User.isUserExist(user.userId)) {
    throw new Error('User already exist');
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

export const UserService = {
  CreateUser,
  getAllUsers,
};
