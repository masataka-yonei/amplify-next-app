'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

// CSSをクライアントサイドでのみ読み込むようにする
const SwaggerUICSS = () => {
  if (typeof window !== 'undefined') {
    require('swagger-ui-react/swagger-ui.css');
  }
  return null;
};

export default function SwaggerUIPage() {
  return (
    <div>
      <SwaggerUICSS />
      <h1>API Documentation</h1>
      <SwaggerUI url="/swagger.json" />
    </div>
  );
}
