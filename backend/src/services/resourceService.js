const { createResource, getAllResourcesList } = require("../dal/resourceDal");

const addResource = async (body, resp) => {
  const { name, description } = body;

  const newResource = await createResource({ name, description });

  resp.success_message = "Resource created successfully";
  resp.data = {
    resource: newResource,
  };

  return resp;
};

const getAllResources = async (resp) => {
  const resources = await getAllResourcesList();
  resp.success_message = "Resources retrieved successfully";
  resp.data = {
    resources,
  };
  return resp;
};

module.exports = {
  addResource,
  getAllResources,
};
