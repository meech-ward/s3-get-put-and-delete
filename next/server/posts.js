// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import sharp from 'sharp'
import crypto from 'crypto'

import { PrismaClient } from "@prisma/client"
import { uploadFile, getObjectSignedUrl, deleteFile } from './s3.js'

const prisma = new PrismaClient()

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


export async function getPosts() {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  for (let post of posts) {
    post.imageUrl = await getObjectSignedUrl(post.imageName)
  }
  return posts
}

export async function createPost(file, caption) {
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
    }
  })
  
  return post
}

export async function deletePost(id) {
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})

  return post
}