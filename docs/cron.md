# Cron Jobs
We use the package **node-cron** to handle cron jobs because we want to keep our cron jobs in the code base. Any modification 
of cron jobs as well as newly created cron jobs require thourough testing as they can potentially delete the whole database, 
so handle these with care. Cron jobs can be found in **/nodes/utils/cronjob.js**.

## Deleting old users
Our **data policy** states that we store the users' personal information for up to one year or as long as they remain 
active on our site. Therefore, in order to comply with our data policy, we have a cron job for deleting users that have 
not logged in for one year.

## Email notification for students after 11 months of inactivity
As a service to our students, we have a cron job to notify them after 11 months of inactivity, that their account is going 
to be deleted after the 12th month of inactivity. The **Students** table has a column `email_notification_date` that keeps 
track of when they last received a notification. The cron job checks if they received a notification less than one year 
ago and only sends another notification, if there is no record or if the notification is more than one year old.
`email-notification-date` is reset every time the student logs in, so this column should not be mixed with other functionality 
as it will break the cron job and spam students with emails.

## Email notification for companies after 6 months of inactivity
Similar to the above a cron job notifies inactive companies that their posts will become hidden on our website after 6 
months of inactivity, unless they log back in.

## Other cron jobs
In addition we use a cron job on the server to back up the database, but this is not in the codebase.