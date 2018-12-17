// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
//  apiBaseUrl: 'https://ancient-inlet-21376.herokuapp.com',
  apiBaseUrl: 'http://localhost:8080',

  firebase: {
      apiKey: "AIzaSyBI0QwCt_Qik8Fim_W96SChVU-fK2y72zw",
      authDomain: "versatile-auto.firebaseapp.com",
      databaseURL: "https://versatile-auto.firebaseio.com",
      projectId: "versatile-auto",
      storageBucket: "versatile-auto.appspot.com",
      messagingSenderId: "747390657064"
    }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
