const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Questionnaire = {

    async get_questionnaire(req, res){// for patient side
        const myID = req.user.id;
        const cur_day = req.body.day;
        const query = 'SELECT * FROM treatment WHERE patient_id = ($1) AND treatment_day > 0';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const ret = await db.query(query, [myID]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const query2 = 'SELECT question_no, question FROM questionnaire WHERE treatment_id = ($1) AND day_no = ($2)';
            const rows = await db.query(query2, [ret.rows[0].treatment_id, cur_day]);
            return res.status(200).send(rows.rows);
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async fill_questionnaire(req, res){
        const myID = req.user.id;
        const cur_day = req.body.day;
        const question_id = req.body.id;
        const response = req.body.response;
        const query = 'SELECT * FROM treatment WHERE patient_id = ($1) AND treatment_day > 0';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const ret = await db.query(query, [myID]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const query2 = 'UPDATE questionnaire SET response = ($1) WHERE day_no = ($2) AND treatment_id = ($3) AND question_no = ($4)';
            const rows = await db.query(query2, [response, cur_day, ret.rows[0].treatment_id, question_id]);
            return res.status(200).send({'message':'Successfully updated the response for this question'});
        }catch(error){
            return res.status(400).send(error);
        } 
    },

    async get_questionnaire_doctor(req, res){// for doctor side
        const doctorID = req.user.id;
        const cur_day = req.body.day;
        const mobile_number = req.body.mobile_number;//patient mobile number
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const query = 'SELECT * FROM treatment WHERE patient_id = ($1) AND treatment_day > 0';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const users = await db.query(mobileQuery, [mobile_number]);
            if(!users.rows[0]){
                return res.status(400).send({'message':'No patient found with this mobile number'});
            }
            const myID = users.rows[0].user_id;
            // console.log(myID);
            const ret = await db.query(query, [myID]);
            // console.log(ret.rows[0]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const query2 = 'SELECT question_no, question, response FROM questionnaire WHERE treatment_id = ($1) AND day_no = ($2)';
            const rows = await db.query(query2, [ret.rows[0].treatment_id, cur_day]);
            return res.status(200).send(rows.rows);
        }catch(error){
            return res.status(400).send(error);
        }
    },
}

module.exports = Questionnaire;