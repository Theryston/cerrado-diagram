import Script from "next/script";

export function GoogleAdSense() {
  return (
    <Script
      id="nextjs-google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
