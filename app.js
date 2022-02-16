import express from 'express';

const app = express();

const port = process.env.PORT || 3000;

app.get('/',(req, res) => {
    console.log("you connected");
    res.send("you connected");
})

app.listen(port, ()=>{
    console.log(`back end up and running on ${port}`);
})