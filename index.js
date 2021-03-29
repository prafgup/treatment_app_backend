const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./src/db.js");
const PORT = process.env.PORT||5000;
const path=require("path");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');


const  UserWithDb = require('./src/controllers/User.js');
const  ProfileWithDb = require('./src/controllers/Profile.js');
const DoctorWithDb = require('./src/controllers/Doctor.js');

const  Auth = require('./src/middleware/Auth.js');
const helper = require('./src/controllers/Helper.js');
const Doctor = require("./src/controllers/Doctor.js");

dotenv.config();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////////////////////////////////

// dbOperations.createUserTable();
// dbOperations.createTrainsTable();


////////////////////////////////////////////////

//middleware
app.use(cors());
app.use(express.json()); //req.body

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"client/build")));
}
console.log(__dirname);
//ROUTES//



app.get("/", (req, res) => {
  res.json({ message: "Welcome to treatment application." });
});


app.post('/api/v1/users/login',UserWithDb.login);  // mobile_number , auth_token , user_type
app.post('/api/v1/register/doctor', Auth.verifyToken, UserWithDb.registerDoctor);
app.post('/api/v1/register/staff', Auth.verifyToken, UserWithDb.registerStaff);
app.post('/api/v1/register/patient', Auth.verifyToken, UserWithDb.registerPatient);
app.post('/api/v1/profile/update', Auth.verifyToken, ProfileWithDb.updateMyProfile);
app.get('/api/v1/profile/get', Auth.verifyToken, ProfileWithDb.getMyProfile);
app.get('/api/v1/doctor/get_all_patients', Auth.verifyToken, DoctorWithDb.getAllPatients);
app.get('/api/v1/doctor/get_one_patient', Auth.verifyToken, DoctorWithDb.getOnePatient);

console.log(helper.generateToken('2b6941fa-525e-45e9-88f1-582d19af6c34'));


app.get("*",(req,res)=>{
  if(process.env.NODE_ENV==="production"){
    res.sendFile(path.join(__dirname,"client/build/index.html"));
  }
});


app.listen(PORT, () => {
  console.log('server has started on port ' + PORT);
});


