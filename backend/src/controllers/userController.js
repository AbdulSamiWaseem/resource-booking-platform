const { registerOrRetrieveUser } = require("../services/userService");
const { handleResponse } = require("../utils/responseHandler");
const { validateUser } = require("../validation/user");

const findOrCreateUser = async (req, res) => {
  await handleResponse(
    {
      handler: registerOrRetrieveUser,
      validationFn: validateUser,
      handlerParams: [req.body],
      successMessage: "Successful!",
    },
    req,
    res
  );
};

module.exports = {
  findOrCreateUser,
};
