import Joi from "joi";

export function validateResource(resource) {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
  });
  return schema.validateAsync(resource);
}
