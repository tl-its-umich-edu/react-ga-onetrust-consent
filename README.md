# react-ga-onetrust-consent

React implementation of OneTrust consent banner integrated with Google Analytics signals. Initially built to support analytics-enabled University of Michigan Teaching & Learning applications, this logic using Google Analytics tracking alongside OneTrust consent verification is written to be properly standardized; We will aim to iterate on this project such that it could be shared with other UofM web apps that utilize React and Google Analytics. 

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


Applications should import and apply the hook `useGoogleAnalytics` at the root level of App in the DOM. Upon initializing with the proper settings, this hook will call upon the `useOneTrust` hook which initializes the consent banner and captures user preferences.

Beyond simply loading a script for the banner, the `useOneTrust` hook also writes a callback to properly emit settings changes to Google Analytics and delete Google Analytics cookies if tracking is denied (EU countries only). To get a better understanding how OneTrust and Google Analytics work together, see the [UofM Google Analytics implementation instructions](https://vpcomm.umich.edu/resources/cookie-disclosure/#3rd-party-google-analytics).

Remember to keep in mind that the consetn banner h


# Installation
You can install this package via GitHub Packages. Add the following configuration to your .npmrc file to use GitHub Packages registry:

`@tl-its-umich-edu:registry=https://npm.pkg.github.com //npm.pkg.github.com/:_authToken=YOUR_PERSONAL_ACCESS_TOKEN `

Then install the package:

`npm install @tl-its-umich-edu/react-ga-onetrust-consent `

You will then need to add environment variables to your application such that 

# Usage

Here's a quick example on how to use this package in your React application:

```
jsx import React from 'react'; import { useGoogleAnalytics } from '@tl-its-umich-edu/react-ga-onetrust-consent'; import { BrowserRouter as Router } from 'react-router-dom';

const App = () => { 
    useGoogleAnalytics({ googleAnalyticsId: 'YOUR_GOOGLE_ANALYTICS_ID', oneTrustScriptDomain: 'YOUR_ONETRUST_DOMAIN', debug: true, nonce: 'YOUR_NONCE' });

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

**Build Steps**

You can choose to clone the repository: 

```git clone https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git```

Or alternatively, you may want to [create your own fork](https://cli.github.com/manual/gh_repo_fork) of the repo to begin development, using the GitHub CLI Tool ([Installation steps](https://github.com/cli/cli#installation).)

```gh repo fork https://github.com/tl-its-umich-edu/react-ga-onetrust-consent.git --clone```

Install dependencies: `npm install `

Run the build: `npm run build `

# Testing
To run tests, use the following command:

```npm test ```

We are using Jest as our testing framework. Make sure any new features or changes include appropriate tests.

# Releasing
We use GitHub Actions to automate the release process. When you are ready to cut a new release, follow these steps:

Create a new annotated tag, for example:

 ```git tag -a YYYY.MINOR.MICRO -m "Release version YYYY.MINOR.MICRO: Example tag annotation description" ```

Where `YYYY.MINOR.MICRO` represent the next iterated version number (see [CalVer](https://calver.org/) versioning standard). Then push the tags to the repository: `git push origin YYYY.MINOR.MICRO `

Once you push a new tag, GitHub Actions will automatically run the tests and publish the package to GitHub Packages if all tests pass.

# License
This project is licensed under the terms of the Apache-2.0 license. See the LICENSE file for details.

