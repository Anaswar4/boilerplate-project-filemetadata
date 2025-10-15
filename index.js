var express = require('express');
var cors = require('cors');
var multer = require('multer');
var Path= require('path');
var fs = require('fs');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

if(!fs.existsSync('./uploads')){
  fs.mkdirSync('./uploads')
}

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//storage setup
const storage = multer.diskStorage({
  destination:function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req,file,cb){
    cb(null,Date.now() + Path.extname(file.originalname))
  }
});

const upload = multer({storage:storage})

app.post('/api/fileanalyse',upload.single('upfile'),(req,res)=>{
  const file = req.file;
  if(!file){
     return res.json({error:'Please upload a file'})
  }
  res.json({
    name:file.originalname,
    type:file.mimetype,
    size:file.size
  });
});




const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', function () {
  console.log('Your app is listening on port ' + port)
});
