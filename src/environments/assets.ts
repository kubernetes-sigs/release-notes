declare var require : any;

function getFiles(bucketName = 'kubernetes-release-gcb') {
  // [START storage_list_files]
  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const bucketName = 'Name of a bucket, e.g. my-bucket';

  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();
  var files = [];
  async function listFiles() {
    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();

    console.log('Files:');
    files.forEach(file => {
      console.log(file.name);
      files.Push(file.name);
    });
  }

  listFiles().catch(console.error);
  return files;
  // [END storage_list_files]
}

export const assets = getFiles()