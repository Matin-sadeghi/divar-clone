const City = require("./../../models/city");
const Province = require("./../../models/province");
const { salert, salertAndBack } = require("./../../utils/alert");
const {persianSlug} = require("./../../utils/slug");
const fs = require('fs');
const path = require('path');
const Post = require("../../models/post");

exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const cities = await City.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
    populate:[{path:"province",select:"name"}]
    }
  );
  //return res.json(cities);
  res.render("admin/cities/index", {
    pageTitle: "پنل مدیریت | شهر ها",
    cities,
  });
};

exports.create = async (req, res) => {
  const provinces = await Province.find({});
  let oldValue = req.flash("oldValue")[0];
  res.render("admin/cities/create", {
    pageTitle: "پنل مدیریت | ایجاد شهر ",
    provinces,
    oldValue,
  });
};

exports.store = async (req, res) => {
  const errorArr = [];
  try {
    await City.cityValidation(req.body);
    let { name, slug, province } = req.body;
    slug = persianSlug(slug)
    const city = await City.findOne({slug});
    if(city){

        errorArr.push({
          name: "اسلاگ تکراری",
          message: "اسلاگ تکراری وارد کرده اید",
        });
    
  
      salert(req, {
        title: "خطا",
        message: errorArr,
        icon: "error",
        button: "تایید",
      });
      req.flash("oldValue", req.body);
  
     res.redirect("/admin/cities/create");
     return;
    }
    await City.create({
      name,
      province: province != "none" ? province : null,
      slug,
    });
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "city add", message: "شهر شما با موفقیت ایجاد شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/cities");
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

    res.redirect("/admin/cities/create");
  }
};

exports.editPage = async (req, res) => {
  const city = await City.findById(req.params.id);
  const provinces = await Province.find({});
  let oldValue = req.flash("oldValue")[0];

  res.render("admin/cities/edit", {
    pageTitle: "پنل مدیریت | ویرایش شهر ",
    city,
    provinces,
    oldValue,
  });
};

exports.update = async (req, res) => {
  const errorArr = [];
  try {
    await City.cityValidation(req.body);
    let { name, slug, province } = req.body;
    slug = persianSlug(slug)
    const city = await City.findById(req.params.id);
    if(city.slug!=slug){
    const oldCity = await City.findOne({slug});
    if(oldCity){
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
  
     res.redirect("/admin/cities/create");
     return;
    }

    }
    city.name = name;
    city.slug = slug;
    city.province = province == "none" ? null : province;
    await city.save();
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "city modify", message: "شهر شما با موفقیت ویرایش شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/cities");
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

    res.redirect(req.header("Referer") || "/");
  }
};

exports.delete = async (req, res) => {
  const city = await City.findById(req.params.id);

  
  const posts = await Post.find({ city: city._id });

  posts.forEach(async (post) => {
    post.images.forEach((img) => {
      fs.unlinkSync(
        path.join(process.cwd(), "public", "uploads", "postImages", img)
      );
    });
    await post.remove();
  });


  await city.remove();
  res.redirect(req.header("Referer") || "/");
};
