import React from "react";
import { useEffect, useState } from "react";

export default function ListOfPosts() {
    const [listOfPosts, setListOfPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAllPosts() {
            try {
                const response = await fetch("http://localhost:8080/api/posts");
                const postsArray = await response.json();
                console.log(postsArray);
                setListOfPosts(postsArray);

            } catch (error) {
                setError(error.message)
            }
        }
        fetchAllPosts();
    }, [])
    return (
        <>
        <h3>List of Posts</h3>
        {listOfPosts ? (
             listOfPosts.map((post) => {
                return (
                    <div id="posts" key={post.id}>
                        <p>Title:{post.title}</p>
                        <p>Content: {post.content}</p>
                    </div>
                )
            })

        ) : (
            <p>unable to load posts...</p>
        )}


        </>
    )
}