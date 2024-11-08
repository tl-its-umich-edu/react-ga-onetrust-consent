# react-ga-onetrust-consent

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
The module for this code is currently only accessible via a direct link to the public github repository. For a safe installation, a git tag is needed in the URL:

```
npm install https://github.com/tl-its-umich-edu/react-ga-onetrust-consent#MAJOR.MINOR.PATCH
```

`#MAJOR.MINOR.PATCH` represents a git tag from this project, where `MAJOR`, `MINOR`, and `PATCH` represent the corresponding numbers in the latest version iteration of the code. [See recent tags](https://github.com/tl-its-umich-edu/react-ga-onetrust-consent/tags) to pull the latest version. Alternatively, a branch name can be included here instead (useful for testing code updates in-progress).

This project was initially built to be released on the Github Package Repository (GPR). However, requiring a personal access token seemed too cumbersome for public usage. Directly installing the github repo is the selected alternative that was deemed sufficient as of 2024 (see [discussion](https://github.com/orgs/community/discussions/19037#discussioncomment-9579768)). Until the issues of GPR usage are fixed, there are no immediate plans to publish a publicly-accessible npm package.

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

alternatively, if the application is in Typescript:

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
To contribute to this codebase, follow the instructions below to set up the development environment.

**Forking & Build Steps**

Developers can choose to clone the repository: 

```git clone https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git```

Or alternatively, developers can [create a fork](https://cli.github.com/manual/gh_repo_fork) of the repo to begin development, using the GitHub CLI Tool ([Installation steps](https://github.com/cli/cli#installation))

```gh repo fork https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git --clone```

Install dependencies: `npm install `

Run the build to compile typescript files: `npm run build `

**Integration Testing**

Once a branch with code changes is ready to test, developers can integrate the module into a separate codebase on their machine. 

Use the same github installation technique from [Installation](#Installation) except use the `branch_name` instead of git tag, and the personal github username instead of the tl-its organization name (if working on a fork). On the other local project, install via github URL:

```
npm install https://github.com/<github-username>/react-ga-onetrust-consent#branch_name
```

At this point, the module can be imported and used the same way as in the [Usage](#Usage) section above.


# Testing
To run tests, use the following command:

```npm test ```

This project uses Jest as the testing framework, with `ts-jest` for additional typescript support. Make sure any new features or changes include appropriate tests.

# Releasing, Versioning



There is currently no implementation regarding releases and/or package publishing. The only versioning steps required are to update the npm package and create the corresponding tag. In the future this could be used to kick off a release and publishing step.

While making code changes, make sure the npm package version is updated according to the added changes. 

```npm version <update_type>```

Where `update_type` is either `patch`, `minor`, or `major`. The corresponding number in the version `MAJOR.MINOR.PATCH` will be automatically incremented and the change will commit to the branch. See more about [semantic versioning](https://docs.npmjs.com/about-semantic-versioning#incrementing-semantic-versions-in-published-packages).

Once the corresponding pull request is merged, the main branch can be tagged. Using the npm iterated package version, an associated tag can be created locally like so:
 ```
 git checkout main
 git tag vMAJOR.MINOR.PATCH
 ```

Where `MAJOR`, `MINOR`, and `PATCH` are the corresponding numbers of the new npm version. Then push the tags to the remote repository: 

```git push origin vMAJOR.MINOR.PATCH```


# License
This project is licensed under the terms of the Apache-2.0 license. See the LICENSE file for details.

