DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS doctor;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS profile_page;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS
    users(
        user_id UUID PRIMARY KEY,
        mobile_number VARCHAR(10) NOT NULL UNIQUE,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    doctor(
        user_id UUID PRIMARY KEY,
        department VARCHAR(128) NOT NULL,
        designation VARCHAR(128) NOT NULL,
        hospital VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS
    patient(
        user_id UUID PRIMARY KEY,
        relative_1 VARCHAR(128),
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS
    profile_page(
        user_id UUID PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128),
        dob DATE NOT NULL,
        home_address VARCHAR(128) NOT NULL,
        email_id VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS
    staff(
        user_id UUID PRIMARY KEY,
        department VARCHAR(128) NOT NULL,
        designation VARCHAR(128) NOT NULL,
        hospital VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Dummy data

--1 is a doctor, 2 is a patient, 3 is a staff member
INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130001',6234567890,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO doctor(user_id, department, designation, hospital, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130001','Ortho', 'Surgeon', 'A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130002',9871029370,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO staff(user_id, department, designation, hospital, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130002','Ortho', 'anaesthesia', 'B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO users(user_id, mobile_number, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130003',8734928347,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO patient(user_id, relative_1, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130003','relative 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO profile_page(user_id, first_name, last_name, dob, home_address, email_id, created_date, modified_date) VALUES('21352c82-7462-11eb-9439-0242ac130003','F', 'L', '1-10-2010','Ghar ka address', 'fl@asdfkj.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);