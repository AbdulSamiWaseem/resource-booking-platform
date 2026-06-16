import { findUserByEmail, createUser } from "../dal/userDal";

export const registerOrRetrieveUser = async (
  body: { name: string; email: string },
  resp: any
) => {
  const { name, email } = body;

  if (!name || !email) {
    resp.error = true;
    resp.error_message = "Name and email are required";
    return resp;
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    if (existingUser.name !== name) {
      resp.error = true;
      resp.error_message = "Name does not match the registered name for this email";
      return resp;
    }
    resp.success_message = "User verified successfully";
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
