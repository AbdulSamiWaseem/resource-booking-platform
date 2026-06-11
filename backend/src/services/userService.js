const { findUserByEmail, createUser } = require("../dal/userDal");

const registerOrRetrieveUser = async (body, resp) => {
  const { name, email } = body;

  if (!name || !email) {
    resp.error = true;
    resp.error_message = "Name and email are required";
    return resp;
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    resp.data = {
      message: "User already exists",
      user: existingUser,
      isNew: false,
    };
    return resp;
  }

  const newUser = await createUser({ name, email });
  resp.data = {
    message: "User created successfully",
    user: newUser,
    isNew: true,
  };
  return resp;
};

module.exports = {
  registerOrRetrieveUser,
};
