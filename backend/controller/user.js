const express = require("express");
const path = require("path");

const router = express.Router();
const upload = require("../multer");
const User = require("../model/user"); 
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const fs = require("fs");
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


      return next(new ErrorHandler("User already exists", 400));
    }

    // uploaded file name
    const filename = req.file.filename;

    // file path (stored in DB)
    const fileUrl = path.join("uploads", filename);

    // create user
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: filename,
        url: fileUrl
      }
    });

    // send welcome email
    try {
      await sendMail({
        email: user.email,
        subject: "Welcome to StackMart!",
        message: `Hello ${user.name},\n\nYour account has been successfully created! You can now log in using your email and password.\n\nBest regards,\nThe StackMart Team`
      });
    } catch (err) {
      console.error("Error sending email:", err);
    }

    res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
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
      return next(new ErrorHandler("Invalid email or password!", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password!", 401));
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