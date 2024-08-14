# react-ga-onetrust-consent
React implementation of OneTrust consent banner integrated with Google Analytics signals.

# Installation
You can install this package via GitHub Packages. Add the following configuration to your .npmrc file to use GitHub Packages registry:

```sh @tl-its-umich-edu:registry=https://npm.pkg.github.com //npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN ```

Then install the package:

```sh npm install @tl-its-umich-edu/react-ga-onetrust-consent ```

Usage
Here's a quick example on how to use this package in your React application:

```
jsx import React from 'react'; import { useGoogleAnalytics } from '@tl-its-umich-edu/react-ga-onetrust-consent'; import { BrowserRouter as Router } from 'react-router-dom';

const App = () => { useGoogleAnalytics({ googleAnalyticsId: 'YOUR_GOOGLE_ANALYTICS_ID', oneTrustScriptDomain: 'YOUR_ONETRUST_DOMAIN', debug: true, nonce: 'YOUR_NONCE' });

return (
    <Router>
        <div>
            <h1>Welcome to My App</h1>
        </div>
    </Router>
);
};

export default App;
```

# Development
To contribute to this package, follow the instructions below to set up your development environment.

Build Steps
Clone the repository: ```sh git clone https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git cd react-ga-onetrust-consent ```

Install dependencies: ```sh npm install ```

Run the build: ```sh npm run build ```

# Testing
To run tests, use the following command:

```sh npm test ```

We are using Jest as our testing framework. Make sure any new features or changes include appropriate tests.

# Releasing
We use GitHub Actions to automate the release process. When you are ready to cut a new release, follow these steps:

Create a new tag: ```sh git tag -a vX.Y.Z -m "Release version X.Y.Z" ```

Push the tags to the repository: ```sh git push origin vX.Y.Z ```

Once you push a new tag, GitHub Actions will automatically run the tests and publish the package to GitHub Packages if all tests pass.

# License
This project is licensed under the terms of the Apache-2.0 license. See the LICENSE file for details.

