import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    errorDetails: [
      {
        path: req.originalUrl,
        message: "The requested API route does not exist.",
      },
    ],
  });
};

export default notFound;