-- -- Change AUTO_INCREMENT to IDENTITY while pushing to database, pgadmin doesnt accept AUTO_INCREMENT
-- DROP TABLE IF EXISTS date_info;
-- DROP TABLE IF EXISTS questionnaire;
DROP TABLE IF EXISTS treatment;
-- DROP TABLE IF EXISTS exercises;
-- DROP TABLE IF EXISTS staff;
-- DROP TABLE IF EXISTS relative_table;
-- DROP TABLE IF EXISTS doctor;
-- DROP TABLE IF EXISTS patient;
-- DROP TABLE IF EXISTS profile_page;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS verified_users;

CREATE TABLE IF NOT EXISTS
    verified_users(
        id VARCHAR(256) PRIMARY KEY,
		added_by VARCHAR(256),
        mobile_number VARCHAR(10) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );
	
	
CREATE TABLE IF NOT EXISTS
    users(
        user_id VARCHAR(256) PRIMARY KEY,
        auth_token VARCHAR(1024),
        mobile_number VARCHAR(10) NOT NULL UNIQUE,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    doctor(
        user_id VARCHAR(256) PRIMARY KEY,
        first_name VARCHAR(256),
        last_name VARCHAR(256),
        department VARCHAR(128) NOT NULL,
        designation VARCHAR(128) NOT NULL,
        hospital VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    patient(
        user_id VARCHAR(256) PRIMARY KEY,
        relative_1 VARCHAR(128),
        relative_1_status VARCHAR(128),
        relative_2 VARCHAR(128),
        relative_2_status VARCHAR(128),
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    profile_page(
        user_id VARCHAR(256) PRIMARY KEY,
        first_name VARCHAR(128),
        last_name VARCHAR(128),
        dob DATE,
        mobile_number VARCHAR(10) NOT NULL UNIQUE,
        profile_pic VARCHAR(1024),
        home_address VARCHAR(128),
        email_id VARCHAR(128),
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS 
    relative_table(
        user_id VARCHAR(256) PRIMARY KEY,
        mobile_number VARCHAR(256),
        created_date TIMESTAMP, 
        modified_date TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    staff(
        user_id VARCHAR(256) PRIMARY KEY,
        department VARCHAR(128) NOT NULL,
        designation VARCHAR(128) NOT NULL,
        hospital VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    treatment(
        treatment_id VARCHAR(256) PRIMARY KEY NOT NULL,
        treatment_name VARCHAR(256) NOT NULL,
        doctor_id VARCHAR(256) NOT NULL,
        patient_number VARCHAR(256) NOT NULL,
        treatment_start_date DATE NOT NULL,
        treatment_end_date DATE,
        questionnaire_fill_date DATE,
        questionnaire_done int DEFAULT 0,
        treatment_day int DEFAULT 1,
        staff_1 VARCHAR(256),
        staff_2 VARCHAR(256),
        FOREIGN KEY (doctor_id) REFERENCES doctor(user_id) ON DELETE CASCADE,
        starred int DEFAULT 0,
        critical int DEFAULT 0
        -- FOREIGN KEY (staff_1) REFERENCES staff(user_id),
        -- FOREIGN KEY (staff_2) REFERENCES staff(user_id) -- ye dikkat degi to ek null value staff mai daalna padega
    );

CREATE TABLE IF NOT EXISTS
    exercises(
        exercise_id int PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        exercise_rep int NOT NULL,
        exercise_name VARCHAR(128) NOT NULL,
        instructions VARCHAR(500) NOT NULL,
        exercise_video_url VARCHAR(128),
        exercise_img_url VARCHAR(128),
        duration int 
    );

CREATE TABLE IF NOT EXISTS
    date_info(
        treatment_id VARCHAR(256) NOT NULL,
        today_day int NOT NULL,
        today_date DATE,
        exercise_id int NOT NULL,
        marked_by_patient int DEFAULT 0,
        marked_by_relative int DEFAULT 0,
        PRIMARY KEY (treatment_id, today_day, exercise_id),
        FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    questionnaire(
        treatment_id VARCHAR(256) NOT NULL,
        question_no int,
        day_no int DEFAULT 0,
        question VARCHAR(256) NOT NULL,
        question_hindi VARCHAR(256),
        question_punjabi VARCHAR(256),
        response int,
        threshold int DEFAULT 0,
        PRIMARY KEY (treatment_id, day_no, question),
        FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE
    );

INSERT INTO verified_users(id, added_by, mobile_number,created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af23u','ADMIN_PG',7777777777,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO verified_users(id, added_by, mobile_number,created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af23g','ADMIN_PG',9871029370,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO verified_users(id, added_by, mobile_number,created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af23h','ADMIN_PG',9234567899,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af6c34',7777777777,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af6c34','Ortho', 'Surgeon', 'A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('ed7e013d-4401-4543-9ca8-ecfe95bb020a',9871029370,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES('ed7e013d-4401-4543-9ca8-ecfe95bb020a','Ortho', 'anaesthesia', 'B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8',5234568546,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce9',6234567811,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce0',8750565754,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce1',9999999999,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1,relative_2,relative_1_status,relative_2_status,created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8','9999999999','8750565754','W','W', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1,relative_2,relative_1_status,relative_2_status,created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce9','9999999999','8750565754','A','W', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1,relative_2,relative_1_status,relative_2_status,created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce0','8750565754','9999999999','W','A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1,relative_2,relative_1_status,relative_2_status,created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce1','8750565754','8999999999','A','R', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date, mobile_number) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5234568546);
INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date, mobile_number) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce9','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6234567811);
INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date, mobile_number) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce0','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8750565754);
INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date, mobile_number) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce1','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9999999999);
-- add question details here, as they wont be changed later
INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('0f8ec339-c38b-4832-b10d-b8f288fe0100', 999999999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO relative_table(user_id, mobile_number, created_date, modified_date) VALUES('0f8ec339-c38b-4832-b10d-b8f288fe0100', 999999999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af6c34', 'a1', 'a2', 'a3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'push up', 'just use your hands', 2);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'pull up', 'just use your hands', 4);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'walking', 'just use your hands', 6);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'swimming', 'just use your hands', 8);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(25, 'ankle toe movement', 'N/A', 10);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'isometric quads ', 'N/A', 4);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'straight leg raise (supine)', 'N/A', 5);
-- INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(10, 'straight leg raise (side-lying)', 'N/A', 10);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('2466d759-d15d-4882-8d2b-20f7139fa26a',9234567899, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES('2466d759-d15d-4882-8d2b-20f7139fa26a','Ortho', 'Surgeon', 'B',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES('2466d759-d15d-4882-8d2b-20f7139fa26a','Ortho', 'Surgeon', 'B',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_id, treatment_start_date, treatment_end_date, staff_1) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 'knee surgery', '2b6941fa-525e-45e9-88f1-582d19af6c34', '37f8111a-f7ce-441f-946c-c9de32dfdce8', CURRENT_DATE, CURRENT_DATE + 30, '2b6941fa-525e-45e9-88f1-582d19af6c34');

-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 1, CURRENT_DATE);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, marked_by_patient, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 1, 1, CURRENT_DATE);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, marked_by_patient, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 2, 1, CURRENT_DATE+1);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 2, CURRENT_DATE+1);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 5, 3, CURRENT_DATE+2);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 6, 3, CURRENT_DATE+2);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 7, 3, CURRENT_DATE+2);
-- INSERT INTO date_info(treatment_id, exercise_id, today_day, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 8, 4, CURRENT_DATE+3);

