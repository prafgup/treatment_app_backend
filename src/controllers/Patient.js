const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Patient = {

  async getPatientProfile(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const myProfile = 'SELECT * FROM profile_page where user_id = ($1)';
    try {
      const { rows } = await db.query(myProfile, [myId]);
      return res.status(200).send({ "profile" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  async getPatientRelativeInfo(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const myProfile = 'SELECT * FROM patient where user_id = ($1)';
    try {
      const { rows } = await db.query(myProfile, [myId]);
      return res.status(200).send({ "profile" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getExerciseData(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const cur_date = moment(new Date()).format(date_format);

    const treatment_id = 'SELECT * FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
    const exerciseQuery = 'SELECT date_info.today_day, exercises.exercise_name, exercises.exercise_rep, exercises.instructions, exercises.exercise_video_url, exercises.exercise_img_url, exercises.duration, date_info.marked_by_patient FROM (date_info INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id AND date_info.treatment_id = ($1) AND date_info.today_date <= ($2))';
    const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
    try {
      const t1 = await db.query(mobileQuery, [myId]);
      const { rows } = await db.query(treatment_id, [t1.rows[0].mobile_number]);
      // console.log("Treatment id");
        const treatment_data = null;
        const treatmentID = rows[0].treatment_id;
        const cur_day = rows[0].treatment_day;
        // console.log(rows[0]);
      if(treatmentID != null){
        const values = [
            treatmentID,
            cur_date
          ];
        const getTreatment = await db.query(exerciseQuery, values);
        // console.log("data");
        // console.log(getTreatment.rows);
        return res.status(200).send(getTreatment.rows);
      }else{
        return res.status(400).send({'message':'no ongoing treatment for this patient'});
      }
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getRequestStatus(req, res){
      console.log(req.body);
      const myID = req.user.id;
    //   console.log(myID);
      const cur_date = moment(new Date()).format(date_format);

      const treatment_id = 'SELECT treatment_id, treatment_day FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
      const exerciseQuery = 'SELECT date_info.today_day, exercises.exercise_name, date_info.marked_by_relative FROM (date_info INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id AND date_info.treatment_id = ($1) AND date_info.marked_by_patient = 1)';
      const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
      try{
        const val1 = [
            myID
        ];
        const t1 = await db.query(mobileQuery, [myID]);
        const {rows} = await db.query(treatment_id, [t1.rows[0].mobile_number]);
        const treatmentID = rows[0].treatment_id;
        // console.log(rows[0].treatment_day);
        // console.log(treatmentID);
        if(treatmentID != null){
            const values = [
                treatmentID
            ];
            const exerciseStatus = await db.query(exerciseQuery, values);
            // console.log("data");
            // console.log(exerciseStatus.rows);
            return res.status(200).send(exerciseStatus.rows);
        }
        else{
            return res.status(400).status({'message':'This patient has no ongoing treatment'});
        }
    }catch(error){
        return res.status(400).send(error);
    }
  },

  async updateExerciseStatus(req, res){//also update treatment day here
    const myID = req.user.id;
    const cur_day = req.body.day;
    const cur_date = moment(new Date()).format(date_format);
    const treatmentQuery = 'SELECT * FROM treatment WHERE treatment_day > 0 AND patient_number = ($1)';
    const query = 'UPDATE date_info SET marked_by_patient = ($1) WHERE date_info.treatment_id = ($2) AND date_info.today_day = ($3)';
    const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
    const update_day = 'UPDATE treatment SET treatment_day = treatment_day + 1 WHERE treatment_id = ($1)';
    const val1 = [
      myID
    ];
    try{
      const t1 = await db.query(mobileQuery, [myID]);
      const users = await db.query(treatmentQuery, [t1.rows[0].mobile_number]);
      console.log(t1.rows[0].mobile_number);
      if(!users.rows[0]){
        return res.status(400).send({'message':'Cannot find treatment'});
      }
      // console.log("Day");
      // console.log(cur_day);
      const values = [
        1,
        users.rows[0].treatment_id,
        cur_day
      ];
      const ret = await db.query(query, values);
      const tmp = await db.query(update_day, [users.rows[0].treatment_id]);
      const t2 = await db.query(treatmentQuery, [t1.rows[0].mobile_number]);
      console.log("Day");
      console.log(t2.rows[0].treatment_day);
      return res.status(200).send(ret.rows);
    }catch(error){
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async updateQuestionnaire(req, res){

  }

}

module.exports = Patient;