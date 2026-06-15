import { Request, Response } from "express";
import { addResource } from "../services/resourceService";
import { handleResponse } from "../utils/responseHandler";
import { validateResource } from "../validation/resource";

export const createResource = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: addResource,
      validationFn: validateResource,
      handlerParams: [req.body],
      successMessage: "Resource created successfully!",
    },
    req,
    res
  );
};
