const express = require("express");
const indexController = require('./../controllers/home/indexController');
const postCoontroller = require('../controllers/home/postController');
const {auth} = require('./../middlewares/auth');
const router = express.Router();


// Index Page
// rout GET /
router.get("/",indexController.index);


//add post
//add Post page
//route GET /add-post
router.get("/add-post",auth,postCoontroller.index);

//add Post 
//route POST /add-post
router.post("/add-post",auth,postCoontroller.store);

//mydivar
//route GET /mydivar
router.get("/my-divar",auth,indexController.mydivar)

//status of Posts 
//route GET /my-divar/posts
router.get("/my-divar/posts",auth,indexController.mydivarPosts)

//edit post
//route GET /my-divar/posts/edit/:id
router.get("/my-divar/posts/edit/:id",auth,postCoontroller.edit)

//update post
//route POST /update-post/:id
router.post("/update-post/:id",auth,postCoontroller.update)

//filter post
//rpute GET /filter?cate
router.get("/filter",indexController.filter)

//single post
//route GET /single-page/:id
router.get("/single-page/:id",indexController.singlePage)

//favoritePost
//route GET /my-divar/favoritePost
router.get("/my-divar/favoritePost",indexController.favoritePost)



//ajax
router.post("/ajax-city",auth,postCoontroller.ajaxCity);
router.post("/ajax-category",auth,postCoontroller.ajaxCategory);
router.post("/ajax-category-filter",auth,postCoontroller.ajaxCategoryFilter);
router.post("/ajax-imgUplod",auth,postCoontroller.ajaxImgUplod)
router.post("/delete-img",auth,postCoontroller.deleteImg)
router.post("/ajax-bookmark",auth,postCoontroller.ajaxBookmark)





module.exports = router;
