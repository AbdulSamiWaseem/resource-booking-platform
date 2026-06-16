import { createResource, getAllResourcesList } from "../dal/resourceDal";

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
