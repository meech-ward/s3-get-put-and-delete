import { useEffect, useState } from 'react'
import axios from 'axios'

import SinglePost from '../SinglePost'

import { useNavigate } from 'react-router-dom'


function App() {  

  const [posts, setPosts] = useState([])
  let navigate = useNavigate();

  useEffect(() => {
    async function getPosts() {
      const result = await axios.get("/api/posts")
      setPosts(result.data)
    }
    getPosts()
  }, [])

  const likeClicked = async ({id}) => {
    console.log(`likeClicked = (${id})`)
  }
  const commentClicked = ({id}) => {
    console.log(`commentClicked = (${id})`)
  }
  const editPostClicked = ({id}) => {
    navigate("/editPost/" + id)
    console.log(`editPostClicked = (${id})`)
  }
  const deletePostClicked = async ({id}) => {
    console.log(`deletePostClicked = (${id})`)
    await axios.delete("/api/posts/" + id)
    setPosts(posts.filter(post => post.id !== id))
  }

  const postActions = {
    likeClicked,
    commentClicked,
    editPostClicked,
    deletePostClicked
  }


  return (
    <div className="App">

      <div className="flex flex-col space-y-100 items-center divide-y">
        {posts.map(post => (
          <div key={`post-${post.id}`} className="px-5 py-14">

            <SinglePost className="relative" post={post} {...postActions}></SinglePost>
            
          </div>
        ))}
      </div>

    </div>
  )
}

export default App
