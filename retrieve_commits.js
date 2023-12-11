const express = require('express');
const axios = require('axios');
const saveToFirestore = require('./save_to_firestore.js'); // Import the saveToFirestore module

const app = express();
const port = 8085;

const githubAPIEndpoint = 'https://api.github.com/repos/nodejs/node/commits';

// Route to fetch commit frequency
app.get('/retireve-commits', async (req, res) => {
  const targetDate = req.query.targetDate; // Add a query parameter for the target date

  try {
    // Fetch commits from GitHub API
    const commits = await fetchCommitsUntilDate(githubAPIEndpoint, targetDate);
    console.log("Commits since ",targetDate," successfully fetched from github.");

    // Save data to Firestore using the saveToFirestore function
    await saveToFirestore(commits);
    console.log("Commits successfully updated in firestore.");

    res.json("Commits successfully updated in firestore.");
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to fetch commits until a specific date
async function fetchCommitsUntilDate(apiEndpoint, targetDate) {
  let page = 1;
  let cutoff = 0;
  let commits = [];
  let commitsOnOrBeforeCutoff = []

  while (true) {
    const url = `${apiEndpoint}?page=${page}`;
    try {
      const response = await axios.get(url);

      // Check if the response is empty or if the commits array is already beyond the target date
      if (response.data.length === 0 || new Date(response.data[response.data.length - 1].commit.author.date) < new Date(targetDate)) {
        cutoff++;
      }

      // Concatenate the new commits to the existing array
      commits = commits.concat(response.data);

      if (cutoff === 1){
        break;
      }

      // Increment the page number for the next request
      page++;
    } catch (error) {
      console.error('Error fetching commits:', error.message);
      break;
    }
  }

  console.log("Before cutting length: ", commits.length);

  // Filter commits to keep only those on or before the cutoff date
  commitsOnOrBeforeCutoff = commits.filter(commit =>
    new Date(commit.commit.author.date) >= new Date(targetDate)
  );
  console.log("after cutting length: ", commitsOnOrBeforeCutoff.length);

  return commitsOnOrBeforeCutoff;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
