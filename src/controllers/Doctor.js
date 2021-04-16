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
    console.log(myId);
    const getPatientData = 'SELECT users.mobile_number, profile_page.first_name, profile_page.last_name, profile_page.profile_pic, treatment.treatment_start_date, treatment.treatment_name, treatment.treatment_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative, treatment.starred, treatment.critical FROM ((((treatment INNER JOIN profile_page ON treatment.patient_id = profile_page.user_id AND treatment.doctor_id = ($1)) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id AND date_info.today_day = treatment.treatment_day AND treatment.treatment_day > 0) INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id) INNER JOIN users ON users.user_id = treatment.patient_id)';
    // const allT = 'SELECT users.mobile_number, profile_page.first_name, profile_page.last_name, profile_page.profile_pic, treatment.treatment_name, treatment.treatment_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative FROM ((((treatment INNER JOIN profile_page ON treatment.patient_id = profile_page.user_id AND treatment.doctor_id = ($1)) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id AND date_info.today_day = 5) INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id) INNER JOIN users ON users.user_id = treatment.patient_id)';
    // const allT = 'SELECT * FROM treatment WHERE doctor_id = ($1)';
    // const allT = 'SELECT * FROM date_info WHERE today_day = 5';
    try{
        // const ret = await db.query(allT,[myId]);
        // console.log(ret.rows);
        const { rows } = await db.query(getPatientData, [myId]);
        // console.log(rows);
        var arr = [];
        var i = 0;
        var n = Object.keys(rows).length;
        // console.log(n);
        var sorted = [];
        while(i<n){
          sorted.push([rows[i].mobile_number, rows[i].first_name, rows[i].last_name, rows[i].profile_pic, rows[i].treatment_name, rows[i].treatment_day, rows[i].marked_by_patient, rows[i].marked_by_relative, rows[i].starred, rows[i].critical]);
          i++;
        }
        // console.log(sorted);
        sorted.sort(function(a, b){
          return a[0]<b[0];
        });
        i = 0;
        while(i<n){
          var tmp = i;
          var patient_cnt = 0;
          var relative_cnt = 0;
          var number = sorted[i][0];
          while(tmp<n && sorted[tmp][0] == number){
            patient_cnt += sorted[tmp][6];
            if(sorted[tmp][7] > 0){
              relative_cnt += 1;
            }
            tmp++;
          }
          tmp--;
          if(relative_cnt != patient_cnt){
            relative_cnt = 0;
          }
          if(patient_cnt > 0){
            patient_cnt = 1;
          }
          arr.push([sorted[i][0], sorted[i][1], sorted[i][2], sorted[i][3], sorted[i][4], sorted[i][5], patient_cnt, relative_cnt, sorted[i][8], sorted[i][9]]);
          i = tmp+1;
        }
        console.log(arr);
        return res.status(200).send(arr);
    }
    catch(error){
        return res.status(400).send(error);
    }
  },

  async getOnePatient(req, res){
    console.log(req.body)
    const doctorID = req.user.id;
    const mobile_number = req.body.mobile_number;
    const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
    const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND treatment.treatment_day > 0';
    // const query2 = 'SELECT date_info.today_date, date_info.marked_by_patient, date_info.marked_by_relative FROM (treatment INNER JOIN date_info ON treatment.treatment_id = date_info.treatment_id AND treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND date_info.today_date BETWEEN treatment.treatment_start_date AND ($3))';
    const query2 = 'SELECT date_info.today_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative FROM ((treatment INNER JOIN date_info ON treatment.treatment_id = date_info.treatment_id AND treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND date_info.today_day <= treatment.treatment_day AND treatment.treatment_id = ($3)) INNER JOIN exercises ON exercises.exercise_id = date_info.exercise_id)';
    try{
      const tmp1 = await db.query(mobileQuery, [mobile_number]);
      if(!tmp1.rows[0]){
        return res.status(400).send({'message':'patient not found in database'});
      }
      const patientID = tmp1.rows[0].user_id;
      const ret = await db.query(query, [doctorID, patientID]);
      if(!ret.rows[0]){
        return res.status(400).send('This patient does not have a treatment with this doctor');
      }
      const {rows} = await db.query(query2, [doctorID, patientID, ret.rows[0].treatment_id]);
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  // async finish_treatment(req, res){
  //   const myID = req.user.id;
  //   const mobile_number = req.body.mobile_number;
  //   const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
  //   const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND treatment_day > 0';
  //   try{
  //     const t1 = await db.query(mobileQuery, [mobile_number]);
  //     if(!t1.rows[0]){
  //       return res.status(400).send({'message':'Could not find patient with this number'});
  //     }
  //     const t2 = await db.query(query, [myID, t1.rows[0].user_id]);
  //     if(!t2.rows[0]){
  //       return res.status(400).send({'message':'This patient does not have a treatment with this doctor'});
  //     }
  //     const updateQuery = 'UPDATE treatment SET treatment_day = -1 WHERE treatment_id = ($1)';
  //     const rows = await db.query(updateQuery, [t2.rows[0].treatment_id]);
  //     return res.status(200).send(rows);
  //   }catch(error){
  //     return res.status(400).send(error);
  //   }
  // },

  async star(req, res){
    const myID = req.user.id;
    const mobile_number = req.body.mobile_number;
    const star = req.body.star;
    const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
    const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND treatment_day > 0';
    try{
      const t1 = await db.query(mobileQuery, [mobile_number]);
      if(!t1.rows[0]){
        return res.status(400).send({'message':'Could not find patient with this number'});
      }
      const t2 = await db.query(query, [myID, t1.rows[0].user_id]);
      if(!t2.rows[0]){
        return res.status(400).send({'message':'This patient does not have a treatment with this doctor'});
      }
      const updateQuery = 'UPDATE treatment SET starred = star WHERE treatment_id = ($1)';
      const rows = await db.query(updateQuery, [t2.rows[0].treatment_id]);
      return res.status(400).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async critical(req, res){
    const myID = req.user.id;
    const mobile_number = req.body.mobile_number;
    const star = req.body.critical;
    const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
    const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND treatment_day > 0';
    try{
      const t1 = await db.query(mobileQuery, [mobile_number]);
      if(!t1.rows[0]){
        return res.status(400).send({'message':'Could not find patient with this number'});
      }
      const t2 = await db.query(query, [myID, t1.rows[0].user_id]);
      if(!t2.rows[0]){
        return res.status(400).send({'message':'This patient does not have a treatment with this doctor'});
      }
      const updateQuery = 'UPDATE treatment SET critical = star WHERE treatment_id = ($1)';
      const rows = await db.query(updateQuery, [t2.rows[0].treatment_id]);
      return res.status(400).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  }

}


module.exports = Doctor;