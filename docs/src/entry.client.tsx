import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AbitBrowser from './root';

export const hydrate = () => {
  const Browser = () => (
    <StrictMode>
      <AbitBrowser />
    </StrictMode>
  );
  // if (import.meta.hot) {
  //   hydrateRoot(
  //     document,
  //     <StrictMode>
  //       <AbitBrowser />
  //     </StrictMode>,
  //   );
  // } else {
  const root = createRoot(document as any);
  root.render(<Browser />);
  // hydrateRoot(document, <Browser />);
  // }
};

window.setTimeout(hydrate, 1);
