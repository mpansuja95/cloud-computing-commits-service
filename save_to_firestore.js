require('dotenv').config();

// saveToFirestore.js
const admin = require('firebase-admin');

// Replace 'path/to/your/serviceAccountKey.json' with the actual path to your service account key JSON file
// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Replace 'your-project-id' with your actual Firebase project ID
const projectId = process.env.PROJECT_ID.projectId;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`,
});

// Function to save data to Firestore
async function saveToFirestore(data) {
  try {
    const db = admin.firestore();

    // Replace 'your-collection' with the desired Firestore collection name
    const collection = db.collection('commits');

    // Save each commit to Firestore
    for (const commit of data) {
        const { sha, ...commitData } = commit; // Extract "sha" from commit
        await collection.doc(sha).set(commitData);
      }

    console.log('Data saved to Firestore successfully.');
  } catch (error) {
    console.error('Error saving data to Firestore:', error.message);
  }
}

module.exports = saveToFirestore;