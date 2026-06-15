import Joi from "joi";

export function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().trim(),
    email: Joi.string().required().email().trim(),
  });
  return schema.validateAsync(user);
}
