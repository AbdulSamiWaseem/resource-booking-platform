const { registerOrRetrieveUser } = require("../services/userService");
const { createResponseObject, RENDER_BAD_REQUEST } = require("../utils/constants");
const { validateUser } = require("../validation/user");

const handleResponse = async (options, req, res) => {
  try {
    const { handler, validationFn, handlerParams, successMessage } = options;

    if (validationFn) {
      try {
        await validationFn(req.body);
      } catch (e) {
        console.log(e);
        return res.status(400).json({
          code: 400,
          message: e.details[0].message.replace(/\"/g, ""),
        });
      }
    }

    const RESP = createResponseObject();
    const resp = await handler(...handlerParams, RESP);

    if (resp.error) {
      return res.status(400).json({
        code: 400,
        message: resp.error_message,
      });
    }

    if (!resp.auth) {
      return res.status(403).json({
        code: 403,
        message: resp.error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: successMessage,
      data: resp.data,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};

const findOrCreateUser = async (req, res) => {
  await handleResponse(
    {
      handler: registerOrRetrieveUser,
      validationFn: validateUser,
      handlerParams: [req.body],
      successMessage: "User registered/retrieved successfully!",
    },
    req,
    res
  );
};

module.exports = {
  findOrCreateUser,
};
