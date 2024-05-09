const errorMiddleware = (err, _req, res, _next) => {
  //console.log("Yha tak toh aya");
  console.log(err.message);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong!";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default errorMiddleware;
