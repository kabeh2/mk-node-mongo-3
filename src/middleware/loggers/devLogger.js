const morgan = require("morgan");

const devLogger = async (req, res, next) => {
  try {
    const morganLogger = morgan("tiny");
    morganLogger(req, res, next);
  } catch (error) {
    next();
  }
};

module.exports = devLogger;
