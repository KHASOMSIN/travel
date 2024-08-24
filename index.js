const express = require("express");
const app = express();
const pool = require("./database/dbConnection"); // Import the database connection
const dbupdate = require("./database/dbUpdate");
const register = require("./auth/register"); // Import the registration router
const verify = require("./auth/verify");
const login = require("./auth/login");
const resetpasword = require("./auth/resetpassword");
const forgotpasword = require("./auth/forgotpassword");
const changepassword = require("./auth/changepassword");
const province = require("./management/getProvinces");
const category = require("./management/getCategory");
const location = require("./management/locattion");
const userprofile = require("./profile/userProfile");
const getuser = require("./profile/getUserbyId");
const updateUser = require("./profile/updateUser");
const provinceDetails = require("./management/provincesDetail");
const placeDetail = require("./management/placeDetail");
const review = require("./management/review");
const reviewPlace = require("./management/reviewPlace");
const getUserAccount = require("./profile/getUserbyemail");
const getProvincesImage = require("./management/getProvincesImage");
const search = require("./management/search");
// const search = require("./management/search");
const insertData = require("./management/insertData");
const placeImage = require("./management/placeImage");

const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", register); // Mount the registration routes under '/auth'
app.use("/auth", verify);
app.use("/auth", login);
app.use("/auth", resetpasword);
app.use("/auth", forgotpasword);
app.use("/auth", changepassword);
app.use("/travel", province);
app.use("/travel", category);
app.use("/user", userprofile);
app.use("/user", getuser);
app.use("/user", updateUser);
app.use("/travel", location);
app.use("/travel", placeDetail);
app.use("/travel", provinceDetails);
app.use("/travel", review);
app.use("/travel", reviewPlace);
app.use("/user", getUserAccount);
app.use("/travel", getProvincesImage);
app.use("/travel", search);
app.use("/insert", insertData);
app.use("/travel", placeImage);

// Example route to fetch users from the database
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).send("Server Error");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
