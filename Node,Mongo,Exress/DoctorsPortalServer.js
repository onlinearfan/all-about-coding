const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); //*
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var nodemailer = require('nodemailer');  //*
var sgTransport = require('nodemailer-sendgrid-transport'); //*
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //*

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Mongodb connection setup with database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.twtll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT authorization validate function
function verifyJWT(req, res, next) {
    //header auth will come form client side, if client has a login information token 
  const authHeader = req.headers.authorization; 
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' }); //if token fail to get 
  }
  const token = authHeader.split(' ')[1]; //[barear dsafdaf2342342324] barea token string spliting

  //verifying of token match with access token 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' }) // if token not match then 403 error
    }
    //if error not find then decode will execute 
    req.decoded = decoded; //user all data will be here 
    next();
  });
}




//this is for email sender 
const emailSenderOptions = {
  auth: {
    api_key: process.env.EMAIL_SENDER_KEY
  }
}


//This is for email sending with node mailer 
const emailClient = nodemailer.createTransport(sgTransport(emailSenderOptions));

function sendAppointmentEmail(booking) {
    //sendAppointmentEmail function call with booking data , 
  const { patient, patientName, treatment, date, slot } = booking; 

  var email = {
    from: process.env.EMAIL_SENDER, //Our email will be here,
    to: patient, 
    subject: `Your Appointment for ${treatment} is on ${date} at ${slot} is Confirmed`,
    text: `Your Appointment for ${treatment} is on ${date} at ${slot} is Confirmed`,
    html: `
      <div>
        <p> Hello ${patientName}, </p>
        <h3>Your Appointment for ${treatment} is confirmed</h3>
        <p>Looking forward to seeing you on ${date} at ${slot}.</p>
        
        <h3>Our Address</h3>
        <p>Andor Killa Bandorban</p>
        <p>Bangladesh</p>
        <a href="https://web.programming-hero.com/">unsubscribe</a>
      </div>
    `
  };

  emailClient.sendMail(email, function (err, info) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Message sent: ', info);
    }
  });

}

//Email sending for payment confirmation message sending 
function sendPaymentConfirmationEmail(booking) {
  const { patient, patientName, treatment, date, slot } = booking;

  var email = {
    from: process.env.EMAIL_SENDER,
    to: patient,
    subject: `We have received your payment for ${treatment} is on ${date} at ${slot} is Confirmed`,
    text: `Your payment for this Appointment ${treatment} is on ${date} at ${slot} is Confirmed`,
    html: `
      <div>
        <p> Hello ${patientName}, </p>
        <h3>Thank you for your payment . </h3>
        <h3>We have received your payment</h3>
        <p>Looking forward to seeing you on ${date} at ${slot}.</p>
        <h3>Our Address</h3>
        <p>Andor Killa Bandorban</p>
        <p>Bangladesh</p>
        <a href="https://web.programming-hero.com/">unsubscribe</a>
      </div>
    `
  };

  emailClient.sendMail(email, function (err, info) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Message sent: ', info);
    }
  });

}



