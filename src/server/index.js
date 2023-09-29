import express from 'express';
import bodyParser from 'body-parser';
import  cors  from 'cors';
import fs from 'fs'
const app = express();
// app.use(express.json());
app.use(cors());


// app.use(bodyParser({limit: '1024mb'}));
// app.use(express.urlencoded({ extended: true, limit: '100mb'  }));
// app.use(express.json({ extended: true, limit: '100mb' }));
// app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));// urlencodeされたボディをパースする際のlimitを設定
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));
app.use(express.json({  limit: '1000mb' }));


app.post('/', function(request, response) {

    fs.writeFileSync("./public/diaData/save.json",JSON.stringify(request.body),'utf8');

});

app.listen(3000, () => console.log('Hello!'));
