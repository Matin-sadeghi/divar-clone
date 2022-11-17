const Yup = require("yup");

exports.citySchemaValidation = Yup.object().shape({
    name:Yup.string().required("نام شهر باید وارد شود").min(3,"نام شهر حداقل 3 کاراکتر است").max(256,"نام شهر حداکثر 256 کاراکتر است"),
    slug:Yup.string().required(" اسلاگ باید وارد شود").min(3," اسلاگ حداقل 3 کاراکتر است").max(256," اسلاگ حداکثر 256 کاراکتر است"),
    province:Yup.string().required("استان باید انتخاب شود")

});
