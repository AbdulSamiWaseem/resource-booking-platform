import { Request, Response } from "express";
import { addResource, getAllResources } from "../services/resourceService";
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

export const listResources = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getAllResources,
      handlerParams: [],
      successMessage: "Resources retrieved successfully!",
    },
    req,
    res
  );
};
