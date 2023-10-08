import express from 'express'
import contactService from '../../models/contacts.js'
import HttpError from '../../helpers/HttpError.js'
import Joi from 'joi'
import Contact from '../../models/contact.js'
import { isValidObjectId } from 'mongoose'


const contactAddSchema = Joi.object({
 name: Joi.string()
        .alphanum().messages({"string.alphanum": "name must only contain alpha-numeric characters"})
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
  
  phone: Joi.number().messages({ "number.base": `phone must be a number` })
  .integer()  
  .min(0)
  .max(1000000000000000).messages({ "number.unsafe": 'phone must be a correct number' })
  .required().messages({
    "any.required": `missing required phone field`
  })
})

const contactFavoriteUpdate = Joi.object({
  favorite: Joi.boolean().required()
})

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
<<<<<<< Updated upstream
    const result = await contactService.listContacts()
=======
    const result = await Contact.find()
    console.log(result)
>>>>>>> Stashed changes
  res.json(result)
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:contactId', async (req, res, next) => {
<<<<<<< Updated upstream
=======
  const id = req.params.contactId
   if (!isValidObjectId(id)) {
      return next(HttpError(404, `${id} not valid id`))
  }
>>>>>>> Stashed changes
  try {
    const result = await Contact.findById(id)
   
    if(!result){
      throw HttpError(404, `contact with id: ${req.params.contactId} not found`)
    }
      res.json(result)
  } catch (error) {
    const {status = 500, message = "Server error"} = error;
      res.status(status).json({
        message,
      })
  }
})


router.post('/', async (req, res, next) => {
  try {  
      const result = await Contact.create(req.body)
      res.status(201).json(result)
    }
 catch (error) {
  res.status(error.status).json({
    message: error.message
  })
}
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId
  if (!isValidObjectId(contactId)) {
    return next(HttpError(404, `${id} not valid id`))
}
try {
  const result = await Contact.findByIdAndDelete(contactId)
  if (!result) {
    res.status(404).json({
      message: `not found`
    })
  }

  res.json({
    message: "contact deleted"
  })

} catch (error) {
  next(error)
}
})

router.put('/:contactId', async (req, res, next) => {
  const id = req.params.contactId
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`))
}
  try {
    const validateContact = contactAddSchema.validate(req.body)
    if(!validateContact.error) {
<<<<<<< Updated upstream
      const id = req.params.contactId
      const result = await contactService.updateContactById(id, req.body)
      if(result === null) {
        res.status(404).json({
          message: 'Not Found'
        })
      }else {
        res.status(200).json(result)
      }
=======
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
      res.status(200).json(result)
>>>>>>> Stashed changes
    } else {
         res.status(400).json({
          message: validateContact.error.message
         })
    }
} catch (error) {
  next(error)
}
})



router.patch('/:contactId/favorite', async (req, res, next) => {
  const id = req.params.contactId
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`))
}
  try {
    if (Object.keys(req.body).length !== 0) {
      const validateContact = contactFavoriteUpdate.validate(req.body)
    if(!validateContact.error) {
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true})
      res.status(200).json(result)
    } else {
         res.status(400).json({
          message: contactFavoriteUpdate.error.message
         })
    }
    }else {
      res.status(400).json({
        message: 'missing fields'
      })
    }
} catch (error) {
  next(error)
}
})




export default router
