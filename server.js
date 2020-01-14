const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
const path = require('path')


//  Configure the env file 
dotenv.config()


// Import routes
const transactions =  require('./routes/api/Transaction');
const users =  require('./routes/api/User');

// Instantiating the app variable
const app = express();


// Connecting to the mongodb server with mongoose odm
mongoose.connect("mongodb://localhost:27017/budget-keeper",{useNewUrlParser:true, useUnifiedTopology: true}).then(()=>console.log('DB Connected')).catch(err=> console.log(err.message))
mongoose.set('useFindAndModify', false)


// Middleware/ Routes
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use('/', users);
app.use('/api',transactions);


if (process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'client','build')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'client','build','index.html'));
    });

// Port for listening to requests
const port = process.env.PORT || 8000;
app.listen(port, ()=>console.log(`Server running at port ${port}`));




