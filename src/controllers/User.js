const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');


const CreateNewUser = {
  async globalMobile( mobile_number){
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
        var newUserToken = await CreateNewUser.globalMobile(req.body.mobile_number)
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
      const id = Helper.generateToken(rows[0].user_id);
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
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send({'message': 'something wrong',error});
    }
  }
}


module.exports = User;