import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
    "/register",
    validateRequest([
        { field: "name", required: true, type: "string", minLength: 2, maxLength: 100 },
        { field: "email", required: true, type: "email" },
        { field: "password", required: true, type: "string", minLength: 6, maxLength: 100 },
        { field: "role", required: true, type: "string", enum: ["CUSTOMER", "TECHNICIAN"] },
        { field: "phone", type: "string" },
        { field: "address", type: "string" },
    ]),
    AuthController.register
);


// router.post(
//   "/login",
//   validateRequest([
//     { field: "email", required: true, type: "email" },
//     { field: "password", required: true, type: "string", minLength: 1 },
//   ]),
//   AuthController.login
// );

// router.get("/me", auth(), AuthController.getMe);

export const AuthRoutes = router;