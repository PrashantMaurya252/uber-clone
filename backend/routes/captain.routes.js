import express from 'express'
import { body } from "express-validator";
import { registerCaptain } from '../controllers/captain.controller.js';
const router = express.Router()

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:6}).withMessage('First name must be at least 6 character long'),
    body('password').isLength({min:6}).withMessage('Password must be 6 character long'),
    body('vehicle.color').isLength({min:3}).withMessage('Color must be atleast 3 character long'),
    body('vehicle.plate').isLength({min:3}).withMessage('Plate must be 3 character long'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Capacity must be atleast 1'),
    body('vehicle.vehicleType').isIn(['car','motorcycle','auto']).withMessage('Invalid vehicle type')
],registerCaptain)





export default router

