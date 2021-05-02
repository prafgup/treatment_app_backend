const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');
const VerifyUsersUtil = require("./VerifiedUsers").VerifiedUsersUtil;


const CreateNewUser = {
  async globalMobileRegister( mobile_number){
    const createQueryUser = `INSERT INTO users(user_id, mobile_number,created_date, modified_date) VALUES($1, $2, $3, $4) returning *`;
    const values = [
      uuid(),
      mobile_number,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQueryUser, values);
      const token = Helper.generateToken(rows[0].user_id);
      return token;
    } catch(error) {
      return null;
    }
  },
}



const User = {
 
  /**
   * Login
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async login(req, res) {

    console.log(req.body)

    // send mobile_number, auth_token (firebase) and user_type (p for patient, d for doctor,s for staff, r for relative)

    // verify auth token
    
    if (!req.body.mobile_number || !req.body.user_type) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    if (!Helper.isValidMobile(req.body.mobile_number)) {
      return res.status(400).send({ 'message': 'Please enter a valid mobile number' });
    }

    if (!(req.body.user_type == 'p' || req.body.user_type == 'd' || req.body.user_type == 's' || req.body.user_type == 'r' )) {
      return res.status(400).send({'message': 'user_type is invalid'});
    }
    
    const text = 'SELECT * FROM users WHERE mobile_number = $1';
    const checkDoctor = 'SELECT * FROM doctor WHERE user_id = $1';
    const checkPatient = 'SELECT * FROM patient WHERE user_id = $1';
    const checkStaff = 'SELECT * FROM staff WHERE user_id = $1';
    const checkRelative = 'SELECT * FROM relative_table WHERE user_id = $1';
    try {
      const { rows } = await db.query(text, [req.body.mobile_number]);
      // console.log("kasjdfksjf");
      console.log(rows)
      if (!rows[0]) {
        console.log('first time on app')
        // first time on app
        var newUserToken = await CreateNewUser.globalMobileRegister(req.body.mobile_number)
        if(!newUserToken){
          res.status(400).send({'message': 'new user addition failed'});
        }
        return res.status(250).send({'message': 'Please Register the new use_type',token : newUserToken});
      }

      var firstTime = null;
      var checkVerified = null
      // user_type doesnt exists
      if(req.body.user_type == 'p'){
        firstTime = await db.query(checkPatient, [rows[0].user_id]);
      }else if(req.body.user_type == 'd'){
        checkVerified = await VerifyUsersUtil.checkNumber(req.body.mobile_number)
        if( checkVerified == null){
          return res.status(400).send({ "message" : "Doctor Not Authorized To Register" });
        }
        firstTime = await db.query(checkDoctor, [rows[0].user_id]);
      }else if(req.body.user_type == 's'){
        firstTime = await db.query(checkStaff, [rows[0].user_id]);
      }else if(req.body.user_type == 'r'){
        firstTime = await db.query(checkRelative, [rows[0].user_id]);
      }

      const token = Helper.generateToken(rows[0].user_id);
      const id = rows[0].user_id;
      if(!firstTime.rows[0]){
        return res.status(250).send({'message': 'Please Register the new use_type',token});
      }

      return res.status(200).send({ token , id });
    } catch(error) {
      console.log(error)
      return res.status(400).send({'message': 'something wrong',error});
    }
  },

    /**
   * Register Doctor
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async registerDoctor(req, res) {
    console.log(req.body)
    console.log(req.user)
    const myId = req.user.id;

    if (!req.body.department || !req.body.designation || !req.body.hospital) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    const registerDoctorUser = `INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date, first_name, last_name) VALUES($1, $2, $3, $4,$5, $6, $7, $8) returning *`;
    const registerStaffUser = `INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES($1, $2, $3, $4,$5, $6) returning *`;
    const values = [
      myId,
      req.body.department,
      req.body.designation,
      req.body.hospital,
      moment(new Date()),
      moment(new Date()),
      req.body.first_name,
      req.body.last_name
    ];
    const values1 = [
      myId,
      req.body.department,
      req.body.designation,
      req.body.hospital,
      moment(new Date()),
      moment(new Date())
    ];
    try {
      const { rows } = await db.query(registerDoctorUser, values);
      if (!rows[0]) {
        return res.status(400).send({'message': 'Can not register doctor'});
      }
      const t1 = await db.query(registerStaffUser, values1);

      return res.status(200).send({'message': 'Doctor Registered','curr' : rows[0]});

    } catch(error) {
      console.log(error)
      return res.status(400).send({'message': 'something wrong',error});
    }
    
  },

     /**
   * Register Staff
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async registerStaff(req, res) {

    const myId = req.user.id;

    if (!req.body.department || !req.body.designation || !req.body.hospital) {
      return res.status(400).send({'message': 'Some values are missing'});
    }


    const registerStaffUser = `INSERT INTO staff(user_id, department,designation,hospital,created_date, modified_date) VALUES($1, $2, $3, $4,$5, $6) returning *`;
    const values = [
      myId,
      req.body.department,
      req.body.designation,
      req.body.hospital,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(registerStaffUser, values);
      if (!rows[0]) {
        return res.status(400).send({'message': 'Can not register Staff'});
      }

      return res.status(200).send({'message': 'Staff Registered','curr' : rows[0]});

    } catch(error) {
      console.log(error)
      return res.status(400).send({'message': 'something wrong',error});
    }
    
  },

   /**
   * Register Patient
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async registerPatient(req, res) { /*    ADD PROFILE DATA HERE */

    const myId = req.user.id;

    if (!req.body.relative_1) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    if (!Helper.isValidMobile(req.body.relative_1)) {
      return res.status(400).send({ 'message': 'Please enter a valid mobile number for relative' });
    }


    const registerPatientUser = `INSERT INTO patient(user_id, relative_1,relative_2,relative_1_status,relative_2_status,created_date, modified_date) VALUES($1, $2, $3, $4, $5, $6, $7) returning *`;
    const patientPage = 'INSERT INTO profile_page(user_id, first_name, last_name, dob, profile_pic, home_address, email_id, created_date, modified_date, mobile_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *';
    const checkProfile = 'SELECT * FROM profile_page where user_id = $1'
    const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
    const mobileVal = [
      myId
    ];
    const values = [
      myId,
      req.body.relative_1,
      req.body.relative_2,
      'W',
      'W',
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(registerPatientUser, values);
      if (!rows[0]) {
        return res.status(400).send({'message': 'Can not register patient'});
      }
      const t1 = await db.query(mobileQuery, mobileVal);
      // console.log(t1.rows[0].mobile_number);
      const check = await db.query(checkProfile, [myId]); // check profile exists
      const profilePageValues = [
        myId,
        req.body.first_name, 
        req.body.last_name,
        req.body.dob, 
        req.body.profile_pic,
        req.body.home_address,
        req.body.email_id,
        moment(new Date()),
        moment(new Date()),
        t1.rows[0].mobile_number
      ];
      if (!check.rows[0]){
        await db.query(patientPage, profilePageValues);
      }



      return res.status(200).send({'message': 'Patient Registered','curr' : rows[0]});

    } catch(error) {
      console.log(error)
      return res.status(400).send({'message': 'something wrong',error});
    }
    
  },
  
  /*
  REGISTER RELATIVE HERE
  */
  async registerRelative(req, res){
    const myId = req.user.id;

    if (!Helper.isValidMobile(req.body.mobile_number)) {
      return res.status(400).send({ 'message': 'Please enter a valid mobile number' });
    }

    const registerRelativeUser = `INSERT INTO relative_table(user_id, mobile_number, created_date, modified_date) VALUES($1, $2, $3, $4) returning *`;
    const values = [
      myId,
      req.body.mobile_number,
      moment(new Date()),
      moment(new Date())
    ];
    try{
      const {rows} = await db.query(registerRelativeUser, values);
      if(!rows[0]){
        return res.status(400).send({'message': 'Cannot register relative'});
      }
      return res.status(200).send({'message':'Relative registered', 'cur':rows[0]});
    }catch(error){
      return res.status(400).send(error);
    }
  }
}


module.exports = User;