const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');


const Profile = {

  async getMyProfile(req, res) {
    console.log(req.body)
    const myId = req.user.id;
    const myProfile = 'SELECT * FROM profile_page where user_id = $1';
    try {
      const { rows } = await db.query(myProfile, [myId]);
      return res.status(200).send({ "profile" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async updateMyProfile(req, res) {
    console.log(req.body)
    const myId = req.user.id;

    const getMyProfile = 'SELECT * FROM profile_page where user_id = $1';
    const createProfile = `INSERT INTO profile_page(user_id, first_name,last_name, dob,profile_pic, home_address,email_id,created_date,modified_date, mobile_number) VALUES($1, $2, $3, $4,$5, $6, $7, $8, $9, $10) returning *`;
    const updateProfile = `UPDATE profile_page SET first_name = ($1), last_name = ($2), dob = ($3), profile_pic = ($4), home_address = ($5), email_id = ($6), modified_date = ($7) WHERE user_id = ($8) returning *`;
    try {
      const { rows } = await db.query(getMyProfile, [myId]);


      var myProfileUpdated = null;

      if(!rows[0]){
        const qq1 = 'SELECT * FROM users WHERE user_id = ($1)';
        const t1 = await db.query(qq1, [myId]);
        const createValues = [
            myId,
            req.body.first_name,
            req.body.last_name,
            req.body.dob == "" ? null : req.body.dob,
            req.body.profile_pic,
            req.body.home_address,
            req.body.email_id,
            moment(new Date()),
            moment(new Date()),
            t1.rows[0].mobile_number
          ];

        const newProfile = await db.query(createProfile, createValues);
        myProfileUpdated = newProfile.rows[0]
      }else{
        const updateValues = [
            req.body.first_name,
            req.body.last_name,
            req.body.dob == "" ? null : req.body.dob,
            req.body.profile_pic,
            req.body.home_address,
            req.body.email_id,
            moment(new Date()),
            myId
          ];

          const updatedProfile = await db.query(updateProfile, updateValues);
          myProfileUpdated = updatedProfile.rows[0]
      }

      if(!myProfileUpdated){
        return res.status(400).send({'message': 'can not update profile'});
      }

      return res.status(200).send({ myProfileUpdated });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

}


module.exports = Profile;
