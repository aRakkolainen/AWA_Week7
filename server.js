const express = require('express');
const app = express(); 
const path = require('path');
const port = 3000;
const bcrypt = require('bcrypt')
let users = []; 
app.use(express.json());

app.post("/api/user/register", async (req, res) => {
    //console.log(req.body);
    try {
        let username = req.body.username;
        let password = req.body.password;
        // Checking whether there exists user with specific username is based on this: https://stackoverflow.com/questions/40438851/use-javascript-to-check-if-json-object-contain-value
        if (users.some(user => user.username === req.body.username)) {
            res.status(400).send("User exists already!");
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);
            let id = Math.floor(Math.random()*5000)+1;
            let user = {
                "id": id,
                "username": username,
                "password": hashedPassword
            }
            users.push(user);
            res.send(user);
        }
        
        } catch(error) {
            res.send(error)
        }
});

app.post("/api/user/login", async (req, res) => {

})

// Route for returning a list of registered users
app.get("/api/user/list", (req, res) =>{
    res.send(users)
})


app.listen(port, () => console.log("Server running at port ", port));
