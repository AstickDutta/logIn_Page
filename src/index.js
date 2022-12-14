const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const { default: mongoose } = require('mongoose');
mongoose.set('strictQuery', true)
const app = express();

app.use(bodyParser.json());



mongoose.connect("mongodb+srv://Astick_Dutta:AavSNrGfPyPswMGg@cluster0.laksbb0.mongodb.net/Astick-DB", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);
app.use((req, res, next) => {
    res.status(400).send({ status: false, error: "Enter proper Url" });
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
