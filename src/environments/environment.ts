// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyB5p8KAn8un-Wwc5-OPmNNfSBuNyOKPatk",
    authDomain: "triathlon-club.firebaseapp.com",
    databaseURL: "https://triathlon-club.firebaseio.com",
    projectId: "triathlon-club",
    storageBucket: "",
    messagingSenderId: "495992756834"
  }
};