const ErrorHandler = {
  sendResponse: (res, data, statusCode = 200) => {
    try {
      if (!!res) {
        res
          .status(statusCode)
          .json({ success: "ok", data, status: statusCode });
      } else {
        throw "res not provided";
      }
    } catch (e) {
      throw e;
    }
  },
  sendErrorResponse: (res, error, statusCode = 500) => {
    let errResponse = {};
    errResponse.code =
      error.code || error.statusCode || error.status || statusCode;
    errResponse.error =
      errResponse.code == 401 ? "Unauthorized request" : error;
    res.status(errResponse.code).json(errResponse);
  },
};

module.exports = ErrorHandler;
