-- Change AUTO_INCREMENT to IDENTITY while pushing to database, pgadmin doesnt accept AUTO_INCREMENT
DROP TABLE IF EXISTS date_info;
DROP TABLE IF EXISTS questionnaire;
DROP TABLE IF EXISTS daily_exercise_data; 
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS treatment;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS doctor;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS profile_page;
DROP TABLE IF EXISTS users;

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
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    profile_page(
        user_id VARCHAR(256) PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128),
        dob DATE NOT NULL,
        profile_pic VARCHAR(1024),
        home_address VARCHAR(128) NOT NULL,
        email_id VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
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
        patient_id VARCHAR(256) NOT NULL,
        treatment_start_date DATE NOT NULL,
        treatment_end_date DATE,
        treatment_day int DEFAULT 0,
        staff_1 VARCHAR(256) NOT NULL,
        staff_2 VARCHAR(256),
        FOREIGN KEY (doctor_id) REFERENCES doctor(user_id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    exercises(
        exercise_id int PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        exercise_rep int NOT NULL,
        exercise_name VARCHAR(128) NOT NULL,
        instructions VARCHAR(500) NOT NULL,
        exercise_video_url VARCHAR(128),
        exercise_img_url VARCHAR(128)
    );

CREATE TABLE IF NOT EXISTS
    date_info(
        treatment_id VARCHAR(256) NOT NULL,
        today_date DATE NOT NULL,
        exercise_id int NOT NULL,
        marked_by_patient int DEFAULT 0,
        marked_by_relative int DEFAULT 0,
        PRIMARY KEY (treatment_id, today_date, exercise_id),
        FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    questionnaire(
        treatment_id VARCHAR(256) NOT NULL,
        week_no int DEFAULT 0,
        question VARCHAR(256) NOT NULL,
        response int,
        threshold int DEFAULT 0,
        PRIMARY KEY (treatment_id, week_no, question),
        FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    daily_exercise_data(
        treatment_id VARCHAR(256) NOT NULL,
        exercise_id int NOT NULL,
        FOREIGN KEY (treatment_id) REFERENCES treatment(treatment_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE,
        PRIMARY KEY (treatment_id, exercise_id)
    );

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af6c34',1234567890,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES('2b6941fa-525e-45e9-88f1-582d19af6c34','Ortho', 'Surgeon', 'A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('ed7e013d-4401-4543-9ca8-ecfe95bb020a',9871029370,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES('ed7e013d-4401-4543-9ca8-ecfe95bb020a','Ortho', 'anaesthesia', 'B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8',8734928347,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8','relative 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date) VALUES('37f8111a-f7ce-441f-946c-c9de32dfdce8','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- add question details here, as they wont be changed later

INSERT INTO exercises(exercise_rep, exercise_name, instructions) VALUES(10, 'push up', 'just use your hands');

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('2466d759-d15d-4882-8d2b-20f7139fa26a',1234567899, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES('2466d759-d15d-4882-8d2b-20f7139fa26a','Ortho', 'Surgeon', 'B',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO treatment(treatment_id, treatment_name, doctor_id, patient_id, treatment_start_date, treatment_end_date, staff_1) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 'knee surgery', '2b6941fa-525e-45e9-88f1-582d19af6c34', '37f8111a-f7ce-441f-946c-c9de32dfdce8', CURRENT_DATE, CURRENT_DATE + 30, '2b6941fa-525e-45e9-88f1-582d19af6c34');
INSERT INTO daily_exercise_data(treatment_id, exercise_id) VALUES('446dead8-0161-47f1-a902-d03efbee4072',1);
INSERT INTO questionnaire(treatment_id, week_no, question, response, threshold) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 0, 'does it hurt?', NULL, 0);
INSERT INTO date_info(treatment_id, exercise_id, today_date) VALUES('446dead8-0161-47f1-a902-d03efbee4072', 1, CURRENT_DATE);