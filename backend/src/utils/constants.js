const createResponseObject = () => {
  return {
    error: false,
    auth: true,
    error_message: "",
    data: null,
  };
};

const RENDER_BAD_REQUEST = (res, error) => {
  console.error("Controller handler error caught:", error);
  return res.status(400).json({
    code: 400,
    message: error.message || error || "Bad Request",
  });
};

module.exports = {
  createResponseObject,
  RENDER_BAD_REQUEST,
};
