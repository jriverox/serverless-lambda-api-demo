// src/utils/schema-validator.js
const validateRequest = (contextPart, label, schema, options) => {
    if (!schema) return
    const { error } = schema.validate(contextPart, options)
    if (error) {
      throw new Error(`Invalid ${label} - ${error.message}`)
    }
  }
  // middleware de validacion que usaremos para validar los request pasandole un determinado esquema
  const validate = (schema) => (req, res, next) => {
    try {
      validateRequest(req.headers, 'Headers', schema.headers, { allowUnknown: true })
      validateRequest(req.params, 'URL Parameters', schema.params)
      validateRequest(req.query, 'URL Query', schema.query)
      if (req.body) {
        validateRequest(req.body, 'Request Body', schema.body)
      }
      return next()
    } catch (error) {
      res.error(422, error);
    }
  }
  
  module.exports = validate