const passport = require('passport')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const City = require("./../models/city");
const { salert, salertAndBack } = require("./../utils/alert");
const { sendEmail, captcha } = require("./../utils/helper");
const User = require("./../models/user");

exports.login = (req, res) => {
  res.render("auth/login", {
    pageTitle: "ورود",
    path: "/login",
    layout: "./layouts/authLayouts",
    error: req.flash("error"),
  });
};
exports.handleLogin = async (req, res, next) => {
  captcha(req, res).then((value) => {
    
    if (value && value != "redirect") {
      passport.authenticate("local.login", {
        failureRedirect: "/users/login",
        failureFlash: true,
      })(req, res, next);
    } else if (value == "redirect") {
      salert(req, {
        title: "خطا",
        message: [{ name: "captcha err", message: "captcha الزامی است" }],
        icon: "error",
        button: "تایید",
      });
      res.redirect("/users/login");
    } else {
      salert(req, {
        title: "خطا",
        message: [
          { name: "خطای captcha", message: "مشکلی برای captcha پیش آمده است" },
        ],
        icon: "error",
        button: "تایید",
      });
      res.redirect("/users/login");
    }
  });
};

exports.rememberMe = (req, res) => {
  if (req.body.rememberMe) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expires = null;
  }
  res.redirect("/");
};

exports.register = (req, res) => {
  res.render("auth/register", {
    pageTitle: "ثبت نام",
    path: "/register",
    layout: "./layouts/authLayouts",
  });
};

exports.createUser = async (req, res) => {
  let errorArr = [];

  captcha(req, res).then(async (value) => {
    if (value && value != "redirect") {
      await User.userValidation(req.body);
      const { username, email, password } = req.body;
      const user = await User.findOne({ email });

      try {
        if (user) {
          errorArr.push({
            name: "ایمیل تکراری",
            message: "این ایمیل قبلا ثبت نام کرده است",
          });
          salert(req, {
            title: "خطا",
            message: errorArr,
            icon: "error",
            button: "تایید",
          });
          res.redirect("/users/register");
        } else {
          const cities = await City.find({})
          await User.create({ username, email, password,cities:[cities[0]._id] });
          salert(req, {
            title: "تبریک",
            message: [
              {
                name: "کاربر با موفقیت ثبت نام کرد",
                message: "ثبت نام شما موفقیت آمیز بود",
              },
            ],
            icon: "success",
            button: "تایید",
          });
          res.redirect("/users/login");
        }
      } catch (err) {
        err.inner.forEach((e) => {
          errorArr.push({
            name: e.path,
            message: e.message,
          });
        });
        salert(req, {
          title: "خطا",
          message: errorArr,
          icon: "error",
          button: "تایید",
        });
        res.redirect("/users/register");
      }
    } else if (value == "redirect") {
      salert(req, {
        title: "خطا",
        message: [{ name: "خطای captcha", message: "captecha الزامی است" }],
        icon: "error",
        button: "تایید",
      });
      res.redirect("/users/register");
    } else {
      salert(req, {
        title: "خطا",
        message: [
          { name: "خطای captcha", message: "مشکلی برای captcha پیش آمده است" },
        ],
        icon: "error",
        button: "تایید",
      });
      res.redirect("/users/register");
    }
  });
};

exports.forgetPassword = (req, res) => {
  res.render("auth/forgetPassword", {
    pageTitle: "فراموشی کلمه عبور",
    path: "/forgetPas",
    layout: "./layouts/authLayouts",
  });
};

exports.handleForgetPassword = async (req, res) => {
  captcha(req, res, "/users/forget-password").then(async (value) => {
    if (value && value != "redirect") {
 
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        salert(req, {
          title: "خطا",
          message: [
            { name: "خطای ایمیل", message: "کاربری با این ایمیل پیدا نشد" },
          ],
          icon: "error",
          button: "تایید",
        });
      
        res.redirect("/users/forget-password");
      } else {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const resetLink = `${process.env.DOMAIN}/users/reset-password/${token}`;
        salert(req, {
          title: "موفقیت آمیز بود",
          message: [
            { name: "success send email", message: "ایمیل بازیابی کلمه عبور با موفقیت ارسال شد" },
          ],
          icon: "success",
          button: "تایید",
        });
       
        sendEmail(
          email,
          user.username,
          "فراموشی کلمه عبور",
          `<p>برای بازیابی کلمه عبور روی لینک زیر کلیک کنید</p>
          <a href=${resetLink}>بازیابی کلمه عبور</a>
          `
        );
        res.redirect("/users/forget-password");
      }
    } else if (!value) {
      req.flash("error", "مشکلی برای captcha پیش آمده است");
      res.redirect("/users/forget-password");
    }
  });
};

exports.resetPassword = (req, res) => {
  const token = req.params.token;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.render("auth/resetPassword", {
      pageTitle: "تغییر کلمه عبور",
      path: "/resetPassword",
      layout: "./layouts/authLayouts",
      userId: decoded.userId,
      token,
    });
  } catch (err) {
    res.redirect("/404");
  }
};
exports.handleResetPassword = async (req, res) => {
  const id = req.params.id;
  const token = req.params.token;
  const user = await User.findById(id);
  const { password, confirmPassword } = req.body;
  if (!user) {
    return res.redirect("/404");
  }
  if (
    password != confirmPassword ||
    password.length < 4 ||
    confirmPassword.length < 4
  ) {
    if (password != confirmPassword) {
      salert(req, {
        title: "خطا",
        message: [
          { name: "password error", message: "کلمه عبور و تکرار کلمه عبور یکسان نیست" },
        ],
        icon: "error",
        button: "تایید",
      });
      
    } else if (password.length < 4) {
      salert(req, {
        title: "خطا",
        message: [
          { name: "password error", message: "کلمه عبور باید بیشتر از 3 کاراکتر باشد" },
        ],
        icon: "error",
        button: "تایید",
      });
    } else if (confirmPassword.length < 4) {
      salert(req, {
        title: "خطا",
        message: [
          { name: "password error", message: "تکرار کلمه عبور باید بیشتر از 3 کاراکتر باشد" },
        ],
        icon: "error",
        button: "تایید",
      });
    }
    res.redirect(`/users/reset-password/${token}`);
  } else {
    user.password = password;
    await user.save();
    salert(req, {
      title: "موفقیت آمیز بود",
      message: [
        { name: "password success", message: "کلمه عبور با موفقیت تغییر کرد" },
      ],
      icon: "success",
      button: "تایید",
    });
    res.redirect("/users/login");
  }
};


exports.updateProfile = async (req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user) return res.redirect("/404");
 req.user.cities = req.body.cities
 await req.user.save()
  res.redirect("/my-divar")
}

exports.logout = (req, res, next) => {
  req.logOut()
  res.redirect("/")
};