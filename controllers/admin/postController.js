const Post = require("../../models/post");
const Province = require("./../../models/province");

exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const provinces = await Province.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
      populate: [{ path: "posts" }],
    }
  );
  // return res.json(provinces)
  res.render("admin/posts/index", { pageTitle: "آگهی ها", provinces });
};

exports.indexProvince = async (req, res) => {
  let page = req.query.page || 1;
  const province = await Province.findOne({ slug: req.params.slug });

  if (!province) {
    return res.redirect("/404");
  }
  const posts = await Post.paginate(
    { province: province._id },
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
      populate: [
        { path: "province", select: "name" },
        { path: "city", select: "name" },
        { path: "category", select: "title" },
        { path: "subCategory", select: "title" },
      ],
    }
  );
  //return res.json(posts)
  res.render("admin/posts/index-province", {
    pageTitle: "استان | آگهی ها",
    posts,
  });
};

exports.checkPostPage = async (req, res) => {
  const post = await Post.findById(req.params.id).populate([
    { path: "province" },
    { path: "city", select: "name" },
    { path: "category", select: "title" },
    { path: "subCategory", select: "title" },
  ]);
  if (post.status == "unseen") {
    post.status = "seen";
    await post.save();
  }
 
  res.render("admin/posts/check-post", {
    pageTitle: "پنل مدیریت | بررسی آگهی",
    post,
  });
};

exports.update = async (req, res) => {
  const status = req.params.status;
  const post = await Post.findById(req.params.id).populate([
    { path: "province" },
  ]);
  if (!post) return res.redirect("/404");
  if (status == "accept") {
    post.status = "accept";
  } else if (status == "rejection") {
    post.status = "rejection";
  }
  await post.save();
  res.redirect(`/admin/posts/${post.province.slug}`);
};
