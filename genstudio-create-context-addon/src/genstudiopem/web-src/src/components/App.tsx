import React from 'react';
import { Provider, defaultTheme, Heading } from '@adobe/react-spectrum';
import ErrorBoundary from 'react-error-boundary';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ExtensionRegistration from './ExtensionRegistration';
import AdditionalContextDialog from './AdditionalContextDialog';

const ErrorFallback = () => (
  <Heading level={1}>Something went wrong!</Heading>
);

const App = (): React.JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider theme={defaultTheme} colorScheme="light">
        <Router>
          <Routes>
            <Route path="/" element={<ExtensionRegistration />} />
            <Route path="/additional-context-dialog" element={<AdditionalContextDialog />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 