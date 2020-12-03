import { async } from 'rxjs';

declare var gapi : any;


      // 'https://www.googleapis.com/download/storage/v1/b/relnotes-assests/o/release-notes-1.14.0.json?generation=1596471832663965&alt=media',
      // 'https://content-storage.googleapis.com/download/storage/v1/b/relnotes-assests/o/release-notes-1.14.1.json?generation=1596471832426869&alt=media',
  // 'assets/release-notes-1.19.0-rc.3.json',
  // 'assets/release-notes-1.19.0-rc.2.json',
  // 'assets/release-notes-1.18.6.json',
  // 'assets/release-notes-1.17.9.json',
  // 'assets/release-notes-1.16.13.json',
  // 'assets/release-notes-1.19.0-rc.1.json',
  // 'assets/release-notes-1.19.0-rc.0.json',
  // 'assets/release-notes-1.17.8.json',
  // 'assets/release-notes-1.17.7.json',
  // 'assets/release-notes-1.17.6.json',
  // 'assets/release-notes-1.17.5.json',
  // 'assets/release-notes-1.18.5.json',
  // 'assets/release-notes-1.18.4.json',
  // 'assets/release-notes-1.17.4.json',
  // 'assets/release-notes-1.18.3.json',
  // 'assets/release-notes-1.17.3.json',
  // 'assets/release-notes-1.19.0-beta.2.json',
  // 'assets/release-notes-1.19.0-beta.1.json',
  // 'assets/release-notes-1.18.2.json',
  // 'assets/release-notes-1.19.0-beta.0.json',
  // 'assets/release-notes-1.18.1.json',
  // 'assets/release-notes-1.19.0-alpha.3.json',
  // 'assets/release-notes-1.19.0-alpha.2.json',
  // 'assets/release-notes-1.18.0.json',
  // 'assets/release-notes-1.17.2.json',
  // 'assets/release-notes-1.17.1.json',
  // 'assets/release-notes-1.17.0.json',
  // 'assets/release-notes-1.16.6.json',
  // 'assets/release-notes-1.16.5.json',
  // 'assets/release-notes-1.16.4.json',
  // 'assets/release-notes-1.16.3.json',
  // 'assets/release-notes-1.16.2.json',
  // 'assets/release-notes-1.16.1.json',
  // 'assets/release-notes-1.16.0.json',
  // 'assets/release-notes-1.15.9.json',
  // 'assets/release-notes-1.15.8.json',
  // 'assets/release-notes-1.15.7.json',
  // 'assets/release-notes-1.15.6.json',
  // 'assets/release-notes-1.15.5.json',
  // 'assets/release-notes-1.15.4.json',
  // 'assets/release-notes-1.15.3.json',
  // 'assets/release-notes-1.15.2.json',
  // 'assets/release-notes-1.15.1.json',
  // 'assets/release-notes-1.15.0.json',
  // 'assets/release-notes-1.14.10.json',
  // 'assets/release-notes-1.14.9.json',
  // 'assets/release-notes-1.14.8.json',
  // 'assets/release-notes-1.14.7.json',
  // 'assets/release-notes-1.14.6.json',
  // 'assets/release-notes-1.14.5.json',
  // 'assets/release-notes-1.14.4.json',
  // 'assets/release-notes-1.14.3.json',
  // 'assets/release-notes-1.14.2.json',
  // 'assets/release-notes-1.14.1.json',
  // 'assets/release-notes-1.14.0.json',

function getNotes() {

  var notes = [];
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': '<Your API Key>',
    // clientId and scope are optional if auth is not required.
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.request({
      'path': 'https://storage.googleapis.com/storage/v1/b/relnotes-assests/o',
    })
  }).then(function(response) {
    console.log(response.result);
    for (var i = 0; i < response.result.items.length; i++) {
      notes.push(response.result.items[i].mediaLink)
    }

    return notes
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};
// 1. Load the JavaScript client library.

// export default async () => {
//   return notes start();
// }
export const assets = getNotes()
