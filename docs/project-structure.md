## Project Structure
The entire app is located in the **/nodes** folder.

# Config
The folder **/nodes/config** contains a config file that tells the project to use environment variables to connect to the 
database. The environment variables should be specified in a dot-env file and located at **/nodes/.env**. The file  
**/nodes/.env-example** specifies what environment variables are needed.

# Node Server
We use the node framework **Express** to handle the backend. All routes can be found in the folder **/nodes/routes**.

# Views
We use the framework **Handlebars** to handle the frontend views. It's a minimalistic templating language that lets you 
inject variables into HTML code. For more information see the [Handlebars documentation](https://handlebarsjs.com/).
All views can be found in the folder **/nodes/views**.

# Models
The folder **/nodes/models** contains all the models that Sequelize uses.

# Migrations
The folder **/nodes/migrations** is another Sequelize folder that is used to create the database tables.

# Seeders
The folder **/nodes/seeders** is another Sequelize folder that is used to populate the database.

# Persistence
The folder **/nodes/persistence** contains a number of helper functions that are used to query the database. In most cases 
where we query the database, we do it with the standard Sequelize queries, but sometimes we have a need for extra 
functionality and thus we created these helper functions.

# Constants
As the name implies, the folder **/nodes/constants** holds constant values that are referenced throughout the project 
e.g. regexes. Note that only the backend has access to this folder, so all frontend constants are stored in the public 
folder.

# Middlewares
The folder **/nodes/middlewares** contains custom middlewares. Currently we have only one which is used to control access to all the different routes in the app. Here's an 
example of usage for authorizing an admin to a route:  
`router.post('/createUddannelse', authorizeUser('admin'), (req, res, next) => {...}`  

Other users will be redirected to the login page if they try to access it.

# Validation
The folder **/nodes/validation** contains functions for input validation in the backend.

# Utils
The folder **/nodes/utils** contains helper functions that do not fit into the other folders such as cron jobs and file handling.

# Test
The folder **/nodes/test** contains a few tests that were developed in the beginning of the project. Currently we don't 
use automatic testing.