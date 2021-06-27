# Admin
To login as administrator go to /admin-funktioner/login. Admin users can CRUD content in the database, so admin users 
should be given only to trusted coworkers and in few numbers. Admins cannot create their own posts or CV's, but only 
modify those of the other users. If an admin user wants this functionality, they should create a personal user of another 
user type.

## Adminfunktioner
All administrator functions can be found in the route **admin-funktioner**. It's important to protect any new functions 
with the middleware `authorizeUser('admin')`.