const moment = require('moment');
const { uuid } = require('uuidv4');
const db = require('../db');
const Helper = require('./Helper');


const Exercises = {

  async addExercise(req, res){
    console.log(req.body)
    const exercise_name = req.exercise.name;
    const exercise_rep = req.exercise.rep;
    const exercise_instructions = req.exercise.instructions;
    const get_exercise = 'SELECT * FROM exercises WHERE LOWER(exercise_name) = $1 AND exercise_rep = $2';
    const create_exercise = 'INSERT INTO exercises(exercise_name, exercise_rep, instructions) VALUES($1,$2,$3)';
    try{
        const {rows} =  await db.query(get_exercise,[exercise_name,exercise_rep]);
        if(!rows[0]){
            const new_exercise = await db.query(create_exercise, [exercise_name, exercise_rep, exercise_instructions]);
        }
    }catch(error){
        return res.status(400).send(error);
    }
  },

}


module.exports = Exercises;