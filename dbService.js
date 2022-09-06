const mysql = require('mysql');
const dotenv = require('dotenv');
const instance = null ;
dotenv.config();

const connection = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB,
    port:process.env.DB_PORT
})

connection.connect((err)=>{
    if(err){
        console.log(err.message);
    }

    console.log('db' + connection.state);
})

class DbService  {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "select * from names ;";
                connection.query(query,(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        }catch(error){
            console.log(error)
        }
    }

    async insertNewRow(name){
        try{

            const newname = name;
            const createdAt = new Date();
            const insertId = await new Promise((resolve,reject)=>{
                const query = "insert into names (name,created_at) values (?,?) ;";
                connection.query(query,[newname,createdAt],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            // console.log(insertId.insertId);
            return {
                id:insertId.insertId,
                name:newname,
                created_at:createdAt,
            };

        }catch(error){
            console.log(error);
        }
    }

    async deleteRowById(id){
        try{

            id = parseInt(id,10);
            const response = await new Promise((resolve,reject)=>{
                const query = "delete from names where id = ?";
                connection.query(query,[id],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.effectedRows);
                })
            });
            return response ===1 ? true : false;

        }catch(error){
            console.log(error);
            return false;
        }

    }

    async editRowById(id,name){
        try{

            id = parseInt(id,10);
            const response = await new Promise((resolve,reject)=>{
                const query = "update names set name = ? where id = ?";
                connection.query(query,[name,id],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.effectedRows);
                })
            });
            return response ===1 ? true : false;

        }catch(error){
            console.log(error);
            return false;
        }

    }

    async searchByName(name){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "select * from names where name = ? ;";
                connection.query(query,[name],(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
           
            return response;
        }catch(error){
            console.log(error)
        }


    }
}

module.exports = DbService;