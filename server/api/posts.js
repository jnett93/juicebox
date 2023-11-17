const express = require('express');
const postsRouter = express.Router();

const prisma = require('../client');

const { requireUser } = require('./utils');

//GET /api/posts - get all posts
postsRouter.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.posts.findMany();
        res.send(posts)
    } catch (error) {
        res.send("unable to get posts")
    }
});

//POST /api/posts/ - create a new post if authenticated
postsRouter.post('/', requireUser, async (req, res, next) => {
    try {
        const newPost = await prisma.posts.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                userId: req.user.id
            }
        })
        
        res.send(newPost)
    } catch (error){
        res.status(401).json({error: error.message})
    }
 })

 //GET /api/posts/:postId - get single post
postsRouter.get("/:postId", async(req, res, next) => {
    try {
        const singlePost = await prisma.posts.findUnique({
            where: {
                id: Number(req.params.postId)
            }
        })

        if(!singlePost){
            res.send("post not found")
        }
        res.send(singlePost)
    } catch (error) {
        res.send("unable to get single post.")
    }
});

//PUT /api/posts/:postId - update single post if authenticated
postsRouter.put("/:postId", requireUser, async(req, res, next) => {
    try {
        const updatedPost = await prisma.posts.update({
            where: {
                id: Number(req.params.postId),
                userId: req.user.id
            },
            data: {
                title: req.body.title,
                content: req.body.content
            }
        })

        if(!updatedPost) {
            res.send("post not found");
        }

        res.json({
            message: "Post updated!",
            post: updatedPost
        })
    } catch (error) {
        res.send("unable to find and update post.")
    }
});

//DELETE /api/posts/:postId - delete post by ID
postsRouter.delete("/:postId", requireUser, async(req, res, next) => {
    try{
        const deletedPost = await prisma.posts.delete({
            where: {
                id: Number(req.params.postId),
                userId: req.user.id
            }
        })
        res.json({
            message: "Post deleted!",
            Post: deletedPost
        })

    } catch(error){
        res.send("Unable to find and delete post.")
    }
})



module.exports = postsRouter; 