import { useEffect, useState } from 'react'
import axios from 'axios'
import { getPosts } from '../server/posts.js'

import SinglePost from '../components/SinglePost'
import NavBar from '../components/NavBar'

function App(props) {  
  const [posts, setPosts] = useState(props.posts)

  const likeClicked = async ({id}) => {
    console.log(`likeClicked = (${id})`)
  }
  const commentClicked = ({id}) => {
    console.log(`commentClicked = (${id})`)
  }
  const editPostClicked = ({id}) => {
    // navigate("/editPost/" + id)
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
    <div>
      <NavBar></NavBar>
      <div>
        <div className="App">
          <div className="flex flex-col space-y-100 items-center divide-y">
            {posts.map(post => (
              <div key={`post-${post.id}`} className="px-5 py-14">

                <SinglePost className="relative" post={post} {...postActions}></SinglePost>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

export async function getServerSideProps(context) {
  const posts = await getPosts()
  return {
    props: {posts: JSON.parse(JSON.stringify(posts))}, 
  }
}
