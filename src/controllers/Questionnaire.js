const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Questionnaire = {

    async get_questionnaire(req, res){// for patient side
        const myID = req.user.id;
        const cur_day = req.body.day;
        const query = 'SELECT * FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
        const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const t1 = await db.query(mobileQuery, [myID]);
            const ret = await db.query(query, [t1.rows[0].mobile_number]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const query2 = 'SELECT question_no, question, question_hindi, question_punjabi FROM questionnaire WHERE treatment_id = ($1) AND day_no = ($2)';
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
        const query = 'SELECT * FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
        const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const t1 = await db.query(mobileQuery, [myID]);
            const ret = await db.query(query, [t1.rows[0].mobile_number]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const query2 = 'UPDATE questionnaire SET response = ($1) WHERE day_no = ($2) AND treatment_id = ($3) AND question_no = ($4)';
            const rows = await db.query(query2, [response, cur_day, ret.rows[0].treatment_id, question_id]);
            const query3 = 'SELECT response FROM questionnaire WHERE day_no = ($1) AND treatment_id = ($2)';
            const tmp1 = await db.query(query3, [cur_day, ret.rows[0].treatment_id]);
            var cnt = 0;
            var total = 0;
            for(var i = 0;i<tmp1.rows.length;i++){
                if(tmp1.rows[i].response!=null){
                    total += tmp1.rows[i].response;
                    cnt += 1;
                }
            }
            if(total*10 > 25*cnt){
                const updateQuery1 = 'UPDATE treatment SET starred = 1 WHERE treatment_id = ($1)';
                const tmp2 = await db.query(updateQuery1, [ret.rows[0].treatment_id]);
            }
            else{
                const updateQuery1 = 'UPDATE treatment SET starred = 0 WHERE treatment_id = ($1)';
                const tmp2 = await db.query(updateQuery1, [ret.rows[0].treatment_id]);      
            }
            console.log(cur_date);
            return res.status(200).send({'message':'Successfully updated the response for this question'});
        }catch(error){
            return res.status(400).send(error);
        } 
    },

    async updateQuestionnaireInfo(req, res){
        const myID = req.user.id;
        const query = 'SELECT * FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
        const mobileQuery = 'SELECT * FROM users WHERE user_id = ($1)';
        const cur_date = moment(new Date()).format(date_format);
        try{
            const t1 = await db.query(mobileQuery, [myID]);
            const ret = await db.query(query, [t1.rows[0].mobile_number]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            const updateLastQuestionnaire = 'UPDATE treatment SET questionnaire_fill_date = ($1) WHERE treatment_id = ($2)';
            const tt1 = await db.query(updateLastQuestionnaire, [cur_date, ret.rows[0].treatment_id]);
            const updateQuestionnaireFilled = 'UPDATE treatment SET questionnaire_done = questionnaire_done + 1 WHERE treatment_id = ($1)';
            const tt2 = await db.query(updateQuestionnaireFilled, [ret.rows[0].treatment_id]);
            return res.status(200).send({'message':'Updated last date and number of times filled'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async get_questionnaire_doctor(req, res){// for doctor side
        const doctorID = req.user.id;
        const mobile_number = req.body.mobile_number;//patient mobile number
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const query = 'SELECT * FROM treatment WHERE patient_number = ($1) AND treatment_day > 0';
        // const cur_date = moment(new Date()).format(date_format);
        try{
            const users = await db.query(mobileQuery, [mobile_number]);
            if(!users.rows[0]){
                return res.status(400).send({'message':'No patient found with this mobile number'});
            }
            const myID = users.rows[0].user_id;
            // console.log(myID);
            const ret = await db.query(query, [mobile_number]);
            // console.log(ret.rows[0]);
            if(!ret.rows[0]){
                return res.status(400).send({'message':'Treatment not found for this patient'});
            }
            // console.log(ret.rows[0].questionnaire_fill_date);
            var cur_date = moment(ret.rows[0].questionnaire_fill_date);
            var start_date = moment(ret.rows[0].treatment_start_date);
            var cur_day = cur_date.diff(start_date, 'days')+1;
            // console.log(cur_day)
            const query2 = 'SELECT question_no, question, question_hindi, question_punjabi, response FROM questionnaire WHERE treatment_id = ($1) AND day_no = ($2)';
            const rows = await db.query(query2, [ret.rows[0].treatment_id, cur_day]);
            return res.status(200).send(rows.rows);
        }catch(error){
            console.log(error);
            return res.status(400).send(error);
        }
    },
}

module.exports = Questionnaire;