const Post = require('./../../models/post');
const Category = require("./../../models/category");
const City = require("../../models/city");
const Province = require("../../models/province");
const User = require("./../../models/user");

// MVC  model views conrtroller
exports.index = async(req,res)=>{
   
    let page = req.query.page || 1;   
    if(!req.user){
     posts = await Post.paginate({$and:[{status:"accept"}]},{page,limit:8, sort: { createdAt: -1 },populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]});
    }else{
         posts = await Post.paginate({$and:[{city:req.user.cities},{status:"accept"}]},{page,limit:8, sort: { createdAt: -1 },populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]});
    }
    const categories = await Category.find({parent:null});
    res.render("home/index",{pageTitle:"صفحه اصلی",posts,categories,path:"/"})
}


exports.filter = async (req,res)=>{
    let query = {};
    let page = req.query.page || 1;

     if(!req.isAuthenticated()){
        const cities = await City.find({});
        req.user = {
            cities:cities
        }     
     }
    let posts = '';
    let category = await Category.findOne({ slug: req.query.category });
    if(category){
        if(req.query.subCategory&&req.query.subCategory!="all"){
    let subCategory = await Category.findOne({ slug: req.query.subCategory });
     posts = await Post.paginate({$and:[{city:req.user.cities},{status:"accept"},{category:category.id},{subCategory:subCategory._id}]},{page,limit:8, sort: { updatedAt: -1 },populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]});
    }else{
     posts = await Post.paginate({$and:[{city:req.user.cities},{status:"accept"},{category:category.id}]},{page,limit:8, sort: { updatedAt: -1 },populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]});
        }
        
    }
    const categories = await Category.find({parent:null});
    const subCategories = await Category.find({ parent:category._id });
    let oldValue = req.query;
   
    res.render("home/index-filter",{pageTitle:"صفحه فیلتر",posts,categories,subCategories,path:"/filter",oldValue})
  
  }

exports.mydivar = async(req,res)=>{
    const categories = await Category.find({parent:null});
    
    const user = await User.findById(req.user._id).populate([{path:"cities",select:"name"}]);
    const provinces = await Province.find({});
    const cities  =await City.find({province:provinces[0]._id});
 
    res.render("home/mydivar",{pageTitle:" دیوار من",user,provinces,cities,categories,path:"/mydivar"})
}

exports.mydivarPosts = async(req,res)=>{
    let page = req.query.page || 1;

    const posts = await Post.paginate({user:req.user._id},{page,limit:8, sort: { updatedAt: -1 },populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]});
   
    const categories = await Category.find({parent:null});

    res.render("home/mydivar-posts",{pageTitle:" دیوار من",posts,categories,path:"/mydivar-posts"})

}


exports.singlePage = async (req,res)=>{
    const post = await Post.findById(req.params.id).populate([{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}])
    const categories = await Category.find({parent:null});
    post.viewCount++;
    await post.save()
    res.render("home/single-page",{pageTitle:"صفحه اصلی",post,categories,path:"/"})


}

exports.favoritePost = async(req,res)=>{
    let page = req.query.page || 1;
    const categories = await Category.find({parent:null});

    const user = await User.paginate({user:req.user._id},{page,limit:8, sort: { createdAt: -1 },populate:[{path:"favoritePost",populate:[{path:"city",select:"name"},{path:"category",select:"title"},{path:"subCategory",select:"title"}]}]})
    //return res.json(user.docs[0])
    res.render("home/favoritePost",{pageTitle:"پست های نشان شده",user,categories})

}