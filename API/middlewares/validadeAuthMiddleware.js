export function validateSignIn(req, res, next) {
  const signupSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(15).required().label("Password"),
    password_confirmation: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });

  const validation = signupSchema.validate(req.body, {
    abortEarly: false,
  });

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  next();
}

export function validateSignUp(req, res, next) {
  const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  const validation = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  next();
}
