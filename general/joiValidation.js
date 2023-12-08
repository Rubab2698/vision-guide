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



module.exports = { validateSchema }





