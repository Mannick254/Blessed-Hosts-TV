const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'nicksonokoth/Blessed-Hosts-TV';

app.post('/publish', async (req, res) => {
  const { section, entry } = req.body;
  const path = `data/${section}.json`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  try {
    const fileRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const file = await fileRes.json();
    const content = JSON.parse(Buffer.from(file.content, 'base64').toString());
    content.push(entry);

    const updateRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add new ${section} entry`,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha: file.sha
      })
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish to GitHub' });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
require('dotenv').config(); // Load .env variables
