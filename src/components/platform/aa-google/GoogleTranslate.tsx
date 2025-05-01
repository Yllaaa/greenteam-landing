// components/GoogleTranslate.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import Script from "next/script";

declare global {
  interface Window {
    google: any;
  }
}

const GoogleTranslate = () => {

    
  return (
    <>
      <div id="google_translate_element"></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script
        id="google-translate-init"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'auto',
                includedLanguages: 'en,es,fr,de',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `,
        }}
      />
    </>
  );
};

export default GoogleTranslate;