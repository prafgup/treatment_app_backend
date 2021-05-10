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
        const myNumber = 'SELECT * FROM users WHERE user_id = $1';
        const accepted = "A";
        const query = 'SELECT profile_page.first_name, profile_page.last_name,profile_page.profile_pic, date_info.today_day, exercises.exercise_name, exercises.exercise_video_url, profile_page.user_id, date_info.exercise_id, date_info.marked_by_relative FROM ((((date_info INNER JOIN treatment ON treatment.treatment_id = date_info.treatment_id AND date_info.marked_by_patient = 1 AND treatment.treatment_day > 0) INNER JOIN profile_page ON profile_page.mobile_number = treatment.patient_number) INNER JOIN patient ON patient.user_id = profile_page.user_id AND ((patient.relative_1 = ($1) AND patient.relative_1_status = ($3)) OR (patient.relative_2 = ($2) AND patient.relative_2_status = ($3)))) INNER JOIN exercises ON exercises.exercise_id = date_info.exercise_id)';
        try{
            const user = await db.query(myNumber, [myID]);
            if (!user.rows[0]) {
                return res.status(400).send({'message': 'User not found'});
            }
            console.log("Relative");
            console.log(user.rows[0].mobile_number);
            const {rows} = await db.query(query, [user.rows[0].mobile_number, user.rows[0].mobile_number, accepted]);
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
        patient.user_id,
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

            return res.status(200).send({
                myNumber : user.rows[0].mobile_number,
                patients: patientRequests.rows
            });
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async updateFriendRequests(req, res){// update incoming relative requests
        const myID = req.user.id;
        const patientID = req.body.user_id;
        const accept_status = req.body.status;
        const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
        const query1 = 'UPDATE patient SET relative_1_status = ($1) WHERE relative_1 = ($2) AND user_id = ($3)';
        const query2 = 'UPDATE patient SET relative_2_status = ($1) WHERE relative_2 = ($2) AND user_id = ($3)';
        const values = [
           myID 
        ];
        try{
            const users = await db.query(mobileQuery, values);
            if(!users.rows[0]){
                return res.status(400).send({'message':'User not registered'});
            }
            const mobile_number = users.rows[0].mobile_number;
            const val = [
                accept_status,
                mobile_number,
                patientID
            ];
            const r1 = await db.query(query1, val);
            const r2 = await db.query(query2, val);
            return res.status(200).send({'message':'updated requests'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async updateExerciseRequest(req, res){// update patient exercise requests
        console.log(req.body);
        const cur_day = req.body.day;
        const cur_date = moment(new Date()).format(date_format);
        const query = 'UPDATE date_info SET marked_by_relative = ($1) WHERE date_info.today_day = ($2) AND date_info.exercise_id = ($3) AND date_info.treatment_id = ($4)';
        const getTreatment = 'SELECT * FROM treatment WHERE treatment.patient_number = ($1) AND treatment.treatment_day > 0';
        const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
        // const debug = 'SELECT * FROM date_info WHERE marked_by_relative = 1';
        const values1 = [
            req.body.patient_id
        ];
        try{
            const t1 = await db.query(mobileQuery, values1);
            const user = await db.query(getTreatment, [t1.rows[0].mobile_number]);
            if(!user.rows[0]){
                return res.status(400).send({'message':'Cannot update exercise status'});
            }
            const treatmentID = user.rows[0].treatment_id;
            const values2 = [
                req.body.exercise_status,
                cur_day,
                req.body.exercise_id,
                treatmentID
            ];
            const {rows} = await db.query(query, values2);
            // const tmp = await db.query(debug);
            // console.log(tmp.rows[0]);
            return res.status(200).send(rows);
        }catch(error){
            return res.status(400).send(error);
        }
    }
}



module.exports = Relative;