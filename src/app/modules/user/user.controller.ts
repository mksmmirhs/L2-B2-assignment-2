import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserValidation } from './user.validator';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorFormatterZod = (error: any) => {
  // this converts zod error message to json as it is an array of objects so selects the first element and returns the response error object.

  const message = JSON.parse(error.message)[0].message;

  const err = {
    success: false,
    message,
    error: {
      code: 404,
      description: message,
    },
  };

  return err;
};

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const zodData = UserValidation.userValidation.parse(userData);
    const result = await UserService.CreateUser(zodData);
    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // checks if the error is from zod else gets normal message from error
    if (error instanceof ZodError) {
      const errRes = errorFormatterZod(error);
      res.json(errRes);
    } else {
      res.json({
        success: false,
        message: error.message,
        error: {
          code: 404,
          description: error.message,
        },
      });
    }
  }
};

export const UserController = {
  createUser,
};
