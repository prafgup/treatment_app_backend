const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Doctor = {

  async getDoctorProfile(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const myProfile = 'SELECT * FROM doctor where user_id = ($1)';
    try {
      const { rows } = await db.query(myProfile, [myId]);
      return res.status(200).send({ "profile" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async updateDoctorProfile(req, res) {
    console.log(req.body)
    const myId = req.user.id;

    const getMyProfile = 'SELECT * FROM doctor where user_id = ($1)';
    const createProfile = `INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES($1, $2, $3, $4,$5, $6) returning *`;
    const updateProfile = `UPDATE profile_page SET department = ($1), designation = ($2), hospital = ($3), modified_date = ($4) WHERE user_id = ($5) returning *`;
    try {
      const { rows } = await db.query(getMyProfile, [myId]);


      var myProfileUpdated = null;

      if(!rows[0]){
        const createValues = [
            myId,
            req.body.department,
            req.body.designation,
            req.body.hospital,
            moment(new Date()),
            moment(new Date())
          ];

        const newDoctorProfile = await db.query(createProfile, createValues);
        myProfileUpdated = newDoctorProfile.rows[0]
      }else{
        const updateValues = [
            req.body.designation,
            req.body.department,
            req.body.hospital,
            moment(new Date()),
            myId
          ];

          const updatedDoctorProfile = await db.query(updateProfile, updateValues);
          myProfileUpdated = updatedDoctorProfile.rows[0]
      }

      if(!myProfileUpdated){
        return res.status(400).send({'message': 'can not update profile'});
      }

      return res.status(200).send({ myProfileUpdated });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getAllPatients(req, res){
    console.log(req.body)
    const myId = req.user.id;
    const getPatientData = 'SELECT profile_page.first_name, profile_page.last_name, profile_page.profile_pic, treatment.treatment_name, treatment.treatment_day, date_info.marked_by_patient, questionnaire.question, questionnaire.response FROM (((treatment INNER JOIN profile_page ON treatment.patient_id = profile_page.user_id AND treatment.doctor_id = ($1)) INNER JOIN questionnaire ON questionnaire.treatment_id = treatment.treatment_id AND questionnaire.week_no = treatment.treatment_day/7) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id AND date_info.today_date = ($2))';
    try{
        const { rows } = await db.query(getPatientData, [myId,moment(new Date()).format(date_format)]);
        return res.status(200).send(rows);
    }
    catch(error){
        return res.status(400).send(error);
    }
  }

}


module.exports = Doctor;