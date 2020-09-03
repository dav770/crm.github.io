const express = require('express');
const moment = require('moment-timezone');
const mysql = require('mysql2');
var bodyParser = require('body-parser');
var multer = require('multer');

var fs = require('fs');

var async  = require('express-async-await')
var fetch = require('node-fetch')

var upload = multer({ dest: 'public/asset/img/' });


// var tz = moment.tz.guess()
// var tz = moment.tz.setDefault("America/New_York");

// fs.writeFile('d:/timezone.txt', moment.tz.names(), function(err) {
//   // If an error occurred, show it and return
//   if(err) return console.error(err);
//   // Successfully wrote to the file!
// });



const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  }),
);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

var cookieParser = require('cookie-parser');

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

// load the cookie-parsing middleware
app.use(cookieParser());

app.use(allowCrossDomain);
//some other code

const port = 8000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'crmcdsoft',
  // host: process.env.MYSQL_HOST,
  // user: process.env.MYSQL_USER,
  // password: process.env.MYSQL_PWD,
  // database: process.env.MYSQL_DB,
});

// connection.connect(err => {
//   if (err) {
//     console.log('err', err);
//     return err;
//   }
// });

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});

var date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

// console.log('time zone', tz, moment.tz.guess(true), date);


console.log('date', date.toString(), date);
app.get('/mapClient/:adr', async function(req, res, next) {
  
  console.log('google map0 ', req.params.adr.split(',').join(' '), req.body)
  return fetch(`https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${req.params.adr.split(',').join(' ')}`, {
        "method": "GET",
        "headers": {
            "Access-Control-Allow-Origin": "*",
        "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
        "x-rapidapi-key": '11101c7c1fmsha62efecdc4c7c6ep143b3ajsn8c50c780a493' //process.env.RAPIDAPI_KEY
        }
    })
    .then(response => {
      // console.log('1 ;',response)
      return response.json()})
    .then(response => {
      return response
        // console.log('2 ;',response)
        // console.log('3 ;',response.lat)
        // console.log('4 ;',response.long)
    })
    .catch(err => console.log(err))

});


app.get('/users/:email', (req, res) => {
  const table = 'account';
  connection.query(
    `SELECT * FROM ${table} WHERE email = '${req.params.email}'`,
    (err, rows) => {
      // console.log('retour sql', err, rows);

      if (err) {
        res.send(err);
      } else {
        res.send(rows);
      }
    },
  );
});



app.get('/agent/:email', (req, res) => {
  const table = 'agents';
  connection.query(
    `SELECT * FROM ${table} WHERE email = '${req.params.email}'`,
    (err, rows) => {
      // console.log('retour sql', err, rows);

      if (err) {
        res.send(err);
      } else {
        res.send(rows);
      }
    },
  );
});

app.get('/all/:email', (req, res) => {

  // console.log('retoursql', req.params);
  // connection.query(`SELECT * FROM account WHERE email = 'toto@gmail.com'`, (err, rows) => {
  connection.query(
    `SELECT * FROM account WHERE email = '${req.params.email}'`,
    (err, rows) => {
      if (typeof rows === 'undefined' || rows.length === 0) {
        connection.query(
          `SELECT * FROM agents WHERE email = '${req.params.email}'`,
          (err, rows) => {
            

            if (err) {
              // console.log('retour 2 sql', err, rows);
              return res.send(err);
            } else {
              // console.log('retour 2 sql +', err, rows);
              return res.send(rows);
            }

          },
        );
      }else{
        // console.log('retour sql', err, rows);

        if (err) {
          return res.send(err);
        } else {
          return res.send(rows);
        }
      }

     
    },
  );
});

app.get('/', (req, res) => {
  const table = 'account';
  connection.query(`select  nom, prenom, email  from ${table}`, (err, rows) => {
    // console.log('retour sql 2', err, rows);

    if (err) {
      res.send(err);
    } else {
      res.send(rows);
      // res.send(rows);
    }
  });
});


app.get('/agents', (req, res) => {
  const table = 'agents';
  connection.query(`select  *  from ${table}`, (err, rows) => {
    // console.log('retour sql 2', err, rows);

    if (err) {
      res.send(err);
    } else {
      res.send(rows);
      // res.send(rows);
    }
  });
});

// app.get('/clients', (req, res) => {
//   const table = 'client';
//   connection.query(`select  *  from ${table} where idClient =3 or idClient = 7`, (err, rows) => {
//     console.log('retour sql get clients', err, rows);

