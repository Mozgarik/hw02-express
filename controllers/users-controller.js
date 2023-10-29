import User from "../models/User.js";
import { userSignInSchema, userSignUpSchema } from "../models/validator.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import path from 'path';
import gravatar from "gravatar"
import Jimp from "jimp";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const {JWT_SECRET, BASE_URL} = process.env
const avatarsPath = path.resolve("public", "avatars")


const userReg = async (req, res, next) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  const hashPassword = await bcrypt.hash(password, 10)
  const verificationCode = nanoid()
  const avatarUrl = gravatar.url(`${email}`, {s: '100', r: 'x', d: 'retro'}, true)

  try { 
    const validateUser = userSignUpSchema.validate(req.body)
    if(!validateUser.error) {
      if (user) {
    res.status(409).json({
      "message": `${email} already in use`
    })
     }else {
      const newUser = await User.create({...req.body, avatarUrl, password: hashPassword, verificationCode})

      const verifyEmail = {
        to: email,
        subject: "Verify Email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`
      }

      await sendEmail(verifyEmail)

      res.status(201).json({
        "user": {
          email: newUser.email,
          subscription: newUser.subscription
        }
      })
     }
    } else {
         res.status(400).json({
          message: validateUser.error.message
         })
    }
} catch (error) {
  next(error)
}
  }


const verify = async(req, res) => {
  const {verificationCode} = req.params;
  const user = await User.findOne({verificationCode})
  if(!user) {
    res.status(404)
  }else {
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCode: ""})
    res.status(200).json({
      "message": "Verify seuccess"
    })
  }
}

const resendVerifyEmail = async(req, res) => {
  try{
    const {email} = req.body 
    const user = await User.findOne({email})
    console.log(user.verificationCode)
    if(!user) {
      res.status(404).json({
        "message": "Email not found"
      })
    }else{
      if (user.verify) {
        res.status(400).json({
          "message": "Email alread verify"
        })
      }else {
        
        const verifyEmail = {
          to: email,
          subject: "Verify Email",
          html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`
        }
  
        await sendEmail(verifyEmail)

        res.json({
          "message": "Verify email send"
        })

      }
  }
    }catch(error) {
      console.log(error)
    }
}

const userLog =  async (req, res, next) => {
  const {email, password} = req.body
  const user = await User.findOne({email})
  try {
  if(!user) {
    res.status(401).json({
      "message": "Email or password invalid"
    })
  }else { 
    if (user.verify === false) {
      res.status(401).json({
        "message": "Email not verify"
      }
      )
    }
      const validateUser = userSignInSchema.validate(req.body)
    if(!validateUser.error) {
      const passwordCompare = await bcrypt.compare(password, user.password)
          if (!passwordCompare) {
            res.status(401).json({
              "message": "Email or password invalid"
            })
          }else {
            const payload = {
            id: user._id
          }
          const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
          await User.findByIdAndUpdate(user._id, {token})
          res.status(200).json({
            
              "token": token,
              "user": {
                "email": user.email,
                "subscription": user.subscription
              
            } 
          })
    }} else {
      res.status(400).json({
        message: validateUser.error.message
       })
    }
    } 
    }catch (error) {
      next(error)
  }
}


const currentUser =  async (req, res, next) => {
  const { authorization = ""} = req.headers
  const [bearer, token] = authorization.split(" ")
  if (bearer !== "Bearer") {
       res.status(401).json({
          "massage": "not found"
      })
  }
  try {
      const {id} = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(id)
      if (!user || !user.token) {
          res.status(401).json({
              "massage": "not found"
          })
      } else{
         req.user = user
        const {email, subscription} = req.user
        res.json({
          email, 
          subscription

        }) 
      }
  } catch (error) {
      res.status(401).json({
          "massage": "not found"
      })
  }
}


const userLogout =  async (req, res, next) => {
  const { authorization = ""} = req.headers
  const [bearer, token] = authorization.split(" ")
  if (bearer !== "Bearer") {
       res.status(401).json({
          "massage": "not found"
      })
  }
  try {
      const {id} = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(id)
      if (!user || !user.token) {
          res.status(401).json({
              "massage": "not found"
          })
      } 
      req.user = user
        await User.findByIdAndUpdate(req.user._id, {token: ""})
        res.status(204).json({
          "message": "Logout success"
        })
  } catch (error) {
      res.status(401).json({
        "message": error.message  
      })
  }
}

const avatarPut =  async (req, res, next) => {
  const { authorization = ""} = req.headers
  const [bearer, token] = authorization.split(" ")
  if (bearer !== "Bearer") {
    res.status(401).json({
       "massage": "not found1"
   })
}
try {
  const {id} = jwt.verify(token, JWT_SECRET)
  const user = await User.findById(id)
  if (!user || !user.token) {
      res.status(401).json({
          "massage": "not found"
      })
  } else{


    const {path: oldPath, filename} = req.file
    const newPath = path.join(avatarsPath, filename)

    const newAvatar = await Jimp.read(oldPath);
    await newAvatar.resize(250, 250).writeAsync(newPath);
    
    const avatar = path.join("public", "avatars", filename)

     req.user = user
    await User.findByIdAndUpdate(id, {avatarUrl: avatar}, {new: true})
    res.status(200).json({
      "avatarURL": `${avatar}`
    })
  }
} catch (error) {
  res.status(401).json({
      "massage": "not found"
  })
}

}


export default {
  userReg,
  userLog,
  currentUser,
  userLogout,
  avatarPut,
  verify,
  resendVerifyEmail,
}