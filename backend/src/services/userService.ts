import { findUserByEmail, createUser } from "../dal/userDal";

export const registerOrRetrieveUser = async (
  body: { name: string; email: string },
  resp: any
) => {
  try {
    const { name, email } = body;

    if (!name || !email) {
      return {
        error: true,
        error_message: "Name and email are required",
      };
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      if (existingUser.name !== name) {
        return {
          error: true,
          error_message: "Name does not match the registered name for this email",
        };
      }
      return {
        ...resp,
        success_message: "User verified successfully",
        data: {
          user: existingUser,
          isNew: false
        }
      };
    }

    const newUser = await createUser({ name, email });
    return {
      ...resp,
      success_message: "User created successfully",
      data: {
        user: newUser,
        isNew: true
      }
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to register/retrieve user",
    };
  }
};
