# react-ga-onetrust-consent

React tooling that enables Umich consent banner integrated with Google Analytics signals. Initially built to support analytics-enabled University of Michigan Teaching & Learning applications, this logic using Google Analytics tracking as well as consent approval/denial to be properly standardized; We will aim to iterate on this project such that it could be shared with other Umich web apps that utilize React and Google Analytics. 

For more information on the University of Michigan's technical implementation of the banner, see the OVPC Digital team's [instructions on cookie disclosures](https://vpcomm.umich.edu/resources/cookie-disclosure/).

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Releasing](#releasing)
- [License](#license)

# Overview


React projects built with either Typescript or Javascript are able to utilize this code. Applications should import and apply the hook `useGoogleAnalytics` at the root level of App component. Upon initializing with the proper settings, this hook will return handler functions that can be applied to the `useUmConsent` hook which initializes the consent banner and captures user preferences.

Upon calling the `initializeConsentManager` method from the `useUmConsent` hook, some configuration settings are given to customize the banner, including whether the banner runs for all users or only EU users, which is required by [GDPR](https://gdpr.eu/what-is-gdpr/). The handler functions `gaHandlers` will properly emit settings changes to Google Analytics and delete Google Analytics cookies if tracking is denied. To get a better understanding how Google Analytics works with this script, see the [UMich Google Analytics implementation instructions](https://vpcomm.umich.edu/resources/cookie-disclosure/#3rd-party-google-analytics).

Keep in mind that the consent banner has a privacy hyperlink that, by default, redirects to a `/privacy/` path on the current application's web domain. This can be changed in the `initializeConsentManager` parameters, so be sure to implement a privacy page or redirect the application appropriately.


# Installation
The module for this code is currently only accessible via a direct link to the public github repository. For a safe installation, a git tag is needed in the URL:

```
npm install https://github.com/tl-its-umich-edu/react-ga-onetrust-consent#MAJOR.MINOR.PATCH
```

`#MAJOR.MINOR.PATCH` represents a git tag from this project, where `MAJOR`, `MINOR`, and `PATCH` represent the corresponding numbers in the latest version iteration of the code. [See recent tags](https://github.com/tl-its-umich-edu/react-ga-onetrust-consent/tags) to pull the latest version. Alternatively, a branch name can be included here instead (useful for testing code updates in-progress).

This project was initially built to be released on the Github Package Repository (GPR). However, requiring a personal access token seemed too cumbersome for public usage. Directly installing the github repo is the selected alternative that was deemed sufficient as of 2024 (see [discussion](https://github.com/orgs/community/discussions/19037#discussioncomment-9579768)). Until the issues of GPR usage are fixed, there are no immediate plans to publish a publicly-accessible npm package.

# Usage

As explained in the [overview](#overview) above, the `useGoogleAnalytics` and `useUmConsent` hooks will run at the root of the App component. If the application uses `react-router-dom`, be sure that App is a child of the router component `<BrowserRouter>` (usually imported as `Router`). Before the use of the Google Analytics hook, be sure to have the proper Google Analytics Id for the project you are using. 

For the U-M consent manager, settings such as `alwaysShow` and `developmentMode` can alter the behavior of the script. To learn more about these script settings see the [U-M Cookie Disclosure page](https://vpcomm.umich.edu/resources/cookie-disclosure/) under 'Banner Integration'.

Here's an example of how this would be executed in an app using `react-router-dom`:

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
    const { gaInitialized, gaHandlers } = useGoogleAnalytics({
    googleAnalyticsId: 'G-XXXXXXXX', // your Google Analytics ID
    debug: false,
  });

  const { umConsentInitialize, umConsentInitialized } = useUmConsent();

  if (
    !umConsentInitialized &&
    gaInitialized &&
    gaHandlers.onConsentApprove &&
    gaHandlers.onConsentReject
  ) {
    const consentParams = {
      developmentMode: false,
      alwaysShow: false,
      onConsentApprove: gaHandlers.onConsentApprove,
      onConsentReject: gaHandlers.onConsentReject,
    };
    umConsentInitialize(consentParams);
  }


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
  nonce?: string;
}

const App: React.FC<AppProps> = ({
  googleAnalyticsId,
  nonce,
}) => {
  const { gaInitialized, gaHandlers } = useGoogleAnalytics({
      googleAnalyticsId: 'G-XXXXXXXX', // your Google Analytics ID
      debug: false,
    });

    const { umConsentInitialize, umConsentInitialized } = useUmConsent();    
    if ( 
      !umConsentInitialized &&
      gaInitialized &&
      gaHandlers.onConsentApprove &&
      gaHandlers.onConsentReject
      ) {
        const consentParams: InitializeConsentManagerParams = {
            developmentMode: false,
            alwaysShow: false,
            onConsentApprove: gaHandlers.onConsentApprove,
            onConsentReject: gaHandlers.onConsentReject,
        }
        umConsentInitialize(consentParams);
    }


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

```

# Development
To contribute to this codebase, follow the instructions below to set up the development environment.

**Forking & Build Steps**

Developers can choose to clone the repository: 

```git clone https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git```

Or alternatively, developers can [create a fork](https://cli.github.com/manual/gh_repo_fork) of the repo to begin development, using the GitHub CLI Tool ([Installation steps](https://github.com/cli/cli#installation))

```gh repo fork https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git --clone```

Install dependencies: `npm install`

Run the build to compile javascript and typescript files: `npm run build`

**Integration Testing: Local**

During development, you can use the **local-app** directory to simulate a react application using the hooks in this module. Follow the [local-app README](/local-app/README.md) for detailed instructions on this.

Installing this module to other local projects outside of this repo will require symlink using `npm link`. Similar to the **local-app** readme instructions, this module needs to directly link to the **react** and **react-router-dom** packages in your PROJECT's `node_modules` folder. 
1. In the directory for this module, run: `npm link ../<path-to-PROJECT>/node_modules/react ../<path-to-PROJECT>/node_modules/react-router-dom`. Then `npm run build` to generate the needed JS/TS code
2. In the same module directory run `npm link` to set a global npm link to the project name
3. Then in the local project directory, install this module by running `npm link @tl-its-umich-edu/react-ga-onetrust-consent`

Note: running `npm install` will undo links, and it is best to run `npm unlink` to properly sever the symlinks.

**Integration Testing: Github Branch**

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

