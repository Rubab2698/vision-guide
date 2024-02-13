const validateSchema = (schema) => (req, res, next) => {
  try {

    let _obj = { body: { ...req.body }, query: { ...req.query }, params: { ...req.params } };
    Object.keys(_obj).forEach(key => {
      if ( !Object.keys(_obj[key]).length ) {
        delete _obj[key];
      }
    });
      const { error, value } = schema.validate(_obj);
      console.log('value:', value); // Log the request body

      if (error) {
        throw error;
      }
      req.validatedData = value;
      next();
  } catch (error) {
    console.error('Validation error:', error); // Log validation errors
    next(error);
  }
};

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

module.exports = { validateSchema ,objectId}





