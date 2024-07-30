// Load packages
const express = require('express'); // Import express to create the server
const mysql = require('mysql'); // Import mysql to connect to the database
const bodyParser = require('body-parser'); // Import body-parser to parse request bodies
const cors = require('cors'); // Import cors to allow cross-origin requests
const multer = require('multer'); // Import multer to upload files
const bcrypt = require('bcrypt'); // Import bcrypt to hash passwords
const cookieParser = require('cookie-parser'); // Import cookie-parser to parse cookies

// Server Configuration
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(cookieParser());

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const userCookie = req.cookies && req.cookies.user;
  console.log('User cookie:', userCookie);

  if (userCookie) {
    // User is authenticated
    req.user = JSON.parse(userCookie);
    next();
  } else {
    // User is not authenticated
    res.status(401).json({ error: 'Unauthorized' });
  }
};


  // Example of using the middleware for a protected route
  app.get('/protected-route', authenticateUser, (req, res) => {
  // Access the authenticated user using req.user
  res.json({ message: 'This is a protected route', user: req.user });
});



// Multer Configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);        
  }
})

var upload = multer({ storage: storage })



// Database Connection
const connection = mysql.createConnection({
    host: "mysql1",
    user: "root",
    password: "admin",
    dbName: "db", // specify the default database
    postTableName: "posts", // specify the default post table
    channelTableName: "channels", // specify the default channel table
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
});

// Initialization Endpoint
app.post('/init', (req, res) => {
  const { dbName, postTableName, channelTableName } = req.body;

  // Create Database
  connection.query(`CREATE DATABASE IF NOT EXISTS db`, function (error, result) {
    if (error) console.log(error);
  });

  // Switch to the created database
  connection.query(`USE db`, function (error, results) {
    if (error) console.log(error);
  });

  // Create Channels Table
  connection.query(
    `CREATE TABLE IF NOT EXISTS channels 
    ( id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
    channel_name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (id))`,
    function (error, result) {
      if (error) console.log(error);
    }
  );

  // Create Posts Table 
  connection.query(
    `CREATE TABLE IF NOT EXISTS posts 
    ( id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      channel_id INT UNSIGNED NOT NULL,
      parent_id INT UNSIGNED,
      data TEXT NOT NULL,
      image VARCHAR(255),
      PRIMARY KEY (id))`, 
    function (error, result) {
      if (error) console.log(error);

      res.send('Database and Tables created!');
    }
  );

  // Create users table
  connection.query(
    `CREATE TABLE IF NOT EXISTS users 
    ( id INT UNSIGNED NOT NULL AUTO_INCREMENT, 
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      PRIMARY KEY (id))`, 
    function (error, result) {
      if (error) console.log(error);

    }
  );

});


/////////////////////////////////////////////
// Endpoints for                           //
//  - add channel                          //
//  - get channels                         //
//  - add post                             //
//  - get posts                            //
/////////////////////////////////////////////

// Add Channel - Protected Route
app.post('/addchannel', authenticateUser, (req, res) => {
  const channelName = req.body.channelName;
  const query = `INSERT INTO channels (channel_name) VALUES ("${channelName}")`;
  connection.query(query, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error inserting new channel');
      return;
    }
    res.send('New channel inserted');
  });
});


// Get All Channels
app.get('/getchannels', (req, res) => {
    const sqlQuery = 'SELECT * FROM channels';
    connection.query(sqlQuery, function (error, result) {
        if (error) console.log(error);
        res.json({ 'channels': result });
    });
});

// Add Post - Protected Route
app.post('/addpost', authenticateUser, upload.single('image'), (req, res) => {
  const channelID = req.body.channelID;
  let parentID = req.body.parentID === 'null' ? null : parseInt(req.body.parentID, 10);

  // Check if parentID is NaN and set it to null
  if (isNaN(parentID)) {
    parentID = null;
  }

  const data = req.body.data;
  const image = req.file ? req.file.path : null;
  console.log('Image Path:', image);
  const query = `INSERT INTO posts (channel_id, parent_id, data, image) VALUES (?, ?, ?, ?)`;
  connection.query(query, [channelID, parentID, data, image], function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error inserting new post');
      return;
    }
    res.send('New post inserted');
  });
});

// Get Posts for a Specific Channel
app.get('/getposts/:channelID', (req, res) => {
  const channelID = req.params.channelID;
  const sqlQuery = `SELECT * FROM posts WHERE channel_id = ${channelID}`;
  connection.query(sqlQuery, function (error, result) {
      if (error) console.log(error);
      res.json({ 'posts': result });
  });
});


/////////////////////////////////////////////
// Endpoints for                           //
// User registration                       //
// User login                              //
/////////////////////////////////////////////

