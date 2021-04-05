const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const date_format = "YYYY-MM-DD";

const Treatment = {
    async week_1_2(req, res){
        const doctorID = req.user.id;
        const mobile_number = req.body.mobile_number;
        const treatment_start_date = req.body.start_date;
        const treatment_end_date = req.body.end_date;
        // console.log(moment(new Date()).format(date_format));
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const check_doctor = 'SELECT * FROM doctor WHERE user_id = ($1)';
        const check_patient = 'SELECT * FROM patient WHERE user_id = ($1)';//ask if patient has to be registered, or we can create a new treatment for anyone?
        try{
            const doctor = await db.query(check_doctor, [doctorID]);
            // console.log(doctorID);
            if(!doctor.rows[0]){
                return res.status(400).send({'message':'Doctor not found'});
            }
            // console.log(mobile_number);
            const user = await db.query(mobileQuery, [mobile_number]);
            if(!user.rows[0]){
                return res.status(400).send({'message':'User not registered'});
            }
            const patientID = user.rows[0].user_id;
            const tmp1 = await db.query(check_patient, [patientID]);
            // console.log(patientID);
            if(!tmp1.rows[0]){
                return res.status(400).send({'message':'User not registered as a patient'});
            }
            const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const query = 'INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_id, treatment_start_date, treatment_end_date, staff_1, staff_2) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            const values = [
                treatmentID,
                'Total Knee Arthroplasty Protocol',
                doctorID,
                patientID,
                start_date,
                end_date,
                req.body.staff_1,
                req.body.staff_2
            ];
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const ret = await db.query(query, values);
            // console.log(ret);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, response, threshold) VALUES($1, $2, $3, $4, $5)'
            // Day 1-4 so that the app doesnt break
            for(var i = 1;i<5;i++){            
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                var val = [treatmentID, 26, i, cur_date];
                var tmp2 = await db.query(daily_query, val);
            }
            // Day 5-10
            for(var i = 5;i<=10;i++){
                // console.log("here1");
            var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                // console.log(cur_date);
                for(var j = 1;j<=8;j++){
                    // console.log(start_date + i);
                    // console.log(j);
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                // console.log("here1.5");
                for(var j = 1;j<=5;j++){
                    var val = [treatmentID, i, questions[j-1], null, 0];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
                // console.log("here2");
            }
            for(var i = 11;i<=15;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                for(var j = 1;j<=11;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 6;j<=10;j++){
                    var val = [treatmentID, i, questions[j-1], null, 0];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
            }
            return res.status(200).send({'treatmentID': treatmentID});
            // return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async week_3(req, res){
        const doctorID = req.user.id;
        const mobile_number = req.body.mobile_number;
        const treatment_start_date = req.body.start_date;
        const treatment_end_date = req.body.end_date;
        const treatmentID = req.body.treatmentID;
        // console.log(moment(new Date()).format(date_format));
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const check_doctor = 'SELECT * FROM doctor WHERE user_id = ($1)';
        const check_patient = 'SELECT * FROM patient WHERE user_id = ($1)';//ask if patient has to be registered, or we can create a new treatment for anyone?
        try{
            const doctor = await db.query(check_doctor, [doctorID]);
            // console.log(doctorID);
            if(!doctor.rows[0]){
                return res.status(400).send({'message':'Doctor not found'});
            }
            // console.log(mobile_number);
            const user = await db.query(mobileQuery, [mobile_number]);
            if(!user.rows[0]){
                return res.status(400).send({'message':'User not registered'});
            }
            const patientID = user.rows[0].user_id;
            const tmp1 = await db.query(check_patient, [patientID]);
            // console.log(patientID);
            if(!tmp1.rows[0]){
                return res.status(400).send({'message':'User not registered as a patient'});
            }
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, response, threshold) VALUES($1, $2, $3, $4, $5)'
            console.log("3");
            // var cur_date = moment(new Date(treatment_start_date)).add(30,'d').format(date_format);
            // console.log(cur_date);
            for(var i = 16;i<=30;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                for(var j = 1;j<=12;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 11;j<=15;j++){
                    const val = [treatmentID, i, questions[j-1], null, 0];
                    const tmp2 = await db.query(questionnaire_query, val);
                }
            }
            return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async week_4_5(req, res){
        const doctorID = req.user.id;
        const mobile_number = req.body.mobile_number;
        const treatment_start_date = req.body.start_date;
        const treatment_end_date = req.body.end_date;
        const treatmentID = req.body.treatmentID;
        // console.log(moment(new Date()).format(date_format));
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const check_doctor = 'SELECT * FROM doctor WHERE user_id = ($1)';
        const check_patient = 'SELECT * FROM patient WHERE user_id = ($1)';//ask if patient has to be registered, or we can create a new treatment for anyone?
        try{
            const doctor = await db.query(check_doctor, [doctorID]);
            // console.log(doctorID);
            if(!doctor.rows[0]){
                return res.status(400).send({'message':'Doctor not found'});
            }
            // console.log(mobile_number);
            const user = await db.query(mobileQuery, [mobile_number]);
            if(!user.rows[0]){
                return res.status(400).send({'message':'User not registered'});
            }
            const patientID = user.rows[0].user_id;
            const tmp1 = await db.query(check_patient, [patientID]);
            // console.log(patientID);
            if(!tmp1.rows[0]){
                return res.status(400).send({'message':'User not registered as a patient'});
            }
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, response, threshold) VALUES($1, $2, $3, $4, $5)'
            console.log("4");
            for(var i = 31;i<=37;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                for(var j = 13;j<=18;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 11;j<=15;j++){
                    var val = [treatmentID, i, questions[j-1], null, 0];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
            }
            console.log("5");
            for(var i = 38;i<=44;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                for(var j = 13;j<=21;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
            }
            return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async week_6(req, res){
        const doctorID = req.user.id;
        const mobile_number = req.body.mobile_number;
        const treatment_start_date = req.body.start_date;
        const treatment_end_date = req.body.end_date;
        const treatmentID = req.body.treatmentID;
        // console.log(moment(new Date()).format(date_format));
        const mobileQuery = 'SELECT * FROM users WHERE mobile_number = ($1)';
        const check_doctor = 'SELECT * FROM doctor WHERE user_id = ($1)';
        const check_patient = 'SELECT * FROM patient WHERE user_id = ($1)';//ask if patient has to be registered, or we can create a new treatment for anyone?
        try{
            const doctor = await db.query(check_doctor, [doctorID]);
            // console.log(doctorID);
            if(!doctor.rows[0]){
                return res.status(400).send({'message':'Doctor not found'});
            }
            // console.log(mobile_number);
            const user = await db.query(mobileQuery, [mobile_number]);
            if(!user.rows[0]){
                return res.status(400).send({'message':'User not registered'});
            }
            const patientID = user.rows[0].user_id;
            const tmp1 = await db.query(check_patient, [patientID]);
            // console.log(patientID);
            if(!tmp1.rows[0]){
                return res.status(400).send({'message':'User not registered as a patient'});
            }
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const query = 'INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_id, treatment_start_date, treatment_end_date) VALUES($1, $2, $3, $4, $5, $6)';
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, response, threshold) VALUES($1, $2, $3, $4, $5)'
            for(var i = 45;i<=51;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i,'d').format(date_format);
                for(var j = 22;j<=25;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
            }
            return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            return res.status(400).send(error);
        }
    }
}

module.exports = Treatment;