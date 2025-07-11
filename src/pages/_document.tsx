// src/pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Google Tag Manager */}
                    <Script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-24841MCD9Z"
                    ></Script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-24841MCD9Z');
              `,
                        }}
                    />
                    {/* End Google Tag Manager */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;