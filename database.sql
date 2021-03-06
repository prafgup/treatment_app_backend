-- Change AUTO_INCREMENT to IDENTITY while pushing to database, pgadmin doesnt accept AUTO_INCREMENT
DROP TABLE IF EXISTS date_info;
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
        doctor_id VARCHAR(256) NOT NULL,
        patient_id VARCHAR(256) NOT NULL,
        treatment_start_date DATE NOT NULL,
        treatment_end_date DATE,
        exercise_list VARCHAR(500) NOT NULL, -- I store all exercise ids as a string separated by # symbols. To get the list back, i'll use string splitting
        staff_1 VARCHAR(128) NOT NULL,
        staff_2 VARCHAR(128),
        FOREIGN KEY (doctor_id) REFERENCES doctor(user_id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    exercises(
        exercise_id int PRIMARY KEY AUTO_INCREMENT,
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
        marked_by_patient int DEFAULT 0,
        marked_by_relative int DEFAULT 0,
        PRIMARY KEY (treatment_id, today_date),
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