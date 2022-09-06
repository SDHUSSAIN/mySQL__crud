const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//create
app.post('/insert', (request,response)=>{
    const {name} = request.body ;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewRow(name);
    result.then(data => response.json({data:data})).catch(error => console.log(error));
    // console.log(request.body);

});

//read
app.get('/getAll', (request,response)=>{
    const db = dbService.getDbServiceInstance();
    const result = db.getAllData();
    result.then(data => response.json({data : data})).catch(err=> console.log(err));
});


//update
app.patch('/update', (request,response)=>{
    const { id,name } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.editRowById(id,name);
    result.then(data=> response.json({success:true})).then(error=>console.log(error));
});


//delete
app.delete('/delete/:id', (request,response)=>{
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    result.then(data=> response.json({success:true})).then(error=>console.log(error));
    
});


//search
app.get('/search/:name', (request,response)=>{
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByName(name);
    result.then(data => response.json({data : data})).catch(err=> console.log(err));
});



//server status

app.listen(process.env.PORT, ()=>{
    console.log('app is running');
})