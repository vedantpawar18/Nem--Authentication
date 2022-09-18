
const express= require("express");
const connection=require("./Config/db")
var jwt = require('jsonwebtoken');

const app=express();
app.use(express.json())
const { UserModel}= require("./Model/user.model")

app.get("/", (req,res)=>[
    res.send("Welcome to home page")
]);

app.post("/signup", async(req,res)=>{
    const user= new UserModel(req.body)
    await user.save()
    res.send("sign up successful")
})

app.post("/login",async(req,res)=>{
    const isValid=await UserModel.findOne(req.body)
    if(isValid)
    {
        var token = jwt.sign({ foo: 'bar' }, 'secret',{ expiresIn: "1h" });
        res.send({"msg":"login successful", "token":token})
    }
    else{
        res.send("Login failed, invalid credentials")
    }
    
})

app.get("/dashboard", (req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    
    jwt.verify(token, 'secret', function(err, decoded) {
        if(err){
            res.send("please login")
        }
        else{
            res.send("Important data")
        }
      });
})

app.listen(8080,async()=>{
    try{
        await connection
        console.log("connected to db successfully")
    }
    catch(err){
        console.log("err connecting to db")
        console.log(err)
    }
    console.log("listening to port 8080")
})