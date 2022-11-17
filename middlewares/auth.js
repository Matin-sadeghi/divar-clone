exports.auth = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
       
    }else{
        res.redirect("/404")
    }
}

exports.notAuth = (req,res,next)=>{
    if(!req.isAuthenticated()){
        res.redirect("/login")
    }else{
        next();
    }
}