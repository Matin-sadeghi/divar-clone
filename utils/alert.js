exports.salert = (req, detiles) => {
  let title = detiles.title || "",
    message = detiles.message || "",
    icon = detiles.icon || "",
    button = detiles.button || "",
    timer = detiles.timer || 2000;

  req.flash("sweetalert", { title, message, icon, button, timer });
};

exports.salertAndBack = (req, res, detiles) => {
  salert(req, detiles);
  res.redirect(req.header("Referer") || "/");
};
