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
    const updateProfile = `UPDATE profile_page SET department = ($1), designation = ($2), hospital = ($3), modified_date = ($4) WHERE user_id = ($5), first_name = ($6), last_name = ($7) returning *`;
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
            myId,
            req.body.first_name,
            req.body.last_name
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
    const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
    const getPatientData = 'SELECT treatment.treatment_id, users.mobile_number, profile_page.first_name, profile_page.last_name, profile_page.profile_pic, treatment.treatment_start_date, treatment.treatment_name, treatment.treatment_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative, treatment.starred, treatment.critical, treatment.treatment_start_date, treatment.questionnaire_fill_date, treatment.questionnaire_done FROM ((((treatment INNER JOIN profile_page ON treatment.patient_number = profile_page.mobile_number AND (treatment.doctor_id = ($1) OR treatment.staff_1 = ($1) OR treatment.staff_2 = ($1))) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id AND date_info.today_date = ($2) AND treatment.treatment_day > 0) INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id) INNER JOIN users ON users.mobile_number = treatment.patient_number)';
    // const allT = 'SELECT users.mobile_number, profile_page.first_name, profile_page.last_name, profile_page.profile_pic, treatment.treatment_name, treatment.treatment_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative FROM ((((treatment INNER JOIN profile_page ON treatment.patient_number = profile_page.mobile_number AND (treatment.doctor_id = ($1) OR treatment.staff_1 = ($1) OR treatment.staff_2 = ($1))) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id AND date_info.today_day = 20) INNER JOIN exercises ON date_info.exercise_id = exercises.exercise_id) INNER JOIN users ON users.mobile_number = treatment.patient_number)';
    // const allT = 'SELECT * FROM treatment WHERE (doctor_id = ($1) OR staff_1 = ($1) OR staff_2 = ($1))';
    // const allT = 'SELECT treatment.treatment_id, users.user_id, profile_page.first_name FROM (((treatment INNER JOIN users ON treatment.patient_number = users.mobile_number AND (treatment.doctor_id = ($1) OR treatment.staff_1 = ($1) OR treatment.staff_2 = ($1))) INNER JOIN profile_page ON profile_page.mobile_number = treatment.patient_number) INNER JOIN date_info ON date_info.treatment_id = treatment.treatment_id)';
    // const allT = 'SELECT * FROM date_info WHERE today_day = 5';
    const cur_date = moment(new Date()).format(date_format);
    try{
        // const ret = await db.query(allT,[myId]);
        // console.log(ret.rows);
        // const tt1 = await db.query(mobileQuery, [myId]);
        // const mobile_number = tt1.rows[0].mobile_number;
        // console.log(mobile_number);
        const { rows } = await db.query(getPatientData, [myId, cur_date]);
        // console.log(rows);
        var arr = [];
        var i = 0;
        var n = Object.keys(rows).length;
        // console.log(n);
        var sorted = [];
        while(i<n){
          sorted.push([rows[i].mobile_number, rows[i].first_name, rows[i].last_name, rows[i].profile_pic, rows[i].treatment_name, rows[i].treatment_day, rows[i].marked_by_patient, rows[i].marked_by_relative, rows[i].starred, rows[i].critical, rows[i].treatment_id, rows[i].treatment_start_date, rows[i].questionnaire_fill_date, rows[i].questionnaire_done]);
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
          arr.push([sorted[i][0], sorted[i][1], sorted[i][2], sorted[i][3], sorted[i][4], sorted[i][5], patient_cnt, relative_cnt, sorted[i][8], sorted[i][9], sorted[i][10], sorted[i][11], sorted[i][12], sorted[i][13]]);
          i = tmp+1;
        }
        console.log(arr);
        return res.status(200).send(arr);
    }
    catch(error){
        console.log(error);
        return res.status(400).send(error);
    }
  },

  async getOnePatient(req, res){
    console.log(req.body)
    const doctorID = req.user.id;
    const mobile_number = req.body.mobile_number;
    const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
    const query = 'SELECT * FROM treatment WHERE (treatment.doctor_id = ($1) OR treatment.staff_1 = ($1) OR treatment.staff_2 = ($1)) AND treatment.patient_number = ($2) AND treatment.treatment_day > 0';
    // const query2 = 'SELECT date_info.today_date, date_info.marked_by_patient, date_info.marked_by_relative FROM (treatment INNER JOIN date_info ON treatment.treatment_id = date_info.treatment_id AND treatment.doctor_id = ($1) AND treatment.patient_id = ($2) AND date_info.today_date BETWEEN treatment.treatment_start_date AND ($3))';
    const query2 = 'SELECT treatment.treatment_id, date_info.today_day, exercises.exercise_name, date_info.marked_by_patient, date_info.marked_by_relative FROM ((treatment INNER JOIN date_info ON treatment.treatment_id = date_info.treatment_id AND (treatment.doctor_id = ($1) OR treatment.staff_1 = ($1) OR treatment.staff_2 = ($1)) AND treatment.patient_number = ($2) AND date_info.today_date <= ($4) AND treatment.treatment_id = ($3)) INNER JOIN exercises ON exercises.exercise_id = date_info.exercise_id)';
    const cur_date = moment(new Date()).format(date_format);
    try{
      const tmp1 = await db.query(mobileQuery, [mobile_number]);
      if(!tmp1.rows[0]){
        return res.status(400).send({'message':'patient not found in database'});
      }
      const patientID = tmp1.rows[0].user_id;
      const ret = await db.query(query, [doctorID, mobile_number]);
      if(!ret.rows[0]){
        return res.status(400).send('This patient does not have a treatment with this doctor');
      }
      const {rows} = await db.query(query2, [doctorID, mobile_number, ret.rows[0].treatment_id, cur_date]);
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
    const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_number = ($2) AND treatment.treatment_day > 0';
    try{
      const t1 = await db.query(mobileQuery, [mobile_number]);
      if(!t1.rows[0]){
        return res.status(400).send({'message':'Could not find patient with this number'});
      }
      const t2 = await db.query(query, [myID, mobile_number]);
      if(!t2.rows[0]){
        return res.status(400).send({'message':'This patient does not have a treatment with this doctor'});
      }
      // console.log(t2.rows);
      const updateQuery = 'UPDATE treatment SET starred = ($1) WHERE treatment_id = ($2)';
      const rows = await db.query(updateQuery, [star, t2.rows[0].treatment_id]);
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async critical(req, res){
    const myID = req.user.id;
    const mobile_number = req.body.mobile_number;
    const star = req.body.critical;
    const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
    const query = 'SELECT * FROM treatment WHERE treatment.doctor_id = ($1) AND treatment.patient_number = ($2) AND treatment_day > 0';
    try{
      const t1 = await db.query(mobileQuery, [mobile_number]);
      if(!t1.rows[0]){
        return res.status(400).send({'message':'Could not find patient with this number'});
      }
      const t2 = await db.query(query, [myID, mobile_number]);
      if(!t2.rows[0]){
        return res.status(400).send({'message':'This patient does not have a treatment with this doctor'});
      }
      const updateQuery = 'UPDATE treatment SET critical = ($1) WHERE treatment_id = ($2)';
      const rows = await db.query(updateQuery, [star, t2.rows[0].treatment_id]);
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async updateStaff(req, res){
    const treatmentID = req.body.treatmentID;
    const myID = req.user.id;
    const mobileQuery = 'SELECT * FROM users WHERE users.mobile_number = ($1)';
    const m1 = req.body.mobile_number1;
    const m2 = req.body.mobile_number2;
    var staff_1 = null;
    var staff_2 = null;
    try{
      console.log([m1, m2])
      if(m1 !=''){
      const t1 = await db.query(mobileQuery, [m1]);
      if(t1.rows[0]){
        staff_1 = t1.rows[0].user_id;
      }
    }
    if(m2 != ''){
      const t2 = await db.query(mobileQuery, [m2]);
      if(t2.rows[0]){
        staff_2 = t2.rows[0].user_id;
      }
    }
      console.log([staff_1, staff_2, treatmentID])
      const query = 'UPDATE treatment SET staff_1 = ($1), staff_2 = ($2) WHERE treatment_id = ($3)';
      const rows = await db.query(query, [staff_1, staff_2, treatmentID]);
      return res.status(200).send({'message':'Updated staff details'});
    }catch(error){
      return res.status(400).send(error);
    }
  },

  async getStaff(req, res){
    const myID = req.user.id;
    const treatmentID = req.body.treatmentID;
    const query = 'SELECT staff_1, staff_2 FROM treatment WHERE treatment_id = ($1)';
    try{
      const t1 = await db.query(query, [treatmentID]);
      const mobileQuery = 'SELECT mobile_number FROM users WHERE user_id = ($1) OR user_id = ($2)';
      const {rows} = await db.query(mobileQuery, [t1.rows[0].staff_1, t1.rows[0].staff_2]);
      return res.status(200).send(rows);
    }catch(error){
      return res.status(400).send(error);
    }
  }

}


module.exports = Doctor;