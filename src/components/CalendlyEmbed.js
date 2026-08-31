"use client";

import Script from "next/script";

export default function CalendlyEmbed() {
  const calendlyUrl = "https://calendly.com/ambreenrashidkhan";

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <div className="calendly-container animate-fade-in">
        <div
          className="calendly-inline-widget service-card"
          data-url={calendlyUrl}
          style={{
            minWidth: "320px",
            height: "700px",
          }}
        />
      </div>
    </>
  );
}