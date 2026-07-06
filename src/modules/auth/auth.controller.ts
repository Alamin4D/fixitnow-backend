import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully.",
    data: result,
  });
});

// const login = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthService.login(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "User logged in successfully.",
//     data: result,
//   });
// });

// const getMe = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthService.getMe(req.user!.id);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "User profile retrieved successfully.",
//     data: result,
//   });
// });

export const AuthController = {
  register,
//   login,
//   getMe,
};