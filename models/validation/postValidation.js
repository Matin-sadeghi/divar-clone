const Yup = require("yup");

exports.postSchemaValidation = Yup.object().shape({
  title: Yup.string()
    .required("نام باید وارد شود")
    .min(3, "نام  حداقل 3 کاراکتر است")
    .max(100, "نام حداکثر 100 کاراکتر است"),
  province: Yup.string()
    .required(" استان باید وارد شود")
    .min(3, " استان حداقل 3 کاراکتر است")
    .max(100, " استان حداکثر 100 کاراکتر است"),
  city: Yup.string()
    .required(" شهر باید وارد شود")
    .min(3, " شهر حداقل 3 کاراکتر است")
    .max(100, " شهر حداکثر 100 کاراکتر است"),
  body: Yup.string()
    .required(" متن آگهی باید وارد شود")
    .min(3, " متن آگهی حداقل 3 کاراکتر است")
    .max(500, " متن آگهی حداکثر 500 کاراکتر است"),
    address: Yup.string()
    .required("آدرس باید وارد شود")
    .min(3, "  آدرس حداقل 3 کاراکتر است"),
  category: Yup.string()
    .required(" دسته اصلی باید وارد شود")
    .min(3, " دسته اصلی حداقل 3 کاراکتر است")
    .max(100, " دسته اصلی حداکثر 100 کاراکتر است"),
  subCategory: Yup.string()
    .required(" زیر دسته باید وارد شود")
    .min(3, " زیر دسته حداقل 3 کاراکتر است")
    .max(100, " زیر دسته حداکثر 100 کاراکتر است"),
  condition: Yup.string()
    .required(" وضعیت فروش باید وارد شود")
    .min(3, " وضعیت فروش حداقل 3 کاراکتر است")
    .max(100, " وضعیت فروش حداکثر 100 کاراکتر است"),
  price: Yup.string()
    .required(" قیمت باید وارد شود")
    .min(3, " قیمت حداقل 3 کاراکتر است")
    .max(100, " قیمت حداکثر 100 کاراکتر است"),
  images: Yup.object().shape({
    name: Yup.string().required("عکس دوره باید وارد شود"),
    size: Yup.number().max(3000000, "عکس دوره حداکثر باید 3 مگابایت باشد"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "تنها jpeg و png پشتیبانی می شود"
    ),
  }),
});
