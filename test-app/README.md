This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Setup for Module Testing

This app already has a built-in import for `@tl-its-umich-edu/react-ga-onetrust-consent` module as a reference to the parent directory in `package.json`, so it is easy to locally run any code changes made to the module code in the parent directory *react-ga-onetrust-consent*. 

## Initial Code Configuration

This project requires a Google Analytics Id, which can be pasted in the config for useGoogleAnalytics hook on [App.tsx](/test-app/src/App.tsx). This app uses React Router Dom to serve multiple web pages with different URLS (currently only two, homepage at `/` and Page2 at `/page2/`). Once the ID is given as a prop to the hook, clicking the link to go between pages should result in tracking the page views. 

The U-M Consent banner should appear, regardless of the user's location. Controlling this behavior can be configured in the settings for `initializeConsentManager`on [App.tsx](/test-app/src/App.tsx). An `alwaysShow` value of `false` will cause the banner to only appear for EU members, otherwise approving cookie tracking for all other users.

## Setting up React and React Router Dom

Directly starting the application out of the box with `npm run start` will lead to React hook errors. These conflicts due to the app having multiple versions of React and React Router Dom upon importing the module. This can be fixed by having the module **directly reference the local-app's version of react & react-router-dom**.

To properly set up the right versions of react in the module:

1. In the *test-app* directory AND the parent directory *react-ga-onetrust-consent*, run `npm install`
2. In the *react-ga-onetrust-consent* directory, run: `npm link test-app/node_modules/react test-app/node_modules/react-router-dom`
3. In the *react-ga-onetrust-consent* directory, run `npm run build`

At this point, the app is ready to be run on localhost, with the module using the correct version of React and React Router Dom. Whenever a code change is made to the module, make sure to run `npm run build` to update the necessary Typescript code that the app uses.

## Testing local changes

After the module code is configured, the app can simply be run with npm commands in the *local-app* directory:

1. Build step `npm run build`
2. Start step `npm run start`

The application will run on localhost:3000 if not otherwise used by another application.

## Troubleshooting

If the app has problems running react hooks such as `useLocation` or `useState`, that could be a sign that there is a version conflict with React or React Router Dom. Try troubleshooting by deleting `node_modules` and `package-lock.json` from BOTH the app and module directories. Then attempt to reconfigure the modules with symlink in the steps above. If this does not help the problem try using `npm unlink` to sever all symlinks given in the set up instructions and delete + reinstall node_modules again.