-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 1, 'Unable to do the exercises as mentioned.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 2, 'Unable to hold the desired position as mentioned for the desired time.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 3, 'Balance problem while performing  exercise 1-4.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 4, 'Difficulty in progressing further to increased holding time while doing exercise.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, 5, 'Pain and/or stiffness in the knees.', NULL, 0);


-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 1, 'Unable to do the exercises as mentioned.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 2, 'Unable to hold the desired position as mentioned for the desired time.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 3, 'Balance problem while performing  exercise 1-4.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 4, 'Difficulty in progressing further to increased holding time while doing exercise.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 2, 5, 'Pain and/or stiffness in the knees.', NULL, 0);

-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 1, 'Unable to do the exercises as mentioned.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 2, 'Unable to hold the desired position as mentioned for the desired time.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 3, 'Balance problem while performing  exercise 1-4.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 4, 'Difficulty in progressing further to increased holding time while doing exercise.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 3, 5, 'Pain and/or stiffness in the knees.', NULL, 0);

-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 1, 'Unable to do the exercises as mentioned.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 2, 'Unable to hold the desired position as mentioned for the desired time.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 3, 'Balance problem while performing  exercise 1-4.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 4, 'Difficulty in progressing further to increased holding time while doing exercise.', NULL, 0);
-- INSERT INTO questionnaire(treatment_id, day_no, question_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 4, 5, 'Pain and/or stiffness in the knees.', NULL, 0);

INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(25, 'ankle toe movement', 'N/A', 10, 'https://www.youtube.com/watch?v=sOnjAIrjt8s');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'isometric quads ', 'N/A', 4, 'https://www.youtube.com/watch?v=_gDqujlCREg');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'straight leg raise (supine)', 'N/A', 5, 'https://www.youtube.com/watch?v=m1oMMTzQVrQ');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'straight leg raise (side-lying)', 'N/A', 10, 'https://www.youtube.com/watch?v=zoGOmA10GtQ');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'TA stretching', 'N/A', 10, 'https://www.youtube.com/watch?v=qcU2q07wxNU');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'knee bending', 'N/A', 10, 'https://www.youtube.com/watch?v=J07D4GvHfJg');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(3, 'weight bearing with walker', '50 meters approx', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(5, 'Ice pack application', '15-20 minutes after each exercise', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Heel slide', 'N/A', 10, 'https://www.youtube.com/watch?v=FKMEDYI9KdU');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'sit to stand', 'Set 1 : 8-10 am, Set 2: 4-6 pm', 10, 'https://www.youtube.com/watch?v=cbEFlGWZr6I');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(3, 'Brisk walk ', '10-15 minutes walk', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(5, 'Brisk walk ', '10-15 minutes walk', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Standing hip flexion (knee extended)', '2 seconds hold (Add 1 second every alternate day)', 2, 'https://www.youtube.com/watch?v=OTC7tBbzIfo');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Standing hip flexion (knee 90 degrees flexed)', '2 seconds hold (Add 1 second every alternate day)', 2, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Standing hip extension', '2 seconds hold (Add 1 second every alternate day)', 10, 'https://www.youtube.com/watch?v=LNkKryPRbUw');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Standing hip abduction', '2 seconds hold (Add 1 second every alternate day)', 10, 'https://www.youtube.com/watch?v=4X2MyktnPB0');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(40, 'Sit to stand goal break in ', '10 reps set with 3 minutes in between', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Straight leg raise in prone position', '5 seconds each (Add 1 second every alternate day)', 5, null);

INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(1, 'Heel raises', 'N/A', 1, 'https://www.youtube.com/watch?v=xH_crmFJktA');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(1, 'Resistive Strengthening exercises', 'N/A', 1, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Progression from walker to stick', 'N/A', 1, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(1, 'Stair Climbing with stick', 'N/A', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Climb up and down steps', '10 times with each foot', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(60, 'Sit to stand goal', 'N/A', 10, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(4, 'Brisk walk with stick', 'Brisk walk for 20-30 minutes', 1200, null);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration) VALUES(1, 'No exercises today', 'N/A', 10);
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Hamstring Stretching', 'N/A', 10, 'https://www.youtube.com/watch?v=EN_tV1yfItM');
INSERT INTO exercises(exercise_rep, exercise_name, instructions, duration, exercise_video_url) VALUES(10, 'Adductor muscles stretching', 'N/A', 10, 'https://www.youtube.com/watch?v=TtZx6H8pQZU');

SELECT * FROM treatment;
-- SELECT * FROM patient;
