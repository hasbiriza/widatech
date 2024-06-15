const express = require (`express`);
const bodyParser = require('body-parser');
const invoiceRoutes = require('./routes/invoiceRoutes')
const {migrate} = require('./migration');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(`/api`, invoiceRoutes);


migrate().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on PORT ${PORT}`);
    });
}).catch(error =>{
    console.error("Migration Failed", error);
})