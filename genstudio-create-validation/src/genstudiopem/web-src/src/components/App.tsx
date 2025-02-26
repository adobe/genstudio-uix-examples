/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';
import { Provider, defaultTheme, Heading } from '@adobe/react-spectrum';
import ErrorBoundary from 'react-error-boundary';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ExtensionRegistration from './ExtensionRegistration';
import RightPanel from './RightPanel';

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
            <Route path="/right-panel" element={<RightPanel />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App; 