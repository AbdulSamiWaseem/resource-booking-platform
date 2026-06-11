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
    resp.success_message = "User already exists";
    resp.data = {
      user: existingUser,
      isNew: false,
    };
    return resp;
  }

  const newUser = await createUser({ name, email });
  resp.success_message = "User created successfully";
  resp.data = {
    user: newUser,
    isNew: true,
  };
  return resp;
};

module.exports = {
  registerOrRetrieveUser,
};
