# [Deleting files from S3 and CloudFront | Invalidate CloudFront Cache](https://youtu.be/lZAGIy1e3JA)


[![Deleting files from S3 and CloudFront | Invalidate CloudFront Cache](https://img.youtube.com/vi/lZAGIy1e3JA/0.jpg)](https://www.youtube.com/embed/lZAGIy1e3JA)


https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudfront/index.html

> Install and import the CloudFront client

```sh
npm i @aws-sdk/client-cloudfront
```

```js
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
```

> Create a CloudFront object

```js
const cloudfrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID

const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  }
});
```

> Create an invalidation command

```js
const cfCommand = new CreateInvalidationCommand({
  DistributionId: cloudfrontDistributionId,
  InvalidationBatch: {
    CallerReference: post.imageName,
    Paths: {
      Quantity: 1,
      Items: [
        "/" + post.imageName
      ]
    }
  }
})

const response = await cloudfront.send(cfCommand)
```
