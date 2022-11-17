const Yup = require("yup");

exports.categorySchemaValidation = Yup.object().shape({
    title:Yup.string().required("عنوان دسته باید وارد شود").min(3,"عنوان دسته حداقل 3 کاراکتر است").max(256,"عنوان دسته حداکثر 256 کاراکتر است"),
    slug:Yup.string().required(" اسلاگ باید وارد شود").min(3," اسلاگ حداقل 3 کاراکتر است").max(256," اسلاگ حداکثر 256 کاراکتر است"),
    parent:Yup.string().required("زیر دسته باید انتخاب شود")
});
