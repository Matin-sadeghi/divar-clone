const Yup = require("yup");

exports.provinceSchemaValidation = Yup.object().shape({
    name:Yup.string().required("نام استان باید وارد شود").min(3,"نام استان حداقل 3 کاراکتر است").max(256,"نام استان حداکثر 256 کاراکتر است"),
    slug:Yup.string().required(" اسلاگ باید وارد شود").min(3," اسلاگ حداقل 3 کاراکتر است").max(256," اسلاگ حداکثر 256 کاراکتر است"),
});
