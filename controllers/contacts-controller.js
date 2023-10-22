<<<<<<< Updated upstream:routes/api/contacts.js
import express from 'express'
import contactService from '../../models/contacts.js'
import HttpError from '../../helpers/HttpError.js'
import Joi from 'joi'

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

const router = express.Router()

router.get('/', async (req, res, next) => {
=======
import HttpError from '../helpers/HttpError.js'
import Contact from '../models/Contact.js'
import { contactAddSchema } from "../models/validator.js";
import { isValidObjectId } from 'mongoose';
import { contactFavoriteUpdate } from '../models/validator.js';

const getContacts = async (req, res, next) => {
  const {_id: owner} = req.user
  const {page = 1, limit = 10} = req.query
  const skip = (page - 1) * limit
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email")
>>>>>>> Stashed changes:controllers/contacts-controller.js
  try {
    const result = await contactService.listContacts()
  res.json(result)
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  } 
}

<<<<<<< Updated upstream:routes/api/contacts.js
router.get('/:contactId', async (req, res, next) => {
=======
const getContactsById = ('/:contactId', async (req, res, next) => {
  const id = req.params.contactId
   if (!isValidObjectId(id)) {
      return next(HttpError(404, `${id} not valid id`))
  }
>>>>>>> Stashed changes:controllers/contacts-controller.js
  try {
    const result = await contactService.getContactById(req.params.contactId)
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

<<<<<<< Updated upstream:routes/api/contacts.js
router.post('/', async (req, res, next) => {
  try {
=======
const postContact = ('/', async (req, res, next) => {
  if (Object.keys(req.body).length !== 0) {
    try {
>>>>>>> Stashed changes:controllers/contacts-controller.js
    const validateContact = contactAddSchema.validate(req.body)
    if(!validateContact.error) {
      const result = await contactService.addContact(req.body)
      res.status(201).json(result)
    } else {
        console.log(validateContact.error)
         res.status(400).json({
          message: validateContact.error.message
         })
    }
} catch (error) {
  next(error)
}
})

router.delete('/:contactId', async (req, res, next) => {
try {
  const {contactId} = req.params
  const result = await contactService.removeContact(contactId)
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
  try {
    const validateContact = contactAddSchema.validate(req.body)
    if(!validateContact.error) {
      const id = req.params.contactId
      const result = await contactService.updateContactById(id, req.body)
      if(result === null) {
        res.status(404).json({
          message: 'Not Found'
        })
      }else {
        res.status(200).json(result)
      }
    } else {
         res.status(400).json({
          message: validateContact.error.message
         })
    }
} catch (error) {
  next(error)
}
})

<<<<<<< Updated upstream:routes/api/contacts.js
export default router
=======
const contactRemove = ('/:contactId', async (req, res, next) => {
  const id = req.params.contactId
  if (!isValidObjectId(id)) {
    return res.status(404).json({
      "message": "Not found"
    })
}
try {
  const result = await Contact.findByIdAndDelete(id)
  if (!result) {
    res.status(404).json({
      "message": `not found`
    })
  }else {
    res.json({
    message: "contact deleted"
  })}
} catch (error) {
  next(error) 
}
})

 const contactPut = ('/:contactId', async (req, res, next) => {
  const id = req.params.contactId
  const validateContact = contactAddSchema.validate(req.body)
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`))
}
  if (Object.keys(req.body).length !== 0) {
     try {
          if(!validateContact.error) {
            const result = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
              if (result === null) {
                res.status(404).json({
                  "message": "not found"
                })
              } else {
                res.status(200).json(result)
              }
          } else {
              res.status(400).json({
                message: validateContact.error.message
              })
          }
    } catch (error) {
        next(error)}
  }else {
    res.status(400).json({
      "message": "missing fields"
    })
  }
})


const ContactPatch = ('/:contactId/favorite', async (req, res, next) => {
  const id = req.params.contactId
          if (!isValidObjectId(id)) {
            return next(HttpError(404, `${id} not valid id`))
        }
      try {
            if (Object.keys(req.body).length !== 0) {
              const validateContact = contactFavoriteUpdate.validate(req.body)
                if(!validateContact.error) {
                  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true})
                  if (result === null) {
                    res.status(404).json({
                      "message": "not found"
                    })
                  } else {
                      res.status(200).json(result)
                  }
                } else {
                    res.status(400).json({
                      message: validateContact.error.message
                    })
                }
            }else {
              res.status(400).json({
                message: 'missing field favorite'
              })
            }
    } catch (error) {
      next(error)
    }
    })

export default {
  getContacts, 
  getContactsById,
  postContact,
  contactRemove,
  contactPut,
  ContactPatch
}
>>>>>>> Stashed changes:controllers/contacts-controller.js
