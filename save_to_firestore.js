// saveToFirestore.js
const admin = require('firebase-admin');

// Replace 'path/to/your/serviceAccountKey.json' with the actual path to your service account key JSON file
const serviceAccount = require('./deductive-cider-407703-879c8524d343.json');

// Replace 'your-project-id' with your actual Firestore project ID
const projectId = 'deductive-cider-407703';

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