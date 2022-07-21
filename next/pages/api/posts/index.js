// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createRouter } from "next-connect"
import multer from "multer"
import { getPosts, createPost } from '../../../server/posts.js'

const router = createRouter()


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get( async (req, res) => {
  const posts = await getPosts()
  res.status(200).send(posts)
})

router.post(upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  
  const post = await createPost(file, caption)
  
  res.status(201).send(post)
})


export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
}