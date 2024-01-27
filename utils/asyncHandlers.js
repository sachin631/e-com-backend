const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message, success: false });
    }
  };
};


module.exports=asyncHandler;