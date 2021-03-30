const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Relative = {
    async getRequests(req, res){
        console.log(req.body);
        const myID = req.user.id;
        const cur_date = moment(new Date()).format(date_format);
        const query = 'SELECT profile_page.first_name, profile_page.last_name, date_info.today_date, exercises.exercise_name FROM ((((date_info INNER JOIN treatment ON treatment.treatment_id = date_info.treatment_id AND date_info.marked_by_patient = 1 AND date_info.marked_by_relative = 0 AND treatment.treatment_end_date >= ($1)) INNER JOIN profile_page ON profile_page.user_id = treatment.patient_id) INNER JOIN patient ON patient.user_id = treatment.patient_id AND patient.relative_1 = ($2)) INNER JOIN exercises ON exercises.exercise_id = date_info.exercise_id)';
        try{
            const {rows} = await db.query(query, [cur_date, myID]);
            // console.log(rows);
            return res.status(200).send(rows);
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async getPatientRequests(req, res){
        console.log(req.body);
        const myID = req.user.id;
        const myNumber = 'SELECT * FROM users WHERE user_id = $1';
        const getRequests = `SELECT  
        profile_page.first_name, 
        profile_page.last_name,  
        profile_page.profile_pic, 
        patient.relative_1, 
        patient.relative_2, 
        patient.relative_1_status, 
        patient.relative_2_status 
        FROM (patient INNER JOIN profile_page ON patient.user_id = profile_page.user_id)
        WHERE patient.relative_1=($1) OR patient.relative_2=($2)
        `

        try{
            const user = await db.query(myNumber, [myID]);
            if (!user.rows[0]) {
                return res.status(400).send({'message': 'User not found'});
            }

            const patientRequests = await db.query(getRequests, [user.rows[0].mobile_number,user.rows[0].mobile_number]);

            return res.status(200).send(patientRequests.rows);
        }catch(error){
            return res.status(400).send(error);
        }
    },
}



module.exports = Relative;