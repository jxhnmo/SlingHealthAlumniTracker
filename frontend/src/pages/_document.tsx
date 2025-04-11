import { Html, Head, Main, NextScript } from 'next/document'
import Helmet from "react-helmet";

export default function Document() {
  const FILE_UPLOAD_API = process.env.SIMPLE_FILE_UPLOAD_API;
  const srcurl = "https://app.simplefileupload.com/buckets/" + FILE_UPLOAD_API + ".js";

  return (
    <Html lang="en">
      <Head>
        <Helmet>
          {/* <script async src={srcurl} type="text/javascript" /> */}
          {/* <script async src="https://app.simplefileupload.com/buckets/ee5fd30cbfd7939d9e52b522e52a6775.js"></script> */}
        </Helmet>
      </Head>
      {/* <Head /> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
