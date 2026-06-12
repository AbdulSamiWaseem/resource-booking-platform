const { createResource } = require("../dal/resourceDal");

const addResource = async (body, resp) => {
  const { name, description } = body;

  const newResource = await createResource({ name, description });

  resp.success_message = "Resource created successfully";
  resp.data = {
    resource: newResource,
  };

  return resp;
};

module.exports = {
  addResource,
};
