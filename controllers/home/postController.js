const City = require("../../models/city");
const Province = require("../../models/province");
const Post = require("../../models/post");
const User = require("../../models/user");
const Category = require("../../models/category");
const shortid = require('shortid');
const fs = require('fs');
const path = require('path')

const sharp = require('sharp')

const { salert, salertAndBack } = require("../../utils/alert");
const { persianSlug } = require("../../utils/slug");

exports.index = async (req, res) => {
  const provinces = await Province.find({});
  const cities = await City.find({province:provinces[0]._id});
  const categories = await Category.find({ parent: null });
  const subCategories = await Category.find({ parent:categories[0]._id });
  let oldValue = req.flash("oldValue")[0];

  res.render("home/addPost", {
    pageTitle: "ثبت آگهی",
    provinces,
    cities,
    categories,
    subCategories,
    oldValue,
  });
};



exports.edit = async (req,res)=>{
  const post = await Post.findById(req.params.id).populate([{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]);
  if(!post) return res.redirect("/404");
  const provinces = await Province.find({});
  const cities = await City.find({province:post.province._id});
  const categories = await Category.find({ parent: null });
  const subCategories = await Category.find({ parent:post.category._id });
  let oldValue = req.flash("oldValue")[0];
  res.render("home/editPost", {
    pageTitle: "ویرایش آگهی",
    post,
    provinces,
    cities,
    categories,
    subCategories,
    oldValue,
  });

}

exports.update = async (req,res)=>{

  const errorArr = [];
  try {
    if(req.body.images.length>0){
     let t = req.body.images 
     delete  req.body.images 
      await Post.postValidation({...req.body,images: { name: "placeholder", size: 2, mimetype: "image/jpeg" },});
      req.body.images  = t;

    }else{
    await Post.postValidation(req.body);
  }
    await Post.findByIdAndUpdate({_id:req.params.id},{ ...req.body, user: req.user._id,status:"unseen",viewCount:0 });
    salert(req, {
      title: "موفقیت آمیز",
      message: [{ name: "post add", message: "آگهی شما با موفقیت ویرایش شد" }],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/my-divar/posts");
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



}


exports.store = async (req, res) => {
  const errorArr = [];


  try {
    
     let t = req.body.images 
     delete  req.body.images 
      await Post.postValidation({...req.body,images: { name: "placeholder", size: 2, mimetype: "image/jpeg" },});
      req.body.images  = t;
    await Post.create({ ...req.body, user: req.user._id });
    salert(req, {
      title: "موفقیت آمیز",
      message: [{ name: "post add", message: "آگهی شما با موفقیت ثبت شد" }],
      icon: "success",
      button: "تایید",
    });

    res.redirect("/");
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

    res.redirect("/add-post");
  }
};


//ajax
exports.ajaxCity = async (req, res) => {
  const cities = await City.find({ province: req.body.value });
  res.send(cities);
};

exports.ajaxCategory = async (req, res) => {
  const subCategory = await Category.find({ parent: req.body.value });
  res.send(subCategory);
};

exports.ajaxCategoryFilter = async (req, res) => {
  const fCategory = await Category.findOne({slug:req.body.value})
  const subCategory = await Category.find({ parent: fCategory._id });
  res.send(subCategory);
};

exports.ajaxBookmark = async(req,res)=>{
  console.log(req.body)
  const post = await Post.findById(req.body.postId);
  const user = await User.findById(req.user._id);
  if(req.body.include=="true"){
    
    user.favoritePost.pop(post._id);
  }else{
    
  user.favoritePost.push(post._id);
  }
  await user.save();
  res.send("all is good");
}



exports.deleteImg = async (req,res)=>{
 fs.unlinkSync(path.join(process.cwd(),"public","uploads","postImages",req.body.value));
 res.send("yes end")
}

exports.ajaxImgUplod = async (req,res)=>{

  if (req.files.image.size > 4000000) {
    return res.status(400).json({
      address: "",
      message: "",
      name:"size error",
      error: "حجم عکس باید کمتر از 4 مگابایت باشد",
    });
  }
  if (req.files.image.mimetype != "image/jpeg") {
    return res.status(400).json({
      address: "",
      message: "",
      name:"ext error",
      error: "تنها پسوند JPEG پشتیبانی میشود",
    });
  }
  if (req.files) {
    const fileName = `${shortid.generate()}_${req.files.image.name}`;
    await sharp(req.files.image.data)
      .jpeg({
        quality: 60,
      })
      .toFile(`./public/uploads/postImages/${fileName}`)
      .catch((err) => {
        console.log(err);
      });
   return res.status(200).json({
      address: `${process.env.DOMAIN}/uploads/postImages/${fileName}`,
      fileName:fileName,
      message: "آپلود عکس موفقیت آمیز بود",
      name:"success",
      error: "",
    });
  } else {
    res.send("ابتدا عکس خود را انتخاب کنید");
  }
}

