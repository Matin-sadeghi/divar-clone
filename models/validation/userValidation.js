const Yup = require("yup");

exports.userSchemaValidation = Yup.object().shape({
  username: Yup.string()
    .required("نام کاربری الزامی است")
    .min(3, "نام کاربری حداقل 3 کاراکتر است")
    .max(256, "نام کاربری حداکثر 256 کاراکتر است"),
  email: Yup.string()
    .email("ایمیل وارد شده صحیح نیست")
    .required("ایمیل الزامی است"),
  password: Yup.string()
    .required("کلمه عبور الزامی است")
    .min(4, "کلمه عبور حداقل 4 کاراکتر است")
    .max(256, "کلمه عبور حداکثر 256 کاراکتر است"),
  confirmPassword: Yup.string()
    .required("تکرار کلمه عبور الزامی است")
    .oneOf(
      [Yup.ref("password"), null],
      "کلمه عبور و تکرار کلمه عبور تفاوت دارند"
    ),
});
