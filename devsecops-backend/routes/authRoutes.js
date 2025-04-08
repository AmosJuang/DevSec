const express = require("express");
const { 
    register, 
    signIn, 
    forgetPassword, 
    resetPassword 
} = require("../controllers/authController");
const router = express.Router();

// Define the register route
router.post("/register", register);

// Define the signIn route
router.post("/signin", signIn);

// Add a test GET route for debugging
router.get("/forget-password", (req, res) => {
    res.json({ message: "Forget password route is accessible" });
});

// Define the forgetPassword route
router.post("/forget-password", forgetPassword);

// Reset password route
router.post("/reset-password", resetPassword);

module.exports = router;
