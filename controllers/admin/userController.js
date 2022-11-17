const User = require("./../../models/user");
const Post = require("../../models/post");
const { salert, salertAndBack } = require("./../../utils/alert");
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const users = await User.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { createdAt: -1 },
    }
  );
  res.render("admin/users/index", {
    pageTitle: "پنل مدیریت |  کاربران ها",
    users,
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
    slug = persianSlug(slug);
    const category = await Category.findOne({ slug });
    if (category) {
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
  const categories = await Category.find({ parent: null });
  let oldValue = req.flash("oldValue")[0];

  res.render("admin/categories/edit", {
    pageTitle: "ویرایش دسته بندی",
    categories,
    category,
    oldValue,
  });
};

exports.update = async (req, res) => {
  const user = await User.findById(req.params.id);

  user.permisson = user.permisson == "admin" ? "user" : "admin";
  await user.save();

  // salert(req, {
  //   title: "موفقیت آمیز بود",
  //   message: `   کاربر ${user.username} از حالا ${user.permisson} است`,
  //   icon: "success",
  //   button: "تایید",
  // });
  res.redirect(req.header("Referer") || "/");
};

exports.delete = async (req, res) => {
  const user = await User.findById(req.params.id);
  //پاک کردن عکس ها و پست ها
  const posts = await Post.find({ user: user._id });

  posts.forEach(async (post) => {
    post.images.forEach((img) => {
      fs.unlinkSync(
        path.join(process.cwd(), "public", "uploads", "postImages", img)
      );
    });
    await post.remove();
  });
  await user.remove();

  res.redirect(req.header("Referer") || "/");
};
