const express = require (`express`);
const bodyParser = require('body-parser');
const {migrate} = require('./migration');
const router = require('./router/router');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 8000;


app.use(bodyParser.json());

app.use(cors());
app.use(`/api`, router);
app.use('/images', express.static('images'));



migrate().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error =>{
    console.error("Migration Failed", error);
})