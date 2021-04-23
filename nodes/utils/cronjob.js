const cron = require('node-cron');
const models = require('../models')
const {
    Op
} = require('sequelize');
const deleteStudent = require('../persistence/usermapping').deleteStudent
const mailer = require('./mail-sender');


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

    /* Send emails to users who have not logged in for 11 months telling them that their account will be deleted in a
     month */
    cron.schedule('0 0 * * *', async function(){
        let elevenMonthsAgo = new Date();
        elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);

        let mailInfos = [];
        let students = await models.Student.findAll({
            where: {
                last_login: {
                    [Op.lt]: elevenMonthsAgo
                },
            },
            include: [{
                model: models.CV,
                attributes: ['sprog'],
                as: 'cv'
            }]
        })

        students.forEach(student => {
            if (student.email_notification_date) {
                let oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (student.email_notification_date > oneYearAgo) {
                    return;
                }
            }
            

            let dansk = false;
            let subject = "Your account on Zealand Connect will be deleted soon";
            let dateForDeletion = new Date();
            dateForDeletion.setMonth(dateForDeletion.getMonth() + 1);
            let formattedDate = dateForDeletion.getDate() + "-" + Number(dateForDeletion.getMonth() + 1) + "-" + dateForDeletion.getFullYear() ;

            if (student.cv){
                if (student.cv.sprog.toLowerCase().includes('dansk')){
                    dansk = true;
                    subject = "Din konto på Zealand Connect bliver snart slettet"
                }
            }

            let mailInfo = {
                student: student,
                recipient: student.email,
                subject: subject,
                context: {
                    dansk: dansk,
                    fornavn: student.fornavn,
                    efternavn: student.efternavn,
                    date: formattedDate
                }
            }
            mailInfos.push(mailInfo);
        });

        mailInfos.forEach(async mailInfo => {
            try {
                mailer.sendMail('delete-account-notification', mailInfo);
                mailInfo.student.email_notification_date = new Date();
                mailInfo.student.save();
            } catch (error) {
                console.log(`Mail to student ${mailInfo.student.id} failed`);
            }
        });
    })
}

module.exports = { runCronJobs }