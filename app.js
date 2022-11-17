const express = require("express");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");
const expressEjsLayouts = require("express-ejs-layouts");
const path = require("path");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const methodOverride = require('method-override');
const fileupload = require('express-fileupload')

const connectDB = require("./config/db");
const {date} = require('./utils/moment');

const app = express();

//config env
dotenv.config({
  path: "./config/config.env",
});
//DB connection
connectDB();
//passport
require("./config/passport");


//bodyParser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());


//flash
app.use(flash());

//express fileupload
app.use(fileupload())
//static
app.use(express.static(path.join(__dirname, "public")));


//methodOverride 

app.use(methodOverride("_method"))
//ejs
app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "./layouts/mainLayouts");

app.use((req, res, next) => {
  app.locals = {
    auth: {
      user: req.user,
      check: req.isAuthenticated(),
    },
    domain:process.env.DOMAIN,
    req,
    date
  };
  next();
});

//routes
app.use("/", require("./routes/home"));
app.use("/admin", require("./routes/admin"));

app.use("/users", require("./routes/user"));


app.use(require("./controllers/errorController").get404);

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log(`find server on port:${PORT} and in ${process.env.NODE_ENV} mood`);
});
