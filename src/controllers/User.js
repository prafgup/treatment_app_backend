const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');


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
    const checkRelative = 'SELECT * FROM relative WHERE user_id = $1';
    try {
      const { rows } = await db.query(text, [req.body.mobile_number]);
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
      // user_type doesnt exists
      if(req.body.user_type == 'p'){
        firstTime = await db.query(checkPatient, [rows[0].user_id]);
      }else if(req.body.user_type == 'd'){
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

    const myId = req.user.id;

    if (!req.body.department || !req.body.designation || !req.body.hospital) {
      return res.status(400).send({'message': 'Some values are missing'});
    }


    const registerDoctorUser = `INSERT INTO doctor(user_id, department,designation,hospital,created_date, modified_date) VALUES($1, $2, $3, $4,$5, $6) returning *`;
    const values = [
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
  async registerPatient(req, res) {

    const myId = req.user.id;

    if (!req.body.relative_1) {
      return res.status(400).send({'message': 'Some values are missing'});
    }

    if (!Helper.isValidMobile(req.body.relative_1)) {
      return res.status(400).send({ 'message': 'Please enter a valid mobile number for relative' });
    }


    const registerPatientUser = `INSERT INTO patient(user_id, relative_1,created_date, modified_date) VALUES($1, $2, $3, $4) returning *`;
    const values = [
      myId,
      req.body.relative_1,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(registerPatientUser, values);
      if (!rows[0]) {
        return res.status(400).send({'message': 'Can not register patient'});
      }

      return res.status(200).send({'message': 'Patient Registered','curr' : rows[0]});

    } catch(error) {
      console.log(error)
      return res.status(400).send({'message': 'something wrong',error});
    }
    
  },

}


module.exports = User;