//     if (err) {
//       res.send(err);
//     } else {
//       res.send(rows);
//       // res.send(rows);
//     }
//   });
// });


app.get('/delete/agent', (req, res) => {
  const table = 'agents';
  // console.log('retour sql delete agent', req.params, req.query);

  connection.query(`DELETE FROM ${table} WHERE idAgents = ${req.query.id} AND email = '${req.query.email}'`, (err, rows) => {
    // console.log('retour sql delete agent', err, rows);

    if (err) {
      res.send(err);
    } else {
      res.send(rows);
      // res.send(rows);
    }
  });
});


app.get('/delete/commercial', (req, res) => {
  const table = 'commercial';
  // console.log('retour sql delete commercial', req.params, req.query);

  connection.query(`DELETE FROM ${table} WHERE idCommercial = ${req.query.id} AND tel1 = '${req.query.tel1}'`, (err, rows) => {
    // console.log('retour sql delete comm', err, rows);

    if (err) {
      res.send(err);
    } else {
      res.send(rows);
      // res.send(rows);
    }
  });
});




app.get('/delete/clients', (req, res) => {
  const table = 'client';
  // console.log('retour sql delete client', req.params, req.query);
  connection.query(
    `Update ${table} 
              Set 
              email = CONCAT(idClient,'_',IF(email IS NULL,'Null@Null.com',email)),
              suppClient = 1
              WHERE idClient = ${req.query.idClient}`,
    (err, rows) => {
      console.log('retour sql update/Delete client', err, typeof rows);

      if (err) {
        console.log('retour sql update/Delete client', err, typeof rows);
        res.send(err.sqlMessage);
      } else {
        console.log('retour sql update/Delete client', err, typeof rows);
        res.send(rows);
      }
    },
  );
});



app.post('/agents', (req, res) => {
  const table = 'agents';
  var querySql = ''
  var predicat = ''
var carAt = ''

if(req.body.length === 0){
querySql = `SELECT  *  FROM ${table}`
}else{
req.body.forEach(el=>{
  if(predicat === ''){predicat = ' WHERE '}
  if(predicat !== '' && predicat !== ' WHERE '){predicat += ' AND '}
  carAt = el.indexOf('=') + 1
  el = el.slice(0,carAt)+"'"+el.slice(carAt)+"'"
  predicat += el
})

  querySql = `SELECT  *  FROM ${table} ${predicat}`
}

console.log('query post agent',predicat);
  connection.query(`${querySql}`, 
    
    (err, rows) => {
      // console.log('retour agents', err, rows);
      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    })
});


app.post('/clients', (req, res) => {
  const table = 'client';
  var querySql = ''
  var predicat = ''
var carAt = ''

// console.log('retour clients', req.body);

if(req.body.length === 0){
querySql = `SELECT  c.* , a.nom AS nomAgent FROM ${table} c LEFT OUTER JOIN Agents a ON  c.idAgents = a.idAgents WHERE suppClient = 0 ORDER BY idClient`
}else{
req.body.forEach(el=>{
  if(predicat === ''){predicat = ' WHERE '}
  if(predicat !== '' && predicat !== ' WHERE '){predicat += ' AND '}
  carAt = el.indexOf('=') + 1
  el = el.slice(0,carAt)+"'"+el.slice(carAt)+"'"
  predicat += el
})

  querySql = `SELECT  c.* , a.nom AS nomAgent FROM ${table} c LEFT OUTER JOIN Agents a ON  c.idAgents = a.idAgents ${predicat} AND suppClient = 0 ORDER BY idClient`
}

console.log('query post clients',predicat);
  connection.query(`${querySql}`, 
    
    (err, rows) => {
    //  console.log('retour clients', err, rows);
      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    })
});

app.post('/commercial', (req, res) => {
  const table = 'commercial';
  var querySql = ''
  var predicat = ''
var carAt = ''

if(req.body.length === 0){
querySql = `SELECT  *  FROM ${table}`
}else{
req.body.forEach(el=>{
  if(predicat === ''){predicat = ' WHERE '}
  if(predicat !== '' && predicat !== ' WHERE '){predicat += ' AND '}
  carAt = el.indexOf('=') + 1
  el = el.slice(0,carAt)+"'"+el.slice(carAt)+"'"
  predicat += el
})

  querySql = `SELECT  *  FROM ${table} ${predicat}`
}

console.log('query post commercial',predicat);
  connection.query(`${querySql}`, 
    
    (err, rows) => {
      // console.log('retour commercial', err, rows);
      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    })
});



