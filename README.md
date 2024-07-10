# NodeSQLConnection

NodeSQLConnection is a simple user management application built with Node.js and MySQL. It allows you to create, read, update, and delete (CRUD) user records in a MySQL database.

## Features

- Create new users
- View all users
- Edit user details
- Delete users 

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/NodeSQLConnection.git
    cd NodeSQLConnection
    ```

2. Install the necessary npm packages:
    ```bash
    npm install
    ```

## Required Packages

The following packages are required for this project:

- express
- ejs
- method-override
- uuid
- mysql2
- @faker-js/faker

Install them by running:
```bash
npm install express ejs method-override uuid mysql2 @faker-js/faker
```

## MySQL Setup
1. Ensure MySQL server is running.
2. Create a new database named delta_app.
3. Create a table named user with the following structure:
```bash
    CREATE TABLE user (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```
4. Update the database connection settings in index.js:
```bash
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'your_mysql_password',
        database: 'your_database_name',
    });
```
# Usage
## Home Page
Displays the total number of users and a button to create a new user or to show the users list.

## Create New User
Navigate to /user/new to fill out the form to create a new user.

## View Users
Navigate to /user to see a list of all users with options to edit or delete each user.

## Edit User
Navigate to /user/:id/edit to edit the username of a user. You need to provide the password for authentication.

## Delete User
To delete a user, click the delete button next to the user in the list.

## License
This project is licensed under the MIT License.
