const express = require('express');
const moment = require('moment');
const mysql = require('mysql');
var bodyParser = require('body-parser')
var upload = multer({ dest: 'uploads/' })


const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


var cookieParser = require('cookie-parser');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

// load the cookie-parsing middleware
app.use(cookieParser());


app.use(allowCrossDomain);
  //some other code


const port = 8000;


const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'crmcdsoft',
  // host: process.env.MYSQL_HOST,
  // user: process.env.MYSQL_USER,
  // password: process.env.MYSQL_PWD,
  // database: process.env.MYSQL_DB,
});

pool.connect(err =>{
  if(err){
    console.log("err", err);
    return err
  }
})

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});


var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')




app.get('/api/users', (req, res) => {
  pool.query(`select * from ${table}`, (err, rows) => {
console.log('retour sql', err, rows );

    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get('/', (req, res) => {
  const table ='account';
  pool.query(`select  nom, prenom, email  from ${table}`, (err, rows) => {
console.log('retour sql 2', err, rows );

    if (err) {
      res.send(err);
    } else {
      return res.send(rows);
      // res.send(rows);
    }
  });
});

app.post('/api/add', (req, res) => {
  const table ='users';
  console.log('post', JSON.stringify(req.body.users[0].nom));
  pool.query(`insert into ${table} (nom, prenom, emil) values (${JSON.stringify(req.body.users[0].nom + '1')}, 'trtr', 'teret@fr.fr')`, (err, rows) => {
console.log('retour sql 2', err, typeof rows );

    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send(rows);
    }
  });
});




app.post('/Signup', (req, res) => {
  const table ='account';
  console.log('post', JSON.stringify(req.body));
  pool.query(`insert into ${table} 
              (Nom, email, MdP, rememberMe, idLevel, dateAccount, activeAccount) 
              values (${JSON.stringify(req.body.user)}, 
              ${JSON.stringify(req.body.email)}, 
              ${JSON.stringify(req.body.pwd)},
              ${JSON.stringify(req.body.rememberMe)},
              0,
              '${date.toString()}',
              0)`, (err, rows) => {
console.log('retour sql 2', err, typeof rows );

    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send(rows);
    }
  });
});


app.post('/update/user', (req, res) => {
// verifier valeur et nom actif

  const table ='account';
  console.log('post', JSON.stringify(req.body));
  pool.query(`Update ${table} 
              Set 
              Nom = ${JSON.stringify(req.body.user)}, 
              email = ${JSON.stringify(req.body.email)}, 
              MdP = ${JSON.stringify(req.body.pwd)},
              rememberMe = ${JSON.stringify(req.body.rememberMe)},
              idLevel = ${JSON.stringify(req.body.level)},
              activeAccount =  ${JSON.stringify(req.body.actif)}
              WHERE email = ${JSON.stringify(req.body.email)}`, 
              (err, rows) => {
console.log('retour sql 2', err, typeof rows );

    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send(rows);
    }
  });
});

app.post('/update/agent', (req, res) => {

  const table ='agents';
  console.log('post', JSON.stringify(req.body));
  pool.query(`insert into ${table} 
              (Nom, email, MdP, rememberMe, idLevel, dateAccount, activeAccount) 
              values (${JSON.stringify(req.body.user)}, 
              ${JSON.stringify(req.body.email)}, 
              ${JSON.stringify(req.body.pwd)},
              ${JSON.stringify(req.body.rememberMe)},
              0,
              '${date.toString()}',
              0)`, (err, rows) => {
console.log('retour sql 2', err, typeof rows );

    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send(rows);
    }
  });
});
