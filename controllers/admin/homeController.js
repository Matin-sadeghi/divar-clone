exports.index = async(req,res)=>{
    res.render("admin/index",{pageTitle:"پنل مدیریت | صفحه اصلی",path:"/admin"})
}