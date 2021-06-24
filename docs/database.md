# Database
We use a MariaDB database with Sequelize as ORM. All querying of the database is done through Sequelize, so see the [Sequelize](https://sequelize.org/master/index.html) docs for information on that. One thing to note is that Sequelize automatically pluralizes the names of models and that is how they will be represented in the database, but when querying the model you need to use the actual name of the model which is singular.

## Users
We don't use a single user table, but rather a different table for each type of user. Currently there are 4 types of users:
1. Student
2. Virksomhed (should be refactored)
3. Professor
4. Admin

Since we have 4 different tables the users are not unique by their ID, but rather by email. Use the function `findUserByEmail(email)`, to find unique users. Two different records with the same email should never exist.

## CV
**CV** is the model used when students create a CV. Each student can have only one CV that is connected to their user by a foreign key `student_id` and an education `fk_education`. All logic concerning CV's is mirrored for Professors, since they can also have CV's on our website, so we'll not describe that in these docs.

## InternshipPosts
**InternshipPost** is the model used for all types of posts that a company can create. A company can create as many posts as they like and each post is connected to the company by a foreign key `fk_company`.

## CVtype
**CVtype** is a model used to differentiate between what students are searching for in their **CV**, but it's also used for **InternshipPosts**, because a post provides what a CV is searching for. The relation between CV's and CVtypes is kept in a pivot table **CV_CVtype**. It has to be a pivot table because a CV can search for multiple different things. The relation between InternshipPosts and CVtypes is simply a foreign key `post_type` on the InternshipPost model, because an InternshipPost can search for only one thing. 

## Uddannelse (should be refactored)
**Uddannelse** is the model used for the name of each education at Zealand. Since Zealand uses different categories to segment their educations, each education is connected to an **EducationCategory** through a foreign key `fk_education_category`.


## FavouriteCV
**FavouriteCV** is a model used to keep track of companies who mark a CV as favourite. It has a foreign key `company_id` for the company and a foreign key `cv_id` for the CV.

## FavouritePost
**FavouritePost** is just like **FavouriteCV** except this model is used when students mark a company's post as favourite. It has a foreign key `student_id` for the student and a foreign key `post_id` for the post.

## Events
Events are only used when working the with the calendar which is currently independent from the other models. We use the framework FullCalendar to render the events (see the [FullCalendar docs](https://fullcalendar.io/docs)).