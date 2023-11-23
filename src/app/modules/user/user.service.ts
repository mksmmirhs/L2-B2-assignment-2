import { TUser } from './user.interface';
import { User } from './user.model';

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

export const UserService = {
  CreateUser,
};
