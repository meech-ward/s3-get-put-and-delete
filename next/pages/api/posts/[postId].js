// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { createRouter } from "next-connect"

import { deletePost } from '../../../server/posts.js'

const router = createRouter()

router.delete("/api/posts/:id", async (req, res) => {
  const { postId } = req.query
  const post = await deletePost(+postId)
  res.send(post)
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