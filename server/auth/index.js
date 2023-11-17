const express = require('express');
const authRouter = express.Router();

const prisma = require('../client')

const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const jwt = require("jsonwebtoken");
const { JWT } = process.env

//GET /auth/users - get all users
authRouter.get('/users', async (req, res, next) => {
    try {
        const users = await prisma.users.findMany();
        res.send(users)
    } catch (error) {
        res.send("unable to get all users")
    }
});

//POST /auth/register - post new user
authRouter.post('/register', async (req, res, next) => {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    try {
        const user = await prisma.users.findUnique({
            where: {
                username: req.body.username,
            }
        })

        if (user) {
            res.send("A user by that username already exists")
        }

        const newUser = await prisma.users.create({
            data: {
                username: req.body.username,
                password: hashedPassword
            }
        });

        delete newUser.password

        const token = jwt.sign({ id: newUser.id }, process.env.JWT);
        
        res.send({newUser, token});
    } catch (error) {
        res.send("unable to register")
    }
})


//POST /auth/login - login a previous user
authRouter.post("/login", async(req, res, next) => {
    try {
        const password = req.body.password;

        const user = await prisma.users.findUnique({
            where: {
               username: req.body.username, 
            }
        });

        if(!user) {
            return res.status(401).send("Invalid login credentials.")
        };

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return res.status(401).send("Invalid login credentials.");
        }

        const token = jwt.sign({id: user.id}, process.env.JWT);

        delete (user.password)

        res.send({user, token});

    } catch (error) {
        res.send("unable to log in.")
    }
})


module.exports = authRouter