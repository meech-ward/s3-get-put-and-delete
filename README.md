# S3 Get, Put and Delete 

Examples of how to upload, download and delete files from S3 bucket using [multer](https://www.npmjs.com/package/multer) and the [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) Node.js. 

> Note:
> I used [Prisma](https://www.prisma.io/) with MySQL for the database and [tailwind](https://tailwindcss.com/) for the styling. These are irrelevant details for this example. Any database or styling would work. The important part is how the Node.js backend communicates with S3.

This repo contains 3 different examples:

* [Express & EJS](https://github.com/meech-ward/s3-get-put-and-delete/tree/master/express-ejs)
* [Express & React](https://github.com/meech-ward/s3-get-put-and-delete/tree/master/express-react)
* [Next.js](https://github.com/meech-ward/s3-get-put-and-delete/tree/master/next)

Check out those directories for specific examples. Here's the gist of what's going on though:

1. Images get POSTed to the server where they can be modified or validated or whatever, then uploaded from the server to an S3 bucket. 
2. To get the image from S3, the server generates a signed url so the client can GET the image from S3 directly and securely.
3. To delete the image from S3, the server sends a delete request to S3.

## Posting an image to the server

To post an image to the server, the client sends a `multipart/form-data` request to the server with the image data and any other data that the client wants to send.

**HTML:**
```html
<form action="/posts" method="POST" enctype="multipart/form-data">
   <input type="file" name="image" accept="image/*"/>
   <input type="text" name="caption" placeholder="Caption"/>
   <button type="submit">Submit</button>
</form>
```

**React/Next:**
```jsx
export default function NewPost() {  
  const [file, setFile] = useState()
  const [caption, setCaption] = useState("")

  const submit = async event => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("image", file)
    formData.append("caption", caption)
    await axios.post("/api/posts", formData, { headers: {'Content-Type': 'multipart/form-data'}})
  }

  return (
     <form onSubmit={submit}>
       <input onChange={e => setFile(e.target.files[0])} type="file" accept="image/*"></input>
       <input value={caption} onChange={e => setCaption(e.target.value)} type="text" placeholder='Caption'></input>
       <button type="submit">Submit</button>
     </form>
  )
}
```

## Processing the image 

The server then accepts the image data using [multer](https://www.npmjs.com/package/multer) and keeps the image in memory so it can be easily modified and sent to S3. The app's in this example modify the image by resizing it using [sharp](https://www.npmjs.com/package/sharp). At all times the image is stored in memory as a buffer.

```js
import multer from 'multer'
import sharp from 'sharp'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post('/posts', upload.single('image'), async (req, res) => {
  const file = req.file 
  const caption = req.body.caption

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  // ...
})
```

## PUTing the image to S3

Next we need to send the image to S3. First S3 needs to be configured with the correct credentials.

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

import dotenv from 'dotenv'

dotenv.config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})
```

Then the image buffer data can be sent to S3 using the `PutObjectCommand`. Since the images in S3 all need to have unique names, we can use the crypto library to generate a unique unguessable name.

```js
import crypto from 'crypto'

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.post('/posts', upload.single('image'), async (req, res) => {
  const file = req.file 
  const caption = req.body.caption

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  // Configure the upload details to send to S3
  const fileName = generateFileName()
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: file.mimetype
  }

  // Send the upload to S3
  await s3Client.send(new PutObjectCommand(uploadParams));

  // Save the image name to the database. Any other req.body data can be saved here too but we don't need any other image data.
  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
    }
  })

  res.send(post)
})
```

## Generating signed URL

Once the images are being successfully uploaded to S3, we need to generate a signed URL so the client can GET the image from S3. The database only stores the image name, so we generate a signed URL using the image name.

```js
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

app.get("/", async (req, res) => {
  const posts = await prisma.posts.findMany({ orderBy: [{ created: 'desc' }] }) // Get all posts from the database

  for (let post of posts) { // For each post, generate a signed URL and save it to the post object
    post.imageUrl = await getSignedUrl(
      s3Client,
      GetObjectCommand({
        Bucket: bucketName,
        Key: imageName
      }),
      { expiresIn: 60 }// 60 seconds
    )
  }

  res.send(posts)
})
```

https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/


Then any client can GET the image from S3 using the signed URL in the `src` of an `img` tag.

## DELETEing the image from S3

If you want to delete the image from S3, you can use the `DeleteObjectCommand` passing in the image name, then delete the corresponding post from the database.

```js
app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  const deleteParams = {
    Bucket: bucketName,
    Key: post.imageName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams))

  await prisma.posts.delete({where: {id}})
  res.send(post)
})
```
