const Province = require("./../../models/province");
const city = require("./../../models/city");
const { salert, salertAndBack } = require("./../../utils/alert");
const {persianSlug} = require("./../../utils/slug");
const fs = require('fs');
const path = require('path');
const Post = require("../../models/post");


//provinces
//province
exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const provinces = await Province.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
    }
  );
  // return res.json(provinces);
  res.render("admin/provinces/index", {
    pageTitle: "پنل مدیریت | استان ها",
    provinces,
  });
};

exports.create = async (req, res) => {
  let oldValue = req.flash("oldValue")[0];
  res.render("admin/provinces/create", {
    pageTitle: "پنل مدیریت | ایجاد استان جدید",
    oldValue,
  });
};

exports.store = async (req, res) => {
  const errorArr = [];
  try {
    await Province.provinceValidation(req.body);
    let { name, slug } = req.body;
    slug = persianSlug(slug)
    const province = await Province.findOne({ slug });
    if (province) {
      err.inner.forEach((e) => {
        errorArr.push({
          name: "اسلاگ تکراری",
          message: "اسلاگ تکراری وارد کرده اید",
        });
      });

      salert(req, {
        title: "خطا",
        message: errorArr,
        icon: "error",
        button: "تایید",
      });
      req.flash("oldValue", req.body);

      res.redirect("/admin/provinces/create");
      return;
    }
    await Province.create({ name, slug });
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "province add", message: "استان شما با موفقیت ایجاد شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/provinces");
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
    req.flash("oldValue", req.body);

    res.redirect("/admin/provinces/create");
  }
};

exports.editPage = async (req, res) => {
  const province = await Province.findById(req.params.id);

  let oldValue = req.flash("oldValue")[0];
  //return res.json(province)
  res.render("admin/provinces/edit", {
    pageTitle: "ویرایش استان",
    province,
    oldValue,
  });
};

exports.update = async (req, res) => {
  const errorArr = [];
  try {
    await Province.provinceValidation(req.body);
    let { name, slug } = req.body;
    slug = persianSlug(slug)

    const province = await Province.findById(req.params.id);
    if (province.slug != slug) {
      const oldProvince = await Province.findOne({ slug });
      if (oldProvince) {
        err.inner.forEach((e) => {
          errorArr.push({
            name: "اسلاگ تکراری",
            message: "اسلاگ تکراری وارد کرده اید",
          });
        });

        salert(req, {
          title: "خطا",
          message: errorArr,
          icon: "error",
          button: "تایید",
        });
        req.flash("oldValue", req.body);

        res.redirect("/admin/provinces/create");
        return;
      }
    }
    province.name = name;
    province.slug = slug;
    await province.save();
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "province update", message: "استان شما با موفقیت ویرایش شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/provinces");
  } catch (err) {
    console.log(err);
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
    req.flash("oldValue", req.body);

    res.redirect(req.header("Referer") || "/");
  }
};

exports.delete = async (req, res) => {
  const province = await Province.findById(req.params.id);
  
  const posts = await Post.find({ province: province._id });

  posts.forEach(async (post) => {
    post.images.forEach((img) => {
      fs.unlinkSync(
        path.join(process.cwd(), "public", "uploads", "postImages", img)
      );
    });
    await post.remove();
  });


  //delet cities
  const cities = await city.find({ province: req.params.id });
  //return res.json(cities)
  cities.forEach(async (city) => {
    await city.remove();
  });
  //delete province
  await province.remove();
  res.redirect(req.header("Referer") || "/");
};
