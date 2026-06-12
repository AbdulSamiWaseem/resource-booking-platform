const Joi = require("joi");

function validateResource(resource) {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
  });
  return schema.validateAsync(resource);
}

module.exports = {
  validateResource,
};