//Async function for api 
async function run() {
  try {
    //connection client with mongodb database store  
    await client.connect();
    //making collection and database 
    const serviceCollection = client.db('doctors_portal').collection('services');
    const bookingCollection = client.db('doctors_portal').collection('bookings'); //pending
    const userCollection = client.db('doctors_portal').collection('users'); //isAdmin
    const doctorCollection = client.db('doctors_portal').collection('doctors');
    const paymentCollection = client.db('doctors_portal').collection('payments');

    //Admin Status Verifying with jwt 
    /**
     * 1)three steps to make verify admin  ,
     * -)get the decoded email ,
     * -)find userData by email address, 
     * -)check user.role === admin ;
     * -)if true then next, if false then err send, 
     */
    //this function here because of userCollection data need to work with verification  
    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email; // if user login then here will come and get the email by verifyJWT func
      //finding user information from userCollection to check admin status 
      const requesterAccount = await userCollection.findOne({ email: requester });

      //user.role ===admin then it will pass to next work or then it will give err 
      if (requesterAccount.role === 'admin') {
        next();
      }
      else {
        res.status(403).send({ message: 'forbidden' });
      }
    }

    //this is form payment methods , 
    app.post('/create-payment-intent', verifyJWT, async(req, res) =>{
      const service = req.body;
      const price = service.price;
      const amount = price*100;

      //this will send to stripe data, and get a client secrete form there  
      const paymentIntent = await stripe.paymentIntents.create({
        amount : amount,
        currency: 'usd',
        payment_method_types:['card']
      });
      res.send({clientSecret: paymentIntent.client_secret})
    });

    //! this is a simple get api for fetching all the services available in websites 
    // link www.localhost:5000/service [get fetch will be used in client side ]
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).project({ name: 1 }); //*
      const services = await cursor.toArray();
      res.send(services);
    });

    //! this is a simple get api for fetching all the users available in websites 
    // link www.localhost:5000/user [get fetch will be used in client side | can use useQuery for refetching again ]
    app.get('/user', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

        //! this is a simple get api for fetching admin users verification in websites 
    // link www.localhost:5000/admin/khan@gmail.com  [get fetch will be used in client side | can use useQuery for refetching again ]
    app.get('/admin/:email', async (req, res) => {
      const email = req.params.email; //getting email form user params [khan@gmail.com]
      const user = await userCollection.findOne({ email: email }); //data finding from userCollection 
      const isAdmin = user.role === 'admin'; //true sending if match 
      res.send({ admin: isAdmin }) //client side will get this to verify user admin 

      //this api can work form admin verification, if user status not admin then do something 
    })

    //! this is a simple get api for fetching all the users available in websites 
    // link www.localhost:5000/user/admin/khan@gmail.com  [this is for making someone admin]
    app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
    /**
     * 1)checking user login token and admin verification 
     * 2)then a admin user can make a normal user admin 
     * 3)after clicking on the button normal user email will come as a params data 
     */
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    //user profile modification or updating or add new user 
    app.put('/user/:email', async (req, res) => {
        /**
         * 1)after clicking the profile update button the value will come from the profile input box 
         * 2)put data will run 
         */
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true }; //create new one if doesn't exist 
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      //if user login or sing up then his email will come an store here ,
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res.send({ result, token });
    });

    // Warning: This is not the proper way to query multiple collection. 
    // After learning more about mongodb. use aggregate, lookup, pipeline, match, group

    //finding available service form database, 
    //this will run by changing date 
    app.get('/available', async (req, res) => {
      const date = req.query.date;

      // step 1:  get all services
      const services = await serviceCollection.find().toArray(); //here we can find all the services 
 
      // step 2: get the booking of that day. output: [{}, {}, {}, {}, {}, {}]
      //here we will find all the booking service which users booked after clicking booking btn on a particular date
      const query = { date: date };
      const bookings = await bookingCollection.find(query).toArray(); //find all the booking service based on data,
        //booking.name === service.name match then it will remove from service on that perticular da
      // step 3: for each service
      services.forEach(service => { //service looping one by one
        // step 4: find bookings for that service. output: [{}, {}, {}, {}]
        const serviceBookings = bookings.filter(book => book.treatment === service.name); //booking looping
        // step 5: select slots for the service Bookings: ['', '', '', ''] //slot is a select box array 
        const bookedSlots = serviceBookings.map(book => book.slot);
        // step 6: select those slots that are not in bookedSlots
        const available = service.slots.filter(slot => !bookedSlots.includes(slot)); //select box of service filtering 
        //step 7: set available to slots to make it easier 
        service.slots = available;
      });


      res.send(services);
    })


    //!orders data api 
    /**
     * API Naming Convention
     * app.get('/booking') // get all bookings in this collection. or get more than one or by filter
     * app.get('/booking/:id') // get a specific booking 
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id) //
     * app.put('/booking/:id') // upsert ==> update (if exists) or insert (if doesn't exist)
     * app.delete('/booking/:id) //
    */

    //orders data fetching by a particular user email 
    //link localhost:5000/booking?patient=khan@gmail.com  
    app.get('/booking', verifyJWT, async (req, res) => {
      const patient = req.query.patient; //user email wil be here for getting his order data 

      //if jwt verification done with successful then it will give a decoded email 
      const decodedEmail = req.decoded.email;
      //if patientEmail mathc will our jwt decodedEmail then it will send for finding his booking data , 
      if (patient === decodedEmail) {
        const query = { patient: patient };
        const bookings = await bookingCollection.find(query).toArray();
        return res.send(bookings);
      }
      else {
        return res.status(403).send({ message: 'forbidden access' });
      }
    });

    //getting a particular booking from id for payment 
    app.get('/booking/:id', verifyJWT, async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const booking = await bookingCollection.findOne(query);
      res.send(booking);
    })


    //this api for taking a booking service form user, 
    //see client side localhost:5000/booking post api for understanding
    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
      const exists = await bookingCollection.findOne(query); //finding is it booked already
      if (exists) {
        return res.send({ success: false, booking: exists })
      }

      const result = await bookingCollection.insertOne(booking);
      console.log('sending email');
      sendAppointmentEmail(booking);
      return res.send({ success: true, result });
    });

    //this is form payment button click 
    // check booking/:id patch requester for proper understanding 
    app.patch('/booking/:id', verifyJWT, async(req, res) =>{
      const id  = req.params.id; //id getting from service 
      const payment = req.body; //payment information wil be here 
      const filter = {_id: ObjectId(id)};
      const updatedDoc = {
        $set: {
          paid: true, // a property making as a paid name true 
          transactionId: payment.transactionId
        }
      }

      const result = await paymentCollection.insertOne(payment);
      const updatedBooking = await bookingCollection.updateOne(filter, updatedDoc);
      res.send(updatedBooking);
    })

    //getting all doctors 
    app.get('/doctor', verifyJWT, verifyAdmin, async (req, res) => {
      const doctors = await doctorCollection.find().toArray();
      res.send(doctors);
    })

    // adding new doctors 
    app.post('/doctor', verifyJWT, verifyAdmin, async (req, res) => {
      const doctor = req.body;
      const result = await doctorCollection.insertOne(doctor);
      res.send(result);
    });

    //deleting doctors with email params 
    app.delete('/doctor/:email', verifyJWT, verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await doctorCollection.deleteOne(filter);
      res.send(result);
    })

  }
  finally {

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello From Doctor Uncle own portal!')
})

app.listen(port, () => {
  console.log(`Doctors App listening on port ${port}`)
})




//----------------------------------
