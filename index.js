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
const PatientWithDb = require('./src/controllers/Patient.js');
const RelativewithDb = require('./src/controllers/Relative.js');
const Questionnaire = require('./src/controllers/Questionnaire.js');
const Treatment = require('./src/controllers/Treatment.js');
const  Auth = require('./src/middleware/Auth.js');
const helper = require('./src/controllers/Helper.js');

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
app.post('/api/v1/register/relative', Auth.verifyToken, UserWithDb.registerRelative);
app.post('/api/v1/profile/update', Auth.verifyToken, ProfileWithDb.updateMyProfile);
app.post('/api/v1/doctor/get_one_patient', Auth.verifyToken, DoctorWithDb.getOnePatient);
app.post('/api/v1/relative/update_friend_requests', Auth.verifyToken, RelativewithDb.updateFriendRequests);
app.post('/api/v1/relative/update_exercise_requests', Auth.verifyToken, RelativewithDb.updateExerciseRequest);
app.post('/api/v1/patient/update_exercises', Auth.verifyToken, PatientWithDb.updateExerciseStatus);
app.post('/api/v1/questionnaire/get_patient_questionnaire', Auth.verifyToken, Questionnaire.get_questionnaire);
app.post('/api/v1/questionnaire/fill_questionnaire',Auth.verifyToken,Questionnaire.fill_questionnaire);
app.post('/api/v1/questionnaire/get_doctor/questionnaire', Auth.verifyToken, Questionnaire.get_questionnaire_doctor);
app.post('/api/v1/treatment/week_1_2', Auth.verifyToken, Treatment.week_1_2);
app.post('/api/v1/treatment/week_3', Auth.verifyToken, Treatment.week_3);
app.post('/api/v1/treatment/week_4_5', Auth.verifyToken, Treatment.week_4_5);
app.post('/api/v1/treatment/week_6', Auth.verifyToken, Treatment.week_6);
app.post('/api/v1/doctor/star', Auth.verifyToken, DoctorWithDb.star);
app.post('/api/v1/doctor/critical', Auth.verifyToken, DoctorWithDb.critical);

app.get('/api/v1/profile/get', Auth.verifyToken, ProfileWithDb.getMyProfile);
app.get('/api/v1/doctor/get_all_patients', Auth.verifyToken, DoctorWithDb.getAllPatients);
app.get('/api/v1/patient/get_treatment_data',Auth.verifyToken, PatientWithDb.getExerciseData);
app.get('/api/v1/patient/get_request_status', Auth.verifyToken, PatientWithDb.getRequestStatus);
app.get('/api/v1/relative/getRequests', Auth.verifyToken, RelativewithDb.getRequests);
app.get('/api/v1/relative/getFriendRequests', Auth.verifyToken, RelativewithDb.getPatientRequests);


console.log(helper.generateToken('37f8111a-f7ce-441f-946c-c9de32dfdce1'));
console.log(helper.generateToken('2466d759-d15d-4882-8d2b-20f7139fa26a'));

app.get("*",(req,res)=>{
  if(process.env.NODE_ENV==="production"){
    res.sendFile(path.join(__dirname,"client/build/index.html"));
  }
});


app.listen(PORT, () => {
  console.log('server has started on port ' + PORT);
});


