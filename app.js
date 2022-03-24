const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const db = require("./models");
const paginate = require("express-paginate");
const session = require("express-session");
const flash = require("connect-flash");
const cookies = require("cookie-parser");
const { dashpord } = require("./Router/backEnd/dashpord_router");
const { specialist } = require("./Router/backEnd/specialities_router");
const {
  pationtAuth_router,
} = require("./Router/frontEnd/auth/pationt/auth_router");
const { userPages } = require("./Router/frontEnd/pageRouterUser");
const { pationtRouter } = require("./Router/frontEnd/pationtRouter");
const {
  doctorAuth_router,
} = require("./Router/frontEnd/auth/docturs/auth_router");
const { doctors_router } = require("./Router/backEnd/doctors_router");
const { doctotrRouter } = require("./Router/frontEnd/doctorRouter");
const { pationt_router } = require("./Router/backEnd/pationt_router");

/* ------------- set seting -------------------*/
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookies());
app.use(
  session({
    secret:
      "هذا الاوبشن خاص بالتشفير يطلب منك نص معين يستخدمه هو عند التشفير وكلما زاد هذا النص زاد الحمايه",
    saveUninitialized: false, // معناها انه عند عمل session لاتقوم بحفظها في الداتابيز الا عندما امرك بذالك
    /*cookie : { // السشن ده هو في الاصل عباره عن cookie لذالك انا اقوم بتحديد بعض القيم لتحديد مده الانتهاء الديفولت هو عند اغلاق المتصفح
        //maxAge : 1 * 60 * 60 * 100, 
    },*/
    resave: true,
  })
);
app.use(flash());
app.use(paginate.middleware(10, 20));
/* ------------- set seting -------------------*/

/*--------------------------- backEnd routers  ----------------------------------*/
app.use("/", dashpord);
app.use("/specialities", specialist);
app.use("/doctors", doctors_router);
app.use("/pationt", pationt_router);
/*--------------------------- backEnd routers  ----------------------------------*/

/*--------------------------- frontEnd routers  ----------------------------------*/
app.use("/pationt", pationtAuth_router);
app.use("/doctor", doctorAuth_router);
app.use("/", userPages);
app.use("/pationt", pationtRouter);
app.use("/doctor", doctotrRouter);

/*--------------------------- frontEnd routers  ----------------------------------*/

app.use((req, res, next) => {
  res.render("error", { message: "this page not hir", title: "Error Page" });
});
/*--------------------------- end route  ----------------------------------*/

server.listen("3001", () => {
  console.log("server started");
});
