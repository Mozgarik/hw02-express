import express from 'express'
import authenticate from '../../middleWare/authenticate.js'
import upload from '../../middleWare/upload.js'
import userRouter from '../../controllers/users-controller.js'

const usersRouter = express.Router()

// usersRouter.use(authenticate)

usersRouter.post('/register', upload.single("avatar"),  userRouter.userReg)

usersRouter.post('/login', userRouter.userLog)

usersRouter.get('/current', userRouter.currentUser)

usersRouter.post('/logout', userRouter.userLogout)

usersRouter.patch('/avatars', upload.single('avatar'), userRouter.avatarPut) 


export default usersRouter
