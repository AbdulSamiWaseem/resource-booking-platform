import { Request, Response } from "express";
import { addResource, getAllResources, getResourceDetailsById, deleteResourceById, editResourceById } from "../services/resourceService";
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

export const removeResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleResponse(
    {
      handler: deleteResourceById,
      handlerParams: [Number(id)],
      successMessage: "Resource deleted successfully!",
    },
    req,
    res
  );
};

export const editResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleResponse(
    {
      handler: editResourceById,
      validationFn: validateResource,
      handlerParams: [Number(id), req.body],
      successMessage: "Resource updated successfully!",
    },
    req,
    res
  );
};



