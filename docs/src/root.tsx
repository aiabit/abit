// import {
//   A,
//   Body,
//   ErrorBoundary,
//   FileRoutes,
//   Head,
//   Html,
//   Meta,
//   Routes,
//   Scripts,
//   Title,
// } from '@abitjs/react';
import { Body, Meta, Scripts } from '@abitjs/react';
// import { Suspense } from 'react';
// import './root.css';
// import { Body, Head, Html } from '@abitjs/react';

export default function Root() {
  return (
    <html lang="en">
      <head>
        {/* <script type="module" src="/@vite/client"></script> */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Abitjs</title>
        <Meta />
      </head>
      <Body>
        <div id="app">
          <div>hello world</div>
        </div>
        <Scripts />
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
      import { injectIntoGlobalHook } from "/@react-refresh";
      injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      `,
          }}></script>
        <script type="module" src="/src/entry.client.tsx"></script>
      </Body>
    </html>
  );
}
