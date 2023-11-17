const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const {JWT} = process.env;

const prisma = require('../client');

//Testing functionality of router
apiRouter.get('/', (req, res, next)=> {
    res.send("This is the apiRouter")
});

// const postsRouter = require("./posts");
// apiRouter.use('/posts', postsRouter);

//set "req.user"
apiRouter.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if(!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const {id} = jwt.verify(token, process.env.JWT);

            if (id) {
                req.user = await prisma.users.findUnique({
                    where: {
                        id: id
                    }
                })
                next();
            } else {
                res.status(401).json({
                    message: 'Authorization token malformed'
                })
            }
        } catch (error) {
            res.json({error: error.message})
        }
    } else {
        next({
            name: 'AuthorizationHeaderError',
            message: 'Authorization token must start with ' + prefix
        })
    }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("User is set: ", req.user)
    }
    next()
});

const postsRouter = require("./posts");
apiRouter.use('/posts', postsRouter);


module.exports = apiRouter;
