
const express = require('express')
const app = express()
const port = 3000;

// ********* Connect to database ************
const mysql = require('mysql');
const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'helloDeploy'
});
dbConn.connect();


//******* XỬ lý Cross Origin ********

// Cách 1: Tôi thấy nó chỉ đúng với method 'GET'
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Cách 2: Tôi thấy cách này áp dụng hết cho tất cả methods
var cors = require('cors');
app.use(cors());



//********** API **********
app.get('/posts', (req, res) => {
  dbConn.query('SELECT * FROM posts', (err, rows, fields) => {
    if (err) throw err;
    return res.send({data: rows, message: 'posts list'})
  })
});


//******* XỬ lý dữ liệu cho methods 'POST' và 'PUT'  */
// Cách 1:
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Cách 2:
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));


//********** API **********
app.post('/post', (req, res) => {
  // Cách 1:
  const q = "INSERT INTO posts (id, userId, title, descr) VALUES (?)";
  const values = [
    req.body.id,
    req.body.userId,
    req.body.title,
    req.body.descr,
  ];
  dbConn.query(q, [values], (err, data, fields) => {
    if (err) return res.json(err);
    return res.json(data);
  })

// Cách 2:
//   let data = req.body;
//   let id =  req.body.id;
//   let userId =  req.body.userId;
//   let title =  req.body.title;
//   let descr =  req.body.descr;

//   const q = `INSERT INTO posts (id, userId, title, descr) VALUES (${id}, ${userId}, "${title}", "${descr}")`
//   dbConn.query(q, function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: false, data: results, message: 'New post has been created successfully.' });
//   });

});


//******* default ********
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`chạy thành công -->  http://localhost:${port}`)
})