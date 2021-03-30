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

  async getExerciseData(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const cur_date = moment(new Date()).format(date_format);

    const treatment_id = 'SELECT treatment_id FROM treatment WHERE patient_id = ($1) AND treatment_end_date >= ($2)';
    const exerciseQuery = 'SELECT date_info.today_date, exercises.exercise_name, date_info.marked_by_patient FROM (date_info INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id AND date_info.treatment_id = ($1) AND date_info.today_date <= ($2))';
    try {
      const { rows } = await db.query(treatment_id, [myId, cur_date]);
    //   console.log("Treatment id");
        const treatment_data = null;
        const treatmentID = rows[0].treatment_id;
        // console.log(treatmentID);
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

      const treatment_id = 'SELECT treatment_id FROM treatment WHERE patient_id = ($1) AND treatment_end_date >= ($2)';
      const exerciseQuery = 'SELECT date_info.today_date, exercises.exercise_name, date_info.marked_by_relative FROM (date_info INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id AND date_info.treatment_id = ($1) AND date_info.marked_by_patient = 1)';
      try{
        const val1 = [
            myID,
            cur_date
        ];
        const {rows} = await db.query(treatment_id, val1);
        const treatmentID = rows[0].treatment_id;
        console.log(treatmentID);
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
  }

}

module.exports = Patient;