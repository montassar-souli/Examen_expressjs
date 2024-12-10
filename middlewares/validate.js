const { schema } = require("../models/book");

// Dont change
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    return res.status(400).json({ type: error.name, message: error.message });
  }
};

module.exports = validate;
