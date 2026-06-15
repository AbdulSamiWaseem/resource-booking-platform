import { Response } from "express";

export const createResponseObject = () => {
  return {
    error: false,
    auth: true,
    error_message: "",
    success_message: "",
    data: null,
  };
};

export const RENDER_BAD_REQUEST = (res: Response, error: any) => {
  console.error("Controller handler error caught:", error);
  return res.status(400).json({
    code: 400,
    message: error.message || error || "Bad Request",
  });
};
