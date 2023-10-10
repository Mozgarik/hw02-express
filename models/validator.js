import Joi from 'joi'


export const contactAddSchema = Joi.object({
    name: Joi.string()
           .min(3)
           .max(30)
           .required().messages({
       "any.required": `missing required name field`
     }),
     email: Joi.string()
           .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).messages({'string.email': 'email must be a valid email'})
           .required().messages({
       "any.required": `missing required email field`
     }),
     
     phone: Joi
     .string() 
     .required().messages({
       "any.required": `missing required phone field`
     })
     .pattern(new RegExp('^[0-9]{3,30}$')).messages({ 
        "string.pattern.base": `incorrect phone number`
     }),
   })
   
   export const contactFavoriteUpdate = Joi.object({
     favorite: Joi.boolean().messages({
        "boolean.base": `field favorite must be a boolean`
     })
     .required()
   })