const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const sockitIo = require("socket.io")(server);
require("dotenv").config();

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
const { pharmacy } = require("./Router/backEnd/pharmacy.router");
const { Labs } = require("./Router/backEnd/labs.router");

const { Sequelize } = require("sequelize");
const opts =
  process.env.NODE_ENV === "development"
    ? {}
    : {
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false,
            require: true,
          },
        },
      };

// construct a database connection
console.log(process.env["DATABASE_URL"]);
const db_ = new Sequelize(process.env["DATABASE_URL"], opts);

db_
  .authenticate()
  .then(() => console.log("connected to db"))
  .catch(console.error);

/*--------------------------- start sockit Io ----------------------------------*/
var activeUser = {};
sockitIo.on("connection", (clint) => {
  /* start mack user online  */
  clint.on("activeUser", async (data) => {
    clint._id = data.userId;
    activeUser[data.userId] = {
      id: data.userId,
      lastOpen: null,
    };
    var AlluserFrindes = await db.userFrindes.findOne({
      where: {
        userId: data.userId,
      },
      attributes: ["frindesId"],
    });
    var userFrindActive = {};
    userFrindActive[data.userId] = {
      id: data.userId,
      lastOpen: null,
    };
    if (AlluserFrindes) {
      AlluserFrindes.frindesId.forEach((ele) => {
        if (activeUser[ele] && activeUser[ele].id != "") {
          userFrindActive[ele] = activeUser[ele];
        }
      });
    }
    sockitIo.emit("online", { activeUser: userFrindActive });
  });
  /* end mack user online  */

  /* start create user room to send notification for him */
  clint.on("createYourRoom", (data) => {
    clint.join(data.userId);
  });
  /* end create user room to send notification for him */

  /* start add notification to user  */
  clint.on("addNotificationUser", (data) => {
    clint.broadcast.to(data.userId).emit("addNotificationUser");
  });
  /* end add notification to user  */

  /* start add request to user  */
  clint.on("addRequest", (data) => {
    clint.broadcast.to(data.userId).emit("addRequestNotification");
  });
  /* end add request to user  */

  /* start cancel request to user  */
  clint.on("cancelRequest", (data) => {
    clint.broadcast.to(data.userId).emit("CancelRequestNotification");
  });
  /* end cancel request to user  */

  /* start cancelTowSideRequest to user  */
  clint.on("cancelTowSideRequest", (data) => {
    console.log(typeof data.userId);
    clint.emit("CancelRequestNotificationTowSide");
    clint.broadcast.to(data.userId).emit("CancelRequestNotificationTowSide");
  });
  /* end cancelTowSideRequest to user  */

  /* start acceptTowSideRequest to user  */
  clint.on("acceptTowSideRequest", (data) => {
    clint.emit("acceptRequestNotificationTowSide");
    clint.broadcast.to(data.userId).emit("acceptRequestNotificationTowSide");
  });
  /* end acceptTowSideRequest to user  */

  /* start unFollow to user  */
  clint.on("unFollow", (data) => {
    clint.broadcast.to(data.userId).emit("CancelRequestNotificationTowSide");
  });
  /* end unFollow to user  */

  /* start unFollow to user  */
  clint.on("sendMessageFrindSokit", (data) => {
    clint.broadcast.to(data.frindId).emit("sendMessageFrind", data);
  });
  /* end unFollow to user  */

  /* start clickOnChateToShowMessages */
  clint.on("clickOnChateToShowMessages", (data) => {
    clint.broadcast.to(data.frindId).emit("clickOnChateToShowMessages", data);
  });
  /* end clickOnChateToShowMessages */

  /* start changFrindChateImage */
  clint.on("changFrindChateImage", async (data) => {
    clint.broadcast.to(data.userId).emit("changFrindChateImage", data);
    await db.usersMessage.update(
      { isSeen: true },
      {
        where: {
          to: data.frindId,
          from: data.userId,
        },
      }
    );
  });
  /* end changFrindChateImage */

  clint.on("disconnect", () => {
    activeUser[clint._id] = {
      id: "",
      lastOpen: Date.now(),
    };
    sockitIo.emit("online", { activeUser: activeUser });
  });
});
/*--------------------------- start sockit Io ----------------------------------*/

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
app.use(paginate.middleware(2, 20));
/* ------------- set seting -------------------*/

/*--------------------------- backEnd routers  ----------------------------------*/
app.use("/", dashpord);
app.use("/specialities", specialist);
app.use("/doctors", doctors_router);
app.use("/pationt", pationt_router);
app.use("/pharmacy", pharmacy);
app.use("/Labs", Labs);
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
server.listen(process.env.PORT || 3001, () => {
  console.log("server starte 3001");
});
