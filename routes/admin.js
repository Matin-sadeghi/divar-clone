const express = require("express");

const indexController = require('../controllers/admin/homeController');
const categoryController = require("./../controllers/admin/categoryController");
const provinceController = require('./../controllers/admin/provinceController');
const cityController = require('./../controllers/admin/cityController');
const postController = require('./../controllers/admin/postController');
const userController = require('./../controllers/admin/userController');
const {adminAccess} =require('./../middlewares/adminAccess');
const router = express.Router();

router.use((req , res , next) => {
    res.locals.layout = "layouts/adminLayouts";
    next();
})
router.use(adminAccess)


// Index Page
// rout GET /admin
router.get("/", indexController.index);



//Categories
//Index Page
//route GET /admin/categories
router.get("/categories", categoryController.index);

//Category Create Page
//route GET /admin/categories/create
router.get("/categories/create", categoryController.create);

//Category Store
//route POST /admin/categories/create
router.post("/categories/create", categoryController.store);

//Category Delete
//route DELETE /admin/categories/delete/:id
router.delete("/categories/delete/:id",categoryController.delete)

//Category Edite Page
//route GET /admin/categories/edit/:id
router.get("/categories/edit/:id",categoryController.editPage)

//Category Update
//route put /admin/categories/update/:id
router.put("/categories/update/:id",categoryController.update)



//provinces
router.get("/provinces", provinceController.index);

//Category Create Page
//route GET /admin/provinces/create
router.get("/provinces/create", provinceController.create);

//Category Store
//route POST /admin/provinces/create
router.post("/provinces/create", provinceController.store);

//Category Delete
//route DELETE /admin/provinces/delete/:id
router.delete("/provinces/delete/:id",provinceController.delete)

//Category Edite Page
//route GET /admin/provinces/edit/:id
router.get("/provinces/edit/:id",provinceController.editPage)

//Category Update
//route put /admin/provinces/update/:id
router.put("/provinces/update/:id",provinceController.update)



//cities
router.get("/cities", cityController.index);

//Category Create Page
//route GET /admin/cities/create
router.get("/cities/create", cityController.create);

//Category Store
//route POST /admin/cities/create
router.post("/cities/create", cityController.store);

//Category Delete
//route DELETE /admin/cities/delete/:id
router.delete("/cities/delete/:id",cityController.delete)

//Category Edite Page
//route GET /admin/cities/edit/:id
router.get("/cities/edit/:id",cityController.editPage)

//Category Update
//route put /admin/cities/update/:id
router.put("/cities/update/:id",cityController.update)


//Posts
//index page
// route GET /admin/posts
router.get("/posts", postController.index);
//province index page
// route GET /admin/posts/:slug
router.get("/posts/:slug", postController.indexProvince);
//post Check page
// route GET /admin/posts/check/:id
router.get("/posts/check/:id", postController.checkPostPage);
router.get("/posts/:slug", postController.indexProvince);
//post update
// route POST /admin/posts/check/:status/:id
router.post("/post/check/:status/:id",postController.update)

//Users
//index Page
//route GET /admin/users
router.get("/users", userController.index);

//update users permisson
//route GET /admin/users/update/:id
router.get("/users/update/:id", userController.update);

//delete users 
//route POST /admin/users/delete/:id
router.delete("/users/delete/:id", userController.delete);







module.exports = router;
