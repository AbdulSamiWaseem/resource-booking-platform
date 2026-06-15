import { Request, Response } from "express";
import { registerOrRetrieveUser } from "../services/userService";
import { handleResponse } from "../utils/responseHandler";
import { validateUser } from "../validation/user";

export const findOrCreateUser = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: registerOrRetrieveUser,
      validationFn: validateUser,
      handlerParams: [req.body],
      successMessage: "Successful!",
    },
    req,
    res
  );
};
