import { createResource, getAllResourcesList, findResourceById, deleteResource } from "../dal/resourceDal";

export const addResource = async (body: { name: string; description: string }, resp: any) => {
  const { name, description } = body;

  const newResource = await createResource({ name, description });

  resp.success_message = "Resource created successfully";
  resp.data = {
    resource: newResource,
  };

  return resp;
};

export const getAllResources = async (resp: any) => {
  const resources = await getAllResourcesList();
  resp.success_message = "Resources retrieved successfully";
  resp.data = {
    resources,
  };
  return resp;
};

export const getResourceDetailsById = async (id: number, resp: any) => {
  const resource = await findResourceById(id);
  if (!resource) {
    resp.error = true;
    resp.error_message = "Resource not found";
    return resp;
  }
  resp.success_message = "Resource Details fetched successfully";
  resp.data = {
    resource,
  };
  return resp;
};

export const deleteResourceById = async (id: number, resp: any) => {
  const resource = await findResourceById(id);
  if (!resource) {
    resp.error = true;
    resp.error_message = "Resource not found";
    return resp;
  }
  await deleteResource(id);
  resp.success_message = "Resource deleted successfully";
  return resp;
};


