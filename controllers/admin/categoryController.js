const Category = require("./../../models/category");
const Post = require("../../models/post");
const { salert, salertAndBack } = require("./../../utils/alert");
const {persianSlug} = require("./../../utils/slug");
const fs = require('fs');
const path = require('path');
const post = require("../../models/post");


exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const categories = await Category.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
      populate: [{ path: "parent" }],
    }
  );
  //return res.json(categories);
  res.render("admin/categories/index", {
    pageTitle: "پنل مدیریت | دسته بندی ها",
    categories,
  });
};

exports.create = async (req, res) => {
  const categories = await Category.find({ parent: null });
  let oldValue = req.flash("oldValue")[0];
  res.render("admin/categories/create", {
    pageTitle: "پنل مدیریت | ایجاد دسته بندی",
    categories,
    oldValue,
  });
};

exports.store = async (req, res) => {
  const errorArr = [];
  try {
    await Category.categoryValidation(req.body);
    let { title, slug, parent } = req.body;
    slug = persianSlug(slug)
    const category = await Category.findOne({slug});
    if(category){
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
  
     res.redirect("/admin/categories/create");
     return;
    }
    await Category.create({
      title,
      parent: parent != "none" ? parent : null,
      slug,
    });
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "category add", message: "دسته بندی شما با موفقیت ایجاد شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/categories");
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

    res.redirect("/admin/categories/create");
  }
};

exports.editPage = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const categories = await Category.find({ parent: null});
  let oldValue = req.flash("oldValue")[0];

  res.render("admin/categories/edit", {
    pageTitle: "ویرایش دسته بندی",
    categories,
    category,
    oldValue,
  });
};

exports.update = async (req, res) => {
  const errorArr = [];
  try {
    await Category.categoryValidation(req.body);
    let { title, slug, parent } = req.body;
    slug = persianSlug(slug)
    const category = await Category.findById(req.params.id);
    if(category.slug!=slug){
    const oldCategory = await Category.findOne({slug});
    if(oldCategory){
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
  
     res.redirect("/admin/categories/create");
     return;
    }

    }
    category.title = title;
    category.slug = slug;
    category.parent = parent == "none" ? null : parent;
    await category.save();
    salert(req, {
      title: "موفقیت آمیز",
      message: [
        { name: "category add", message: "دسته بندی شما با موفقیت ویرایش شد" },
      ],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/admin/categories");
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

  const category = await Category.findById(req.params.id);
  let posts = {};
  if(category.parent=="null"){
   posts = await Post.find({ category: category._id });

    const subCategories = await Category.find({parent:category._id});
    if(subCategories.length>0){
    subCategories.forEach(async (subCategory) => {
      await subCategory.remove();
    });
  }
  }else{
   posts = await Post.find({ subCategory: category._id });
  }

  if(post.length>0){
  posts.forEach(async (post) => {
    if(post.images.length>0){
    post.images.forEach((img) => {
      fs.unlinkSync(
        path.join(process.cwd(), "public", "uploads", "postImages", img)
      );
    });
  }
    await post.remove();
  });
}
  await category.remove();
  res.redirect(req.header("Referer") || "/");
};

