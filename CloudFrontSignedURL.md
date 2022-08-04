# [CloudFront Signed URLs with Node.js](https://youtu.be/EIYrhbBk7do)


[![CloudFront Signed URLs with Node.js](https://img.youtube.com/vi/EIYrhbBk7do/0.jpg)](https://youtu.be/EIYrhbBk7do)


### Generate RSA Key Pair

https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-trusted-signers.html

> Install OpenSSL on your machine and generate the keypairs

```sh
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

### Sign URLs

https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_cloudfront_signer.html#getsignedurl

> Install and import the cloudfront signer

```sh
npm i @aws-sdk/cloudfront-signer
```

```js
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"
```

> Sign the urls before sending them to the browser

```js
const signedUrl = getSignedUrl({
  keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
  privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
  url: url,
  dateLessThan: new Date( Date.now() + (1000 /*sec*/ * 60))
})
```
