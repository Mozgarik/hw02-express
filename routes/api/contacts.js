import express from 'express'
import HttpError from '../../helpers/HttpError.js'
import Contact from '../../models/Contact.js'
import { isValidObjectId } from 'mongoose'
import { contactAddSchema } from "../../models/validator.js";
import { contactFavoriteUpdate } from '../../models/validator.js';



const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find()
  res.json(result)
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:contactId', async (req, res, next) => {
  const id = req.params.contactId
   if (!isValidObjectId(id)) {
      return next(HttpError(404, `${id} not valid id`))
  }
  try {
    const result = await Contact.findById(id)
    if(!result){
      throw HttpError(404, `not found`)
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
  if (Object.keys(req.body).length !== 0) {
    try {
    const validateContact = contactAddSchema.validate(req.body)
    if(!validateContact.error) {
       const result = await Contact.create(req.body)
      res.status(200).json(result)
    } else {
         res.status(400).json({
          message: validateContact.error.message
         })
    }
} catch (error) {
  next(error)
}
  } else {
    res.status(400).json({
      "message": "missing fields"
    })
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId
  if (!isValidObjectId(contactId)) {
    return res.status(404).json({
      "message": "Not found"
    })
}
try {
  const result = await Contact.findByIdAndDelete(contactId)
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

router.put('/:contactId', async (req, res, next) => {
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

export default router
