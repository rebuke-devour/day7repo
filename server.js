// ====== DEPENDENCIES === //
// Get .env variables
    require("dotenv").config();

//Pull PORT from .env; default val  = 3000
    const {PORT = 3000, DATABASE_URL} = process.env;

// Import Express
    const express = require('express')

// Create App Object
    const app = express();

// Import Mongoose
    const mongoose = require("mongoose")

// ==Import Middleware == //
const cors = require("cors");
const morgan = require("morgan");


// = M I D D L E W A R E = //

app.use(cors());
app.use(morgan("dev"))
app.use(express.json())

//=========================//
// ===== MODELS ========= //

const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
}, {timestamps: true})

const People = mongoose.model("People", PeopleSchema);


// == DB CONNECTION == //

// Establish Connection
    mongoose.connect(DATABASE_URL, {
        useunifiedTopology: true,
        useNewUrlParser: true,
    });
// Connection Events
mongoose.connection
    .on("open", ()=> console.log("You are Connected"))
    .on("close", ()=> console.log("Your are disconnected"))
    .on("error", (error)=> console.log(error))



// === ROUTING === //

// Test Route
app.get('/', (req,res)=> {
    res.send('Hello')
})

//=People Index Route=//
app.get('/people', async (req, res)=>{
    try{
        //Send people to Index
    res.json(await People.find({}))
    } catch (error){
        //sends error
    res.status(400).json(error)
    }
})
//=People Create Route=//
app.post("/people", async (req, res) => {
    try {
      // send all people
      res.json(await People.create(req.body));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
})
//=People Update Route=//
app.put('/people/:id', async (req,res)=>{
//Send All People
    try{
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
//send Error
    res.status(400).json(error);
    }
});

//=People Destroy Route
app.delete('/people/:id', async (req,res)=>{
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error)
    }
});

//=======LISTENER======//
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
