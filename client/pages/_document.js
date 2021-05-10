import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <script src="https://www.paypal.com/sdk/js?client-id=AZ4o9RwZIBTiZgwzEBLKdD9YL3e2UUBbB6rwqEqkHjiO695ikNooTcE0uUkwbbjfovt46WEDCMiYpbVZ&vault=true&intent=subscription">
            </script>
        </body>
      </Html>
    )
  }
}

export default MyDocument