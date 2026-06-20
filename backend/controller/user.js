const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const router = express.Router();
const upload = require("../multer");
const User = require("../model/user"); 
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const fs = require("fs");

// Store temporary user data for resend (in real app, use Redis or similar)
const tempUserData = new Map();

router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = path.join("uploads", filename);

      // delete the uploaded file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });


      return next(new ErrorHandler("User already registered", 400));
    }

    // uploaded file name
    const filename = req.file.filename;

    // file path (stored in DB)
    const fileUrl = path.join("uploads", filename);

    // create user data object
    const userData = {
      name,
      email,
      password,
      avatar: {
        public_id: filename,
        url: fileUrl
      }
    };

    // generate activation token
    const activationToken = jwt.sign(
      userData,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );

    // Store temp data
    tempUserData.set(email, userData);

    // create activation link
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // send activation email
    try {
      await sendMail({
        email: userData.email,
        subject: "Activate Your StackMart Account",
        message: `Hello ${userData.name},\n\nPlease click the link below to activate your account:\n${activationUrl}\n\nThis link will expire in 5 minutes.\n\nBest regards,\nThe StackMart Team`,
        activationUrl: activationUrl,
        name: userData.name
      });
    } catch (err) {
      console.error("Error sending email:", err);
      return next(new ErrorHandler("Failed to send activation email", 500));
    }

    res.status(201).json({
      success: true,
      message: `Activation link sent! Please check your email: ${userData.email} to activate your account!`,
      email: userData.email
    });

  } catch (error) {
    next(error);
  }
});

// Resend activation link
router.post("/resend-activation", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Please provide email!", 400));
    }

    // Check if user is already activated
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isActivated) {
      return next(new ErrorHandler("Account is already activated!", 400));
    }

    // Get temp user data
    const userData = tempUserData.get(email);
    if (!userData) {
      return next(new ErrorHandler("No pending registration found for this email!", 400));
    }

    // Generate new activation token
    const activationToken = jwt.sign(
      userData,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    // Send new email
    try {
      await sendMail({
        email: userData.email,
        subject: "Activate Your StackMart Account",
        message: `Hello ${userData.name},\n\nPlease click the link below to activate your account:\n${activationUrl}\n\nThis link will expire in 5 minutes.\n\nBest regards,\nThe StackMart Team`,
        activationUrl: activationUrl,
        name: userData.name
      });
    } catch (err) {
      console.error("Error sending email:", err);
      return next(new ErrorHandler("Failed to send activation email", 500));
    }

    res.status(200).json({
      success: true,
      message: `Activation link resent! Please check your email: ${userData.email}!`
    });

  } catch (error) {
    next(error);
  }
});

// Activate user
router.post("/activation", async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    // verify the token
    const newUser = jwt.verify(
      activation_token,
      process.env.JWT_SECRET_KEY
    );

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }

    const { name, email, password, avatar } = newUser;

    // check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // create user
    user = await User.create({
      name,
      email,
      password,
      avatar,
      isActivated: true
    });

    // Remove temp data
    tempUserData.delete(email);

    res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login user
router.post("/login-user", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Wrong email or password!", 401));
    }

    if (!user.isActivated) {
      return next(new ErrorHandler("Please activate your account first!", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Wrong email or password!", 401));
    }

    const token = user.getJwtToken();

    res.status(200).cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }).json({
      success: true,
      user,
      token
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;