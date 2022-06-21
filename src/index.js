const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 

mongoose.connect("mongodb+srv://functionup-cohort:P8qVpKuqjaLAhMJT@cluster0.ahfdt.mongodb.net/webDatabase-db", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



// app.use('/', route);

// app.use (
//     function (req, res, next) {
//         console.log ("inside GLOBAL MW");
//         res.send({msg:"done"})
//   }
//   );


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});