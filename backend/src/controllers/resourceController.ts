import { Request, Response } from "express";
import { addResource, getAllResources, getResourceDetailsById } from "../services/resourceService";
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

export const getResourceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleResponse(
    {
      handler: getResourceDetailsById,
      handlerParams: [Number(id)],
      successMessage: "Resource details retrieved successfully!",
    },
    req,
    res
  );
};

