import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const FILE_UPLOAD_API = process.env.SIMPLE_FILE_UPLOAD_API;
  const srcurl = "https://app.simplefileupload.com/buckets/" + FILE_UPLOAD_API + ".js"
  return (
    <Html lang="en">
      <Head>

        <script src={srcurl}></script>
      </Head>
      {/* <Head /> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
