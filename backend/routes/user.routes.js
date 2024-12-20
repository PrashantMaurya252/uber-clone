import express from 'express'
import { body } from 'express-validator'
import { getProfile, loginUser, logout, registerUser } from '../controllers/user.controller.js'
import { authUser } from '../middlewares.js/auth.middlewares.js'
const router = express.Router()


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 character long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 character long')
],registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be 6 characters long')
],loginUser)

router.get('/profile',authUser,getProfile)
router.get('/logout',authUser,logout)



export default router