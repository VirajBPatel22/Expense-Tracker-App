const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const{readdirSync}=require('fs');

const app = express()

require('dotenv').config()
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

readdirSync('./routes').map((route)=> app.use('/api/v1',require('./routes/'+ route)))

// app.get('/',(req,res)=>{
//     res.send('jay swaminarayan')
// })

const server =() =>{
    db()
    // console.log('you listen port :',PORT);
    app.listen(PORT,() =>{
        console.log('listening to port :',PORT)
    })

}
server()