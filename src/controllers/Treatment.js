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
        const finish_last_treatment = 'SELECT * FROM treatment WHERE treatment_day > 0 AND patient_number = ($1)';
        try{
            const doctor = await db.query(check_doctor, [doctorID]);
            // console.log(doctorID);
            if(!doctor.rows[0]){
                return res.status(400).send({'message':'Doctor not found'});
            }
            // console.log(mobile_number);
            const user = await db.query(mobileQuery, [mobile_number]);
            if(user.rows[0]){
                const patientID = user.rows[0].user_id;
                const tt1 = await db.query(finish_last_treatment, [mobile_number]);
                if(tt1.rows[0]){
                    const updateQuery1 = 'UPDATE treatment SET treatment_day = -1 WHERE treatment_id = ($1)';
                    const tt2 = await db.query(updateQuery1, [tt1.rows[0].treatment_id]);
                }
            }
            const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to perform sit-to-stand at all', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const questions_h = ['घुटने में दर्द और / या सूजन', 'घुटने झुकने / flexion लक्ष्य (90 डिग्री) प्राप्त करने योग्य?', 'घुटने का अधूरा विस्तार / सीधा होना', 'बताए अनुसार दिए गए प्रोटोकॉल का पालन करने में असमर्थ', 'जितनी बार बताया गया है उतनी बार व्यायाम करने में कठिनाई', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'उल्लेख के अनुसार अभ्यास करने में असमर्थ', 'वांछित समय के लिए वांछित स्थिति रखने में असमर्थ', '1-4 व्यायाम करते समय संतुलन की समस्या', 'व्यायाम करते समय होल्डिंग के समय को और अधिक बढ़ाने में कठिनाई', 'घुटनों में दर्द और / या जकड़न'];
            const questions_p = ['ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡੇ ਵਿਚ ਸੋਜ', 'ਗੋਡੇ ਝੁਕਣ / ਮੋੜ ਨਿਸ਼ਾਨਾ (90 ਡਿਗਰੀ) ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ?', 'ਗੋਡੇ ਦਾ ਅਧੂਰਾ ਵਧਣਾ / ਸਿੱਧਾ ਹੋਣਾ', 'ਦੱਸੇ ਅਨੁਸਾਰ ਦਿੱਤੇ ਪ੍ਰੋਟੋਕੋਲ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜਿੰਨੀ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਕਸਰਤ ਕਰਨ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਜਿੰਨਾ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਸੀ, ਬੈਠ ਕੇ ਬੈਠਣ ਵਿਚ ਅਸਮਰਥ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜ਼ਿਕਰ ਕੀਤੇ ਅਨੁਸਾਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ', 'ਲੋੜੀਂਦੇ ਸਮੇਂ ਲਈ ਦੱਸੇ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਸਥਿਤੀ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਅਸਮਰਥ ਅਭਿਆਸ ਕਰਨ ਵੇਲੇ ਸੰਤੁਲਨ ਦੀ ਸਮੱਸਿਆ 1-4', 'ਕਸਰਤ ਕਰਦਿਆਂ ਹੋਲਡ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਵਧਾਉਣ ਲਈ ਅੱਗੇ ਵਧਣ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡਿਆਂ ਵਿਚ ਕਠੋਰਤਾ'];
            const query = 'INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_number, treatment_start_date, treatment_end_date, staff_1, staff_2, questionnaire_fill_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            const t1 = await db.query(mobileQuery, [req.body.staff_1]);
            var staff_1 = null;
            var staff_2 = null;
            if(t1.rows[0]){
                staff_1 = t1.rows[0].user_id;
            }
            const t2 = await db.query(mobileQuery, [req.body.staff_2]);
            if(t2.rows[0]){
                staff_2 = t2.rows[0].user_id;
            }
            const values = [
                treatmentID,
                'Total Knee Arthroplasty Protocol',
                doctorID,
                mobile_number,
                start_date,
                end_date,
                staff_1,
                staff_2,
                start_date
            ];
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const ret = await db.query(query, values);
            // console.log(ret);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, question_hindi, question_punjabi, response, threshold, question_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            // Day 1-4 so that the app doesnt break
            for(var i = 1;i<5;i++){            
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                var val = [treatmentID, 26, i, cur_date];
                var tmp2 = await db.query(daily_query, val);
            }
            // Day 5-10
            for(var i = 5;i<=10;i++){
                // console.log("here1");
            var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                // console.log(cur_date);
                for(var j = 1;j<=5;j++){
                    // console.log(start_date + i);
                    // console.log(j);
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 27;j<=28;j++){
                    // console.log(start_date + i);
                    // console.log(j);
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 6;j<=8;j++){
                    // console.log(start_date + i);
                    // console.log(j);
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                // console.log("here1.5");
                for(var j = 1;j<=5;j++){
                    var val = [treatmentID, i, questions[j-1], questions_h[j-1], questions_p[j-1], null, 0, j];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
                // console.log("here2");
            }
            for(var i = 11;i<=15;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                for(var j = 1;j<=5;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 27;j<=28;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 6;j<=11;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 6;j<=10;j++){
                    var val = [treatmentID, i, questions[j-1], questions_h[j-1], questions_p[j-1], null, 0,j];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
            }
            return res.status(200).send({'treatmentID': treatmentID});
            // return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            console.log(error)
            return res.status(400).send(error);
        }
    },

    async week_3_1(req, res){
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
            // const user = await db.query(mobileQuery, [mobile_number]);
            // if(!user.rows[0]){
            //     return res.status(400).send({'message':'User not registered'});
            // }
            // const patientID = user.rows[0].user_id;
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const questions_h = ['घुटने में दर्द और / या सूजन', 'घुटने झुकने / flexion लक्ष्य (90 डिग्री) प्राप्त करने योग्य?', 'घुटने का अधूरा विस्तार / सीधा होना', 'बताए अनुसार दिए गए प्रोटोकॉल का पालन करने में असमर्थ', 'जितनी बार बताया गया है उतनी बार व्यायाम करने में कठिनाई', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'उल्लेख के अनुसार अभ्यास करने में असमर्थ', 'वांछित समय के लिए वांछित स्थिति रखने में असमर्थ', '1-4 व्यायाम करते समय संतुलन की समस्या', 'व्यायाम करते समय होल्डिंग के समय को और अधिक बढ़ाने में कठिनाई', 'घुटनों में दर्द और / या जकड़न'];
            const questions_p = ['ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡੇ ਵਿਚ ਸੋਜ', 'ਗੋਡੇ ਝੁਕਣ / ਮੋੜ ਨਿਸ਼ਾਨਾ (90 ਡਿਗਰੀ) ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ?', 'ਗੋਡੇ ਦਾ ਅਧੂਰਾ ਵਧਣਾ / ਸਿੱਧਾ ਹੋਣਾ', 'ਦੱਸੇ ਅਨੁਸਾਰ ਦਿੱਤੇ ਪ੍ਰੋਟੋਕੋਲ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜਿੰਨੀ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਕਸਰਤ ਕਰਨ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਜਿੰਨਾ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਸੀ, ਬੈਠ ਕੇ ਬੈਠਣ ਵਿਚ ਅਸਮਰਥ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜ਼ਿਕਰ ਕੀਤੇ ਅਨੁਸਾਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ', 'ਲੋੜੀਂਦੇ ਸਮੇਂ ਲਈ ਦੱਸੇ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਸਥਿਤੀ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਅਸਮਰਥ ਅਭਿਆਸ ਕਰਨ ਵੇਲੇ ਸੰਤੁਲਨ ਦੀ ਸਮੱਸਿਆ 1-4', 'ਕਸਰਤ ਕਰਦਿਆਂ ਹੋਲਡ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਵਧਾਉਣ ਲਈ ਅੱਗੇ ਵਧਣ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡਿਆਂ ਵਿਚ ਕਠੋਰਤਾ'];
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, question_hindi, question_punjabi, response, threshold, question_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            console.log("3");
            // var cur_date = moment(new Date(treatment_start_date)).add(30,'d').format(date_format);
            // console.log(cur_date);
            for(var i = 16;i<=22;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                for(var j = 1;j<=5;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 27;j<=28;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 6;j<=12;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 11;j<=15;j++){
                    var val = [treatmentID, i, questions[j-1], questions_h[j-1], questions_p[j-1], null, 0,j];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
            }
            return res.status(200).send({'message':'Treatment created for this patient'});
        }catch(error){
            return res.status(400).send(error);
        }
    },

    async week_3_2(req, res){
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
            // const user = await db.query(mobileQuery, [mobile_number]);
            // if(!user.rows[0]){
            //     return res.status(400).send({'message':'User not registered'});
            // }
            // const patientID = user.rows[0].user_id;
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const questions_h = ['घुटने में दर्द और / या सूजन', 'घुटने झुकने / flexion लक्ष्य (90 डिग्री) प्राप्त करने योग्य?', 'घुटने का अधूरा विस्तार / सीधा होना', 'बताए अनुसार दिए गए प्रोटोकॉल का पालन करने में असमर्थ', 'जितनी बार बताया गया है उतनी बार व्यायाम करने में कठिनाई', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'उल्लेख के अनुसार अभ्यास करने में असमर्थ', 'वांछित समय के लिए वांछित स्थिति रखने में असमर्थ', '1-4 व्यायाम करते समय संतुलन की समस्या', 'व्यायाम करते समय होल्डिंग के समय को और अधिक बढ़ाने में कठिनाई', 'घुटनों में दर्द और / या जकड़न'];
            const questions_p = ['ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡੇ ਵਿਚ ਸੋਜ', 'ਗੋਡੇ ਝੁਕਣ / ਮੋੜ ਨਿਸ਼ਾਨਾ (90 ਡਿਗਰੀ) ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ?', 'ਗੋਡੇ ਦਾ ਅਧੂਰਾ ਵਧਣਾ / ਸਿੱਧਾ ਹੋਣਾ', 'ਦੱਸੇ ਅਨੁਸਾਰ ਦਿੱਤੇ ਪ੍ਰੋਟੋਕੋਲ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜਿੰਨੀ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਕਸਰਤ ਕਰਨ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਜਿੰਨਾ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਸੀ, ਬੈਠ ਕੇ ਬੈਠਣ ਵਿਚ ਅਸਮਰਥ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜ਼ਿਕਰ ਕੀਤੇ ਅਨੁਸਾਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ', 'ਲੋੜੀਂਦੇ ਸਮੇਂ ਲਈ ਦੱਸੇ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਸਥਿਤੀ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਅਸਮਰਥ ਅਭਿਆਸ ਕਰਨ ਵੇਲੇ ਸੰਤੁਲਨ ਦੀ ਸਮੱਸਿਆ 1-4', 'ਕਸਰਤ ਕਰਦਿਆਂ ਹੋਲਡ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਵਧਾਉਣ ਲਈ ਅੱਗੇ ਵਧਣ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡਿਆਂ ਵਿਚ ਕਠੋਰਤਾ'];
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, question_hindi, question_punjabi, response, threshold, question_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            console.log("3");
            // var cur_date = moment(new Date(treatment_start_date)).add(30,'d').format(date_format);
            // console.log(cur_date);
            for(var i = 23;i<=30;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                for(var j = 1;j<=5;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 27;j<=28;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 6;j<=12;j++){
                    if(j!=11){
                        var val = [treatmentID, j, i, cur_date];
                        var tmp2 = await db.query(daily_query, val);
                    }
                }
                for(var j = 11;j<=15;j++){
                    var val = [treatmentID, i, questions[j-1], questions_h[j-1], questions_p[j-1], null, 0,j];
                    var tmp2 = await db.query(questionnaire_query, val);
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
            // const user = await db.query(mobileQuery, [mobile_number]);
            // if(!user.rows[0]){
            //     return res.status(400).send({'message':'User not registered'});
            // }
            // const patientID = user.rows[0].user_id;
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const questions_h = ['घुटने में दर्द और / या सूजन', 'घुटने झुकने / flexion लक्ष्य (90 डिग्री) प्राप्त करने योग्य?', 'घुटने का अधूरा विस्तार / सीधा होना', 'बताए अनुसार दिए गए प्रोटोकॉल का पालन करने में असमर्थ', 'जितनी बार बताया गया है उतनी बार व्यायाम करने में कठिनाई', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'उल्लेख के अनुसार अभ्यास करने में असमर्थ', 'वांछित समय के लिए वांछित स्थिति रखने में असमर्थ', '1-4 व्यायाम करते समय संतुलन की समस्या', 'व्यायाम करते समय होल्डिंग के समय को और अधिक बढ़ाने में कठिनाई', 'घुटनों में दर्द और / या जकड़न'];
            const questions_p = ['ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡੇ ਵਿਚ ਸੋਜ', 'ਗੋਡੇ ਝੁਕਣ / ਮੋੜ ਨਿਸ਼ਾਨਾ (90 ਡਿਗਰੀ) ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ?', 'ਗੋਡੇ ਦਾ ਅਧੂਰਾ ਵਧਣਾ / ਸਿੱਧਾ ਹੋਣਾ', 'ਦੱਸੇ ਅਨੁਸਾਰ ਦਿੱਤੇ ਪ੍ਰੋਟੋਕੋਲ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜਿੰਨੀ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਕਸਰਤ ਕਰਨ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਜਿੰਨਾ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਸੀ, ਬੈਠ ਕੇ ਬੈਠਣ ਵਿਚ ਅਸਮਰਥ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜ਼ਿਕਰ ਕੀਤੇ ਅਨੁਸਾਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ', 'ਲੋੜੀਂਦੇ ਸਮੇਂ ਲਈ ਦੱਸੇ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਸਥਿਤੀ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਅਸਮਰਥ ਅਭਿਆਸ ਕਰਨ ਵੇਲੇ ਸੰਤੁਲਨ ਦੀ ਸਮੱਸਿਆ 1-4', 'ਕਸਰਤ ਕਰਦਿਆਂ ਹੋਲਡ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਵਧਾਉਣ ਲਈ ਅੱਗੇ ਵਧਣ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡਿਆਂ ਵਿਚ ਕਠੋਰਤਾ'];
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, question_hindi, question_punjabi, response, threshold, question_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            console.log("4");
            for(var i = 31;i<=37;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
                for(var j = 13;j<=18;j++){
                    var val = [treatmentID, j, i, cur_date];
                    var tmp2 = await db.query(daily_query, val);
                }
                for(var j = 11;j<=15;j++){
                    var val = [treatmentID, i, questions[j-1], questions_h[j-1], questions_p[j-1], null, 0, j];
                    var tmp2 = await db.query(questionnaire_query, val);
                }
            }
            console.log("5");
            for(var i = 38;i<=44;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
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
            // const user = await db.query(mobileQuery, [mobile_number]);
            // if(!user.rows[0]){
            //     return res.status(400).send({'message':'User not registered'});
            // }
            // const patientID = user.rows[0].user_id;
            // const treatmentID = uuid();
            // console.log(treatmentID);
            const questions = ['Pain and/or swelling in the knee', 'knee bending/flexion target (90 degree) achievable?', 'Incomplete knee extension/straightening of the knee', 'Unable to follow the given protocol as mentioned', 'Difficulty in doing the exercises as many times as mentioned', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to perform sit-to-stand at all', 'Unable to do sit-to-stand as many times as mentioned', 'Pain in the thighs during/after exercise', 'Pain in the knee during/after exercise', 'Unable to walk for more than 2 steps with the walker', 'Unable to do the exercises as mentioned', 'Unable to hold the desired position as mentioned for the desired time', 'Balance problem while performing exercises 1-4', 'Difficulty in progressing further to increased holding time while doing exercise', 'Pain and/or stiffness in the knees'];
            const questions_h = ['घुटने में दर्द और / या सूजन', 'घुटने झुकने / flexion लक्ष्य (90 डिग्री) प्राप्त करने योग्य?', 'घुटने का अधूरा विस्तार / सीधा होना', 'बताए अनुसार दिए गए प्रोटोकॉल का पालन करने में असमर्थ', 'जितनी बार बताया गया है उतनी बार व्यायाम करने में कठिनाई', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'सिट-टू-स्टैंड करने में असमर्थ', 'उल्लेख के अनुसार कई बार बैठने के लिए खड़े होने में असमर्थ', 'व्यायाम के दौरान / बाद में जांघों में दर्द', 'व्यायाम के दौरान / बाद में घुटने में दर्द', 'वॉकर के साथ 2 से अधिक चरणों के लिए चलने में असमर्थ', 'उल्लेख के अनुसार अभ्यास करने में असमर्थ', 'वांछित समय के लिए वांछित स्थिति रखने में असमर्थ', '1-4 व्यायाम करते समय संतुलन की समस्या', 'व्यायाम करते समय होल्डिंग के समय को और अधिक बढ़ाने में कठिनाई', 'घुटनों में दर्द और / या जकड़न'];
            const questions_p = ['ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡੇ ਵਿਚ ਸੋਜ', 'ਗੋਡੇ ਝੁਕਣ / ਮੋੜ ਨਿਸ਼ਾਨਾ (90 ਡਿਗਰੀ) ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ?', 'ਗੋਡੇ ਦਾ ਅਧੂਰਾ ਵਧਣਾ / ਸਿੱਧਾ ਹੋਣਾ', 'ਦੱਸੇ ਅਨੁਸਾਰ ਦਿੱਤੇ ਪ੍ਰੋਟੋਕੋਲ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜਿੰਨੀ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਕਸਰਤ ਕਰਨ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਜਿੰਨਾ ਵਾਰ ਦੱਸਿਆ ਗਿਆ ਸੀ, ਬੈਠ ਕੇ ਬੈਠਣ ਵਿਚ ਅਸਮਰਥ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਬਿਲਕੁਲ ਵੀ ਬੈਠਣ ਤੋਂ ਅਸਮਰੱਥ ਹੈ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਵਿੱਚ ਪੱਟਾਂ ਵਿੱਚ ਦਰਦ', 'ਕਸਰਤ ਦੌਰਾਨ / ਬਾਅਦ ਗੋਡੇ ਵਿਚ ਦਰਦ', 'ਵਾਕਰ ਨਾਲ 2 ਕਦਮ ਤੋਂ ਵੱਧ ਤੁਰਨ ਵਿੱਚ ਅਸਮਰੱਥ', 'ਜ਼ਿਕਰ ਕੀਤੇ ਅਨੁਸਾਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਅਸਮਰੱਥ', 'ਲੋੜੀਂਦੇ ਸਮੇਂ ਲਈ ਦੱਸੇ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਸਥਿਤੀ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਅਸਮਰਥ ਅਭਿਆਸ ਕਰਨ ਵੇਲੇ ਸੰਤੁਲਨ ਦੀ ਸਮੱਸਿਆ 1-4', 'ਕਸਰਤ ਕਰਦਿਆਂ ਹੋਲਡ ਕਰਨ ਦੇ ਸਮੇਂ ਨੂੰ ਵਧਾਉਣ ਲਈ ਅੱਗੇ ਵਧਣ ਵਿਚ ਮੁਸ਼ਕਲ', 'ਦਰਦ ਅਤੇ / ਜਾਂ ਗੋਡਿਆਂ ਵਿਚ ਕਠੋਰਤਾ'];
            const query = 'INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_id, treatment_start_date, treatment_end_date) VALUES($1, $2, $3, $4, $5, $6)';
            var pad = function(num) { return ('00'+num).slice(-2) };
            var start_date = moment(new Date(treatment_start_date)).format(date_format);
            var end_date = moment(new Date(treatment_end_date)).format(date_format);
            start_date = new Date(treatment_start_date);
            end_date = new Date(treatment_end_date);
            const daily_query = 'INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES($1, $2, $3, $4)';
            const questionnaire_query = 'INSERT INTO questionnaire(treatment_id, day_no, question, question_hindi, question_punjabi, response, threshold, question_no) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
            for(var i = 45;i<=51;i++){
                var cur_date = moment(new Date(treatment_start_date)).add(i-1,'d').format(date_format);
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