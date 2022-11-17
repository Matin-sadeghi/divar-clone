const express = require("express");
const userController = require('./../controllers/userController');
const router = express.Router();


// Login Page
// rout GET /users/login
router.get("/login",userController.login);

//  Handle Login Page
// rout POST /users/login
router.post("/login", userController.handleLogin,userController.rememberMe);


// Register Page
// rout GET /users/register
router.get("/register", userController.register);


//  Handle Register Page
// rout POST /users/register
router.post("/register", userController.createUser);


// Forget Password Page
// rout GET /users/forget-password
router.get("/forget-password", userController.forgetPassword);


// Forget Password Handle
// rout POST /users/forget-password
router.post("/forget-password", userController.handleForgetPassword);


// Reset Password Page
// rout get /users/reset-password/:token
router.get("/reset-password/:token", userController.resetPassword);

// Handle Reset Password 
// rout POST /users/reset-password/:id/:token
router.post("/reset-password/:id/:token", userController.handleResetPassword);

//users update
//route POST  /users/update/:id
router.post("/update/:id", userController.updateProfile);



router.get("/logout",userController.logout);



module.exports = router;
