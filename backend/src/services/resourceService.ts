import { createResource, getAllResourcesList, findResourceById, deleteResource, updateResource } from "../dal/resourceDal";

export const addResource = async (body: { name: string; description: string }, resp: any) => {
  const { name, description } = body;

  const newResource = await createResource({ name, description });

  return {
    ...resp,
    success_message: "Resource created successfully",
    data: {
      resource: newResource,
    }
  };
};

export const getAllResources = async (resp: any) => {
  const resources = await getAllResourcesList();
  return {
    ...resp,
    success_message: "Resources retrieved successfully",
    data: {
      resources,
    }
  };
};

export const getResourceDetailsById = async (id: number, resp: any) => {
  const resource = await findResourceById(id);
  if (!resource) {
    return {
      error: true,
      error_message: "Resource not found",
    };
  }
  return {
    ...resp,
    success_message: "Resource Details fetched successfully",
    data: {
      resource,
    }
  };
};

export const deleteResourceById = async (id: number, resp: any) => {
  const resource = await findResourceById(id);
  if (!resource) {
    return {
      error: true,
      error_message: "Resource not found",
    };
  }
  await deleteResource(id);
  return {
    ...resp,
    success_message: "Resource deleted successfully",
  };
};

export const editResourceById = async (id: number, body: { name: string; description: string }, resp: any) => {
  const resource = await findResourceById(id);
  if (!resource) {
    return {
      error: true,
      error_message: "Resource not found",
    };
  }
  const updatedResource = await updateResource(id, body);
  return {
    ...resp,
    success_message: "Resource updated successfully",
    data: {
      resource: updatedResource,
    }
  };
};



