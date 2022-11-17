exports.adminAccess = (req,res,next)=>{ 
  
    if(req.isAuthenticated()&&req.user.permisson=="admin"){
     return  next();
    }
    return res.redirect("/404")
}