app.post('/Signup', (req, res) => {
  const table = 'account';
  // console.log('post', JSON.stringify(req.body));
  connection.query(
    `insert into ${table} 
              (Nom, email, MdP, rememberMe, idLevel, dateAccount, activeAccount) 
              values (${JSON.stringify(req.body.user)}, 
              ${JSON.stringify(req.body.email)}, 
              ${JSON.stringify(req.body.pwd)},
              ${JSON.stringify(req.body.rememberMe)},
              0,
              '${date.toString()}',
              0)`,
    (err, rows) => {
      // console.log('retour sql 2', err, typeof rows);
      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    },
  );
});

app.post('/update/user', (req, res) => {
  // verifier valeur et nom actif

  const table = req.body.table;
  // console.log('post', JSON.stringify(req.body), JSON.stringify(req.file));
 
  if(table === 'agents'){
    connection.query(
      `Update ${table} 
                Set 
                Nom = ${JSON.stringify(req.body.nom)}, 
                email = ${JSON.stringify(req.body.email)}, 
                MdP = ${JSON.stringify(req.body.pwd)},
                idLevel = ${JSON.stringify(req.body.level)},
                idCompagny = ${JSON.stringify(req.body.compagny)},
                activeAgents =  ${JSON.stringify(req.body.active)}
                WHERE email = ${JSON.stringify(req.body.email)}`,
      (err, rows) => {
        // console.log('retour sql update agent', err, typeof rows);
  
        if (err) {
          res.send(err.sqlMessage);
        } else {
          res.send(rows);
        }
      },
    );
  }
  
  if(table === 'account'){
    connection.query(
      `Update ${table} 
                Set 
                Nom = ${JSON.stringify(req.body.user)}, 
                email = ${JSON.stringify(req.body.email)}, 
                MdP = ${JSON.stringify(req.body.pwd)},
                rememberMe = ${JSON.stringify(req.body.rememberMe)},
                idLevel = ${JSON.stringify(req.body.level)},
                activeAccount =  ${JSON.stringify(req.body.actif)}
                avatar = ${JSON.stringify(req.file)}
                WHERE email = ${JSON.stringify(req.body.email)}`,
      (err, rows) => {
        // console.log('retour sql update account', err, typeof rows);
  
        if (err) {
          res.send(err.sqlMessage);
        } else {
          res.send(rows);
        }
      },
    );
  }
  
  if(table === 'commercial'){
    connection.query(
      `Update ${table} 
                Set 
                Nom = ${JSON.stringify(req.body.nom)}, 
                tel1 = ${JSON.stringify(req.body.tel1)}, 
                tel2 = ${JSON.stringify(req.body.tel2)}
                WHERE idCommercial = ${req.body.id}`,
      (err, rows) => {
        // console.log('retour sql update comm', err, typeof rows);
  
        if (err) {
          res.send(err.sqlMessage);
        } else {
          res.send(rows);
        }
      },
    );
  }
  
  if(table === 'client'){

    console.log("client update",req.body);
    
    connection.query(
      `Update ${table} 
                Set 
                Nom = ${JSON.stringify(req.body.nom)}, 
                prenom = ${JSON.stringify(req.body.prenom)}, 
                adresse = ${JSON.stringify(req.body.adresse)}, 
                tel1 = ${JSON.stringify(req.body.tel1)}, 
                tel2 = ${JSON.stringify(req.body.tel2)},
                idOrigine = ${req.body.idOrigine},
                ville = ${JSON.stringify(req.body.ville)},
                cp = ${JSON.stringify(req.body.cp)},
                idAgents = ${req.body.idAgents},
                status = ${JSON.stringify(req.body.status)},
                situationFamille = ${JSON.stringify(req.body.situationFamille)},
                nomNaissance = ${JSON.stringify(req.body.nomNaissance)},
                dateNaissance = ${JSON.stringify(req.body.dateNaissance)},
                villeNaissance = ${JSON.stringify(req.body.villeNaissance)},
                complementAdresse = ${JSON.stringify(req.body.complementAdresse)},
                departement = ${JSON.stringify(req.body.departement)},
                email = ${JSON.stringify(req.body.email)},
                dateValidation = ${JSON.stringify(req.body.dateValidation)},
                dateInstalle = ${JSON.stringify(req.body.dateInstalle)},
                typeLogement = ${JSON.stringify(req.body.typeLogement)},
                situationHabitat = ${JSON.stringify(req.body.situationHabitat)},
                dateModification = '${date.toString()}'
                WHERE idClient = ${req.body.idClient}`,
      (err, rows) => {
        console.log('retour sql update client', err, typeof rows);
  
        if (err) {
          console.log('retour sql update client', err, typeof rows);
          res.send(err.sqlMessage);
        } else {
          console.log('retour sql update client', err, typeof rows);
          res.send(rows);
        }
      },
    );
  }

});

