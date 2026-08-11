import express from 'express'
import authMiddleware from '../middleware/isAuth.js'
import { getCurrentUser } from '../controller/user.js'
const userRouter= express.Router()
userRouter.get('/get',authMiddleware,getCurrentUser)

export default userRouter