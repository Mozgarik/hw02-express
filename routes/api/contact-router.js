import express from 'express'
import authenticate from '../../middleWare/authenticate.js'
import contactRouter from '../../controllers/contacts-controller.js'
import upload from '../../middleWare/upload.js'

const  contactsRouter = express.Router()

contactsRouter.use(authenticate)

contactsRouter.get('/', contactRouter.getContacts)

contactsRouter.get('/:contactId', contactRouter.getContactsById)

contactsRouter.post('/', upload.single("avatar"), contactRouter.postContact)

contactsRouter.delete('/:contactId', contactRouter.contactRemove)

contactsRouter.put('/:contactId', contactRouter.contactPut)

contactsRouter.patch('/:contactId/favorite', contactRouter.ContactPatch)

export default contactsRouter
