const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');

const VerifiedUsersUtil = {
    async addNumber(mobile_number,added_by){
      const createQueryUser = `INSERT INTO verified_users(id,added_by, mobile_number,created_date, modified_date) VALUES($1, $2, $3, $4, $5) returning *`;
      const values = [
        uuid(),
        added_by,
        mobile_number,
        moment(new Date()),
        moment(new Date())
      ];
      try {
        const { rows } = await db.query(createQueryUser, values);
        return rows;
      } catch(error) {
        return null;
      }
    },

    async checkNumber(mobile_number){
        const checkQueryUser = `SELECT * FROM verified_users WHERE mobile_number = ($1)`;
        const values = [
            mobile_number
        ];
        try {
          const { rows } = await db.query(checkQueryUser, values);
          if (rows.length == 0){
              return null
          }
          return rows;
        } catch(error) {
          return null;
        }
      },
}

  
const VerifiedUsers = {
  async addToVerified(req, res) {
    console.log(req.body)
    const secret = req.body.secret;
    if(secret != process.env.VERIFIED_USER_SECRET){
        return res.status(400).send({ "message" : "Secret Invalid" })
    }

    const mobile_number = req.body.mobile_number;

    try {
      const rows = await VerifiedUsersUtil.addNumber(mobile_number,"ADMIN")
      if( rows == null){
        return res.status(400).send({ "message" : "Addition Failed" });
      }
      return res.status(200).send({ "verified" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  async checkVerified(req, res) {
    console.log(req.body)
    const secret = req.body.secret;
    if(secret != process.env.VERIFIED_USER_SECRET){
        return res.status(400).send({ "message" : "Secret Invalid" })
    }

    const mobile_number = req.body.mobile_number;

    try {
      const rows = await VerifiedUsersUtil.checkNumber(mobile_number)
      if( rows == null){
        return res.status(400).send({ "message" : "Not Found" });
      }
      return res.status(200).send({ "verified" : rows[0] });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

}


module.exports = {
    VerifiedUsers,
    VerifiedUsersUtil
};