app.post('/update/agent', (req, res) => {
  const table = 'agents';
  // console.log('post', JSON.stringify(req.body));
  connection.query(
    `insert into ${table} 
              (Nom, email, MdP, rememberMe, idLevel, dateAccount, activeAccount) 
              values (${JSON.stringify(req.body.user)}, 
              ${JSON.stringify(req.body.email)}, 
              ${JSON.stringify(req.body.pwd)},
              ${JSON.stringify(req.body.rememberMe)},
              0,
              '${date.toString()}',
              0)`,
    (err, rows) => {
      // console.log('retour sql 2', err, typeof rows);

      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    },
  );
});

app.post('/add/client', (req, res) => {
  const table = 'client';

var f = `(nom, 
  prenom , 
  adresse ,
  tel1, 
  tel2 ,
  idOrigine,
  ville,
  cp ,
  idAgents ,
  situationFamille ,
  nomNaissance ,
  dateNaissance,
  villeNaissance ,
  complementAdresse ,
  departement,
  email ,
  dateValidation ,
  dateInstalle,
  dateClient,
suppClient
  ) 
values (
  ${JSON.stringify(req.body.nom)}, 
  ${JSON.stringify(req.body.prenom)}, 
  ${JSON.stringify(req.body.adresse)}, 
  ${JSON.stringify(req.body.tel1)}, 
  ${JSON.stringify(req.body.tel2)},
  ${req.body.idOrigine},
  ${JSON.stringify(req.body.ville)},
  ${JSON.stringify(req.body.cp)},
  ${req.body.idAgents},
  ${JSON.stringify(req.body.situationFamille)},
  ${JSON.stringify(req.body.nomNaissance)},
  ${JSON.stringify(req.body.dateNaissance)},
  ${JSON.stringify(req.body.villeNaissance)},
  ${JSON.stringify(req.body.complementAdresse)},
  ${JSON.stringify(req.body.departement)},
  ${JSON.stringify(req.body.email)},
  ${JSON.stringify(req.body.dateValidation)},
  ${JSON.stringify(req.body.dateInstalle)},
  '${date.toString()}',
  ${req.body.suppClient}
)`

  console.log('add client', req.body, f);
  
  connection.query(
    `insert into ${table} 
              (nom, 
                prenom , 
                adresse ,
                tel1, 
                tel2 ,
                idOrigine,
                ville,
                cp ,
                idAgents ,
                situationFamille ,
                nomNaissance ,
                dateNaissance,
                villeNaissance ,
                complementAdresse ,
                departement,
                email ,
                dateValidation ,
                dateInstalle,
                dateClient,
suppClient
                ) 
              values (
                ${JSON.stringify(req.body.nom)}, 
                ${JSON.stringify(req.body.prenom)}, 
                ${JSON.stringify(req.body.adresse)}, 
                ${JSON.stringify(req.body.tel1)}, 
                ${JSON.stringify(req.body.tel2)},
                ${req.body.idOrigine},
                ${JSON.stringify(req.body.ville)},
                ${JSON.stringify(req.body.cp)},
                ${req.body.idAgents},
                ${JSON.stringify(req.body.situationFamille)},
                ${JSON.stringify(req.body.nomNaissance)},
                ${JSON.stringify(req.body.dateNaissance)},
                ${JSON.stringify(req.body.villeNaissance)},
                ${JSON.stringify(req.body.complementAdresse)},
                ${JSON.stringify(req.body.departement)},
                ${JSON.stringify(req.body.email)},
                ${JSON.stringify(req.body.dateValidation)},
                ${JSON.stringify(req.body.dateInstalle)},
                '${date.toString()}',
                ${req.body.suppClient}
              )`,
    (err, rows) => {
      console.log('retour sql 2', err, rows);

      if (err) {
        res.send(err.sqlMessage);
      } else {
        res.send(rows);
      }
    },
  );
});



app.post('/planing', (req, res) => {
  // const table = req.body.
  console.log('post planing', req.body);

  connection.query(
    `SELECT p.*, cli.nom as Client, c.nom as Commercial FROM ${req.body.table}`,
    (err, rows) => {
      // console.log('retour sql 2', err, typeof rows);

      if (err) {
        res.send(err.sqlMessage);
      } else {
        
        res.send(rows);
      }
    },
  );
});