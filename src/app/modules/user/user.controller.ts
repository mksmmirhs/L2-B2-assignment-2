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

// creating new user response
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const zodData = UserValidation.userValidation.parse(userData);
    const result = await UserService.CreateUser(zodData);

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: result.user_info,
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
        message: error.message || 'Something went wrong ',
        error: {
          code: 404,
          description: error.message || 'Something went wrong ',
        },
      });
    }
  }
};

// get all user response
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers();

    res.status(200).json({
      success: true,
      message: 'all user retrieve successfully!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};

// get user a user by id response

const findAUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserService.findAUserById(Number(userId));

    res.status(200).json({
      success: true,
      message: 'user retrieve successfully!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};

// updating existing user response
const updateAUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const { userId } = req.params;
    const zodData = UserValidation.userValidation.parse(userData);
    const result = await UserService.updateAUser(Number(userId), zodData);

    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
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
        message: error.message || 'Something went wrong ',
        error: {
          code: 404,
          description: error.message || 'Something went wrong ',
        },
      });
    }
  }
};

// delete a user response

const deleteAUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserService.deleteAUserById(Number(userId));

    res.status(200).json({
      success: true,
      message: 'user deleted successful!',
      data: result,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message,
      error: {
        code: 404,
        description: error.message,
      },
    });
  }
};

// add new order

const addAOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const orderData = req.body;
    const zodData = UserValidation.ordersValidation.parse(orderData);
    const result = await UserService.addAOrder(Number(userId), zodData);

    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
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
        message: error.message || 'Something went wrong ',
        error: {
          code: 404,
          description: error.message || 'Something went wrong ',
        },
      });
    }
  }
};

export const UserController = {
  createUser,
  getAllUsers,
  findAUserById,
  updateAUser,
  deleteAUserById,
  addAOrder,
};
