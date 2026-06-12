const { addResource, getAllResources } = require("../services/resourceService");
const { handleResponse } = require("../utils/responseHandler");
const { validateResource } = require("../validation/resource");

const createResource = async (req, res) => {
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

const listResources = async (req, res) => {
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

module.exports = {
  createResource,
  listResources,
};
