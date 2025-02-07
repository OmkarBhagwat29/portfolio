import Script from "next/script";
import React from "react";

const page = () => {
  return (
    <>
      <Script
        src="/javascript/function-declarations.js"
        strategy="afterInteractive"
      />
    </>
  );
};

export default page;
