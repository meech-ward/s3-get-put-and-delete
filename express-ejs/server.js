import express from 'express'

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'

import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'

const app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"))

const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/", async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  for (let post of posts) {
    post.imageUrl = await getObjectSignedUrl(post.imageName)
  }
  res.render('index', {posts})
})


app.post('/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

  await prisma.posts.create({
    data: {
      imageName,
      caption,
    }
  })
  
  res.redirect("/")
})

app.post("/api/deletePost/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})
  res.redirect("/")
})

app.listen(8080, () => console.log("listening on port 8080"))