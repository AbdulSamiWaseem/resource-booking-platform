import Joi from "joi";

export function validateBooking(booking: any) {
  const schema = Joi.object({
    resourceId: Joi.number().integer().required(),
    userId: Joi.string().required(),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().greater(Joi.ref("startTime")).required(),
  });
  return schema.validateAsync(booking);
}
