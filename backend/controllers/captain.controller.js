import { validationResult } from "express-validator";
import { captainModel } from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import { blackListModel } from "../models/blackListedTokens.js";

export const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  const isCaptainAlreadyexist = await captainModel.findOne({ email });
  if (isCaptainAlreadyexist) {
    return res.status(400).json({ message: "Captain already exist" });
  }
  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = await captain.generateAuthToken();
  return res.status(201).json({ token, captain });
};

export const logincaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  return res.cookie("token", token).status(200).json({ token, captain });
};

export const captainProfile = async (req, res, next) => {
    console.log(req.captain,"captain")
  return res.status(200).json({ captain: req.captain,message:'captain profile' });
};

export const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};
