const cron = require('node-cron');
const models = require('../models')
const {
    Op
} = require('sequelize');
const deleteStudent = require('../persistence/usermapping').deleteStudent


function runCronJobs() {
    
    /* WARNING: Do not change this cron job unless you know what you're doing. 
    This cron deletes student that have been inactive for a year 
    because of our data protection policy */
    cron.schedule('0 0 * * *', async function() {
        let oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        oldStudents = await models.Student.findAll({
            where: {
                last_login: {
                    [Op.lt]: oneYearAgo
                }
            }
        });

        oldStudents.forEach(oldStudent => {
            console.log(`Student with email ${oldStudent.email} was deleted by cron job because the student was inactive for a year`);
            deleteStudent(oldStudent.email);
        });
    });
}

module.exports = { runCronJobs }