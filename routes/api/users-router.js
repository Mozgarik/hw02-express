import express from 'express'
import upload from '../../middleWare/upload.js'
import userRouter from '../../controllers/users-controller.js'


const usersRouter = express.Router()

usersRouter.post('/register', upload.single("avatar"),  userRouter.userReg)

usersRouter.post('/login', userRouter.userLog)

usersRouter.get('/current', userRouter.currentUser)

usersRouter.post('/logout', userRouter.userLogout)

usersRouter.patch('/avatars', upload.single('avatar'), userRouter.avatarPut) 

usersRouter.get('/verify/:verificationCode', userRouter.verify)

usersRouter.post('/verify', userRouter.resendVerifyEmail)


export default usersRouter
