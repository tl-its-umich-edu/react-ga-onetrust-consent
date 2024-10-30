 local # react-ga-onetrust-consent

React implementation of OneTrust consent banner integrated with Google Analytics signals. Initially built to support analytics-enabled University of Michigan Teaching & Learning applications, this logic using Google Analytics tracking alongside OneTrust consent verification is written to be properly standardized; We will aim to iterate on this project such that it could be shared with other Umich web apps that utilize React and Google Analytics. 

For more information on the University of Michigan's technical implementation of OneTrust, see the OVPC Digital team's [instructions on cookie disclosures](https://vpcomm.umich.edu/resources/cookie-disclosure/).

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Releasing](#releasing)
- [License](#license)

# Overview


React projects built with either Typescript or Javascript are able to utilize this code. Applications should import and apply the hook `useGoogleAnalytics` at the root level of App component. Upon initializing with the proper settings, this hook will call upon the `useOneTrust` hook which initializes the consent banner and captures user preferences.

Beyond simply loading a script for the banner, the `useOneTrust` hook also writes a callback to properly emit settings changes to Google Analytics and delete Google Analytics cookies if tracking is denied (EU countries only). To get a better understanding how OneTrust and Google Analytics work together, see the [UMich Google Analytics implementation instructions](https://vpcomm.umich.edu/resources/cookie-disclosure/#3rd-party-google-analytics).

Keep in mind that the consent banner has a privacy hyperlink that redirects to a `/privacy/` path on the current application's web domain. Be sure to implement a privacy page or redirect the application appropriately.


# Installation
The package is accessible via the GitHub Package Registry. To install, the npm command will require the exact version number of the package needed:

```
npm install https://github.com/tl-its-umich-edu/react-ga-onetrust-consent#MAJOR.MINOR.PATCH
```

Where `MAJOR`, `MINOR`, and `PATCH` represent the corresponding numbers in the recent version of this package.

The above method does not follow protocols listed in the Github Packages documentation requiring a local `.npmrc` file. However, because this project is public, directly installing should be working as of 2024 (see [discussion](https://github.com/orgs/community/discussions/19037#discussioncomment-9579768)). If this method does not work in the future, developers may need to generate a personal access token for the purpose of installing Node packages from GPR. For more information, see the [npm Documentation for Github Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

For Typescript projects, be sure to import the types:

```
npm install --save-dev @types/react-ga-onetrust-consent
```

# Usage

As explained in the [overview](#overview) above, the `useGoogleAnalytics` hook will run at the root of the App component. If the application uses `react-router`, be sure that App is a child of the router component such as `<Router>` or `<BrowserRouter>`.

Before the use of this code, prepare the variables necessary before the code runs any scripts:
   1) Google Analytics Id
   2) OneTrust Domain Script Id
   3) Nonce (optional)

Here's an example of how this would be executed in an app using `react-router`:

### index.js

```
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Router basename='/'>
        <App>
    </Router>
);
```

### App.js
```
import React from 'react'; 
import { useGoogleAnalytics } from '@tl-its-umich-edu/react-ga-onetrust-consent'; 
import { Routes } from 'react-router-dom';
import App from 'App'

const App = () => { 
    useGoogleAnalytics({ 
        googleAnalyticsId: '<GOOGLE_ANALYTICS_ID>', 
        oneTrustScriptDomain: '<ONETRUST_DOMAIN>', 
        debug: false, 
        nonce: '<NONCE>' });

    return (
        <Routes>
            <Route> ... </Route>
            <Route> ... </Route>
            <Route> ... </Route>
        </Routes>
    );
};

export default App;
```

alternatively, if your application is in Typescript:

```

import React from 'react';
import { useGoogleAnalytics } from '@tl-its-umich-edu/react-ga-onetrust-consent';
import { Routes, Route } from 'react-router-dom';

interface AppProps {
  googleAnalyticsId: string;
  oneTrustScriptDomain: string;
  nonce?: string;
  debug?: boolean;
}

const App: React.FC<AppProps> = ({
  googleAnalyticsId,
  oneTrustScriptDomain,
  nonce,
  debug = false,
}) => {
  useGoogleAnalytics({
    googleAnalyticsId,
    oneTrustScriptDomain,
    nonce,
    debug,
  });

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;

// Example component imports
const Home: React.FC = () => <div>Home Page</div>;
const About: React.FC = () => <div>About Page</div>;
const Contact: React.FC = () => <div>Contact Page</div>;

```

# Development
To contribute to this package, follow the instructions below to set up the development environment.

**Build Steps**

Developers can choose to clone the repository: 

```git clone https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git```

Or alternatively, developers can [create a fork](https://cli.github.com/manual/gh_repo_fork) of the repo to begin development, using the GitHub CLI Tool ([Installation steps](https://github.com/cli/cli#installation))

```gh repo fork https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git --clone```

Install dependencies: `npm install `

Run the build: `npm run build `

# Testing
To run tests, use the following command:

```npm test ```

We are using Jest as our testing framework, with `ts-jest` for additional typescript support. Make sure any new features or changes include appropriate tests.

# Releasing
We use GitHub Actions to automate the release and package publishing process. When the project is ready for a new package deployment, follow these steps:

While making code changes, make sure the npm package version is updated according to the added changes. 

```npm version <update_type>```

Where `update_type` is either patch, minor, or major. The corresponding number in the version `MAJOR.MINOR.PATCH` will be incremented. See more about [semantic versioning](https://docs.npmjs.com/about-semantic-versioning#incrementing-semantic-versions-in-published-packages).

Once the pull request is merged, the most recent commit on master should be tagged for release. Using the npm iterated package version, create an associated tag, for example:

 ```git tag vMAJOR.MINOR.PATCH```

Where `MAJOR`, `MINOR`, and `PATCH` are the corresponding numbers of the new npm version Then push the tags to the repository: 

```git push origin vMAJOR.MINOR.PATCH```

Once a new tag is pushed, GitHub Actions will automatically create a new release based on the tag. The release creation will then kick off publishing workflow to Github Package Repository if the build succeeds and all tests pass.

If any step of the publishing workflow fails, either try to remove the tag (both remote and locally) and re-instate the same version or start over the tagging process with another PATCH iteration.

# License
This project is licensed under the terms of the Apache-2.0 license. See the LICENSE file for details.

