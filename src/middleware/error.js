const errorHandler = (req, res, next) => {
  const error = new Error("Api not found");
  return res.status(404).send({ message: error.message });
  next();
};

export default errorHandler;