/////////////////////////////////////////////
// Registration Endpoint                   //
/////////////////////////////////////////////
app.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  // Hash the password securely before storing it in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, name) VALUES (?, ?, ?)';
  connection.query(query, [username, hashedPassword, name], (error, results) => {
    if (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

/////////////////////////////////////////////
// User Login Endpoint                     //
/////////////////////////////////////////////
app.post('/login', async (req, res) => {
  console.log('Received login request:', req.body);
  const { username, password } = req.body;

  // Validate the username and password
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Retrieve user from the database
    const query = 'SELECT password FROM users WHERE username = ?';
    connection.query(query, [username], async function (error, results, fields) {
      if (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Check if a user with the given username exists
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Now you can access the password from the results
      const storedPassword = results[0].password;
  
      console.log('Password:', password);
      console.log('Stored password:', storedPassword);
  
      // Use await to resolve the promise
      const isPasswordValid = await bcrypt.compare(password, storedPassword);
      console.log('Password valid:', isPasswordValid);
  
      if (isPasswordValid) {
        // Password is valid, use cookies to store the user data
        const user = { username, password };
        res.cookie('user', JSON.stringify(user), { httpOnly: true });
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Password is invalid
        return res.status(401).json({ error: 'Invalid password' });
      }
    });
  } catch (error) {
    console.error('Error in try-catch block:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});





/////////////////////////////////////////////
// debug endpoints for                     //
//  - delete tables                        //
//  - get all channels                     //
//  - get all posts                        //
//  - get all users                        //
/////////////////////////////////////////////

// Truncate Tables Endpoint
app.post('/delete', (req, res) => {
  // Ensure the correct database is selected
  connection.query('USE db', function (useError, useResult) {
    if (useError) {
      console.log(useError);
      res.status(500).send('Error selecting the database');
      return;
    }

    // Truncate Channels Table
    connection.query('TRUNCATE TABLE channels', function (error2, result2) {
      if (error2) {
        console.log(error2);
        res.status(500).send('Error truncating channels table');
        return;
      }
      console.log('Channels table truncated successfully');

      // Truncate Posts Table
      connection.query('TRUNCATE TABLE posts', function (error3, result3) {
        if (error3) {
          console.log(error3);
          res.status(500).send('Error truncating posts table');
          return;
        }
        console.log('Posts table truncated successfully');

        // Truncate Users Table
        connection.query('TRUNCATE TABLE users', function (error4, result4) {
          if (error4) {
            console.log(error4);
            res.status(500).send('Error truncating users table');
            return;
          }
          console.log('Users table truncated successfully');

          // Send the response after all operations are complete
          res.send('Tables truncated successfully');
        });
      });
    });
  });
});

// Endpoint to Get All Channels
app.get('/getallchannels', (req, res) => {
  const sqlQuery = 'SELECT * FROM channels';
  connection.query(sqlQuery, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching channels');
      return;
    }
    res.json({ 'channels': result });
  });
});

// Endpoint to Get All Posts
app.get('/getallposts', (req, res) => {
  const sqlQuery = 'SELECT * FROM posts';
  connection.query(sqlQuery, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json({ 'posts': result });
  });
});

// Endpoint to Get All Users
app.get('/getallusers', (req, res) => {
  const sqlQuery = 'SELECT * FROM users';
  connection.query(sqlQuery, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json({ 'users': result });
  });
});




/////////////////////////////////////////////
// Admin endpoints for                     //
//  - check if is admin                    //
//  - remove user                          //
//  - remove channel                       //
//  - remove post                          //
/////////////////////////////////////////////

// Admin Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user && user.username === 'admin') {
    // User is an admin
    next();
  } else {
    // User is not an admin
    res.status(403).json({ error: 'Forbidden: Access denied. Admin privileges required.' });
  }
};

// Endpoint to Remove a User - Protected Route
app.post('/removeuser', authenticateUser, isAdmin, (req, res) => {
  const userID = req.body.userID;
  const query = `DELETE FROM users WHERE id = ${userID}`;
  connection.query(query, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error removing user');
      return;
    }
    res.send('User removed');
  });
});

// Endpoint to Remove a Channel - Protected Route
app.post('/removechannel', authenticateUser, isAdmin, (req, res) => {
  const channelID = req.body.channelID; // Assuming you receive the channel ID from the request body

  // TODO: Implement logic to remove the channel from the database
  const query = `DELETE FROM channels WHERE id = ${channelID}`;
  
  connection.query(query, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error removing channel');
      return;
    }
    res.send('Channel removed');
  });
});

// Endpoint to Remove a Post - Protected Route
app.post('/removepost', authenticateUser, isAdmin, (req, res) => {
  const postID = req.body.postID; // Assuming you receive the post ID from the request body

  // TODO: Implement logic to remove the post from the database
  const query = `DELETE FROM posts WHERE id = ${postID}`;
  
  connection.query(query, function (error, result) {
    if (error) {
      console.log(error);
      res.status(500).send('Error removing post');
      return;
    }
    res.send('Post removed');
  });
});




app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
