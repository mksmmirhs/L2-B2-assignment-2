import { TUser } from './user.interface';
import { User } from './user.model';

// creating user into database
const CreateUser = async (user: TUser) => {
  if (await User.isUserExist(user.userId)) {
    throw new Error('User already exist');
  }
  if (await User.isUserNameExist(user.username)) {
    throw new Error('Username already exist please provide unique username');
  }
  const result = await User.create(user);
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
