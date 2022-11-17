exports.get404 = (req,res)=>{
    res.render("errors/404",{
        pageTitle:"not found|پیدا نشد",
        path:"/404"
    })
    
}
