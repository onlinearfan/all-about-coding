
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const {MongoClient,ServerApiVersion,ObjectId} = require('mongodb')
const nodemailer = require('nodemailer');
var sgTransport = require('sgTransport');
const { info } = require('console');
const stripe= require('stripe')(process.env.STRIPE.KEY);

const app = express();

const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

//userVerification jwt 

function verifyUser(req,res,next){
    const authData = req.header.authorization; //auth data taking from user 
    if(!authData) return res.status(401).send({message:'unauthorized'});
    const token = authData.split(" ").[1];

    jwt.verify(token,processs.evn.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err) return res.status(403).send({message:'not matched'});
        req.decoded = decoded; //req.decode will store all about user,
        next();
    })
}

//email sending 
// emailoptionssend, emailClient, function email.sendTO();

const emailSenderOptions = {
    auth:{
        api_key:'dafasdfadsf';
    }
}
//creating email sender // same process to send mail to user,
const emailClient = nodemailer.createTransport(sgTransport(emailSenderOptions));

function sendBookingMail(booking){
    const {name,productName,userEmail,message} = booking ;

    const emailData = {
        from:'khan188993@gmail.com',
        to:userEmail,
        subject:"fasfadsf",
        text:"asdfasdf ",
        html:`<h1>send data in html tag</h1>`

    }

    emailClient.sendMail(emailData,(err,info)=>{
        if(err) console.log(err);
        if(info) console.log(info);
    })
}




//mongodb connection settings 
const uri = 'link with userName and password';
const client = new MongoClient(uri,{});

async function run(){
    try{
        //db connection 
        await client.connect();

        //db collection making 
        const userCollection = client.db('db_name').collection('users');


        async function verifyAdmin(req,res,next){
            const email = req.decoded.email;

            const userInfo =await userCollection.findOne({email:'khan'});
            if(userInfo.role ==='admin'){
                 next();
            }else{
                 res.status(403).send({message:'not admin'})
            }

        }

        app.post('create-payment-intent',async(req,res)=>{
            const service  = req.body;
            const price = service.price;
            const totalAmount = price*100;

            const paymentIntent = await stripe.paymentIntent.create({
                amount:amount,
                currency:'usd',
                payment_method_types:['card'],
            });

            res.send({clientSecret:paymentIntent.client_secret});
        }

        /**
         * !how to make payment getway by stripe,
         * 1)add stripe package in your projects,
         * 2)get your submitted data for inserting into stripe website to get client_secret;
         * 3)make paymentIntend = await stripe.paymentIntend.create({amount,currency,payment_methods});
         * 4)get your client secret id from paymentIntend variable,
         * 5)send the client secret to client view, 
         */

        app.post('create-payment-intent',async (req,res)=>{
            const price = req.body.price;
            const totalAmout = price*100;

            const paymentIntent = await stripe.paymentIntent.create({
                amount:amount,
                currency:"usd",
                payment_method_types:['card'],
            })

            res.send({client_secret:paymentIntend.client_secret});
        })

        app.get('/service',async (req,res)=>{
            const q = req.query;
            const serviceData =await serviceCollection.find({}).toArray();
            res.send({serviceData});
        })

        app.get('/user',verifyUser,async(req,res)=>{
            const q = req.query;
            const userData = await userCollection.find(q).toArray()
            res.send(userData);
        })

        //checking a user Admin or not ;
        app.get('/admin/:email',async(req,res)=>{
            const email = req.params.email;
            const userInfo = await userCollection.findOne({email:email}).toArray();

            const isAdmin = userInfo.role ==='admin';
            res.send({isAdmin});
        })



        //api making 
        app.get('/',async(req,res)=>{
            const query = req.query; 
            const result =await userCollection.find(query).toArray();
            res.send({message:'getting api '});
        })

        app.post('/user',verifyUser,async(req,res)=>{
            const result =await userCollection.insertOne({name:'arfan khan'});
            res.send({message:'post user'});
        })

        app.delete('/user/:id',async(req,res)=>{
            const id = req.params.id;
            const result =await userCollection.delete({_id:ObjectId(id)});
            res.send({message:'deleted'});
        })

        app.put('/user/:email',async(req,res)=>{
            const filter = {email:req.params.email};
            const options = {
                upsert:true;
            }
            const updateDoc = {
                $set:req.body
            }


            const result = await userCollection.updateOne(filter,updateDoc,options);
            const token = jwt.sign({email:email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
            res.send({message:'put user data',token});

        })
    }
    finally{

    }
}

run().catch(console.dir);