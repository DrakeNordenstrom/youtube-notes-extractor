//basic backend setup
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//connects backend to python script
const { exec } = require('child_process');
const path = require('path');

app.post('/api/transcript', (req, res) => {
  const videoId = req.body.videoId;
  const scriptPath = path.join(__dirname, '..', 'python', 'fetch_transcript.py');

  exec(`python "${scriptPath}" "${videoId}"`, (err, stdout, stderr) => {
    if (err || stderr) {
      console.error('Exec error:', err || stderr);
      return res.status(500).json({ error: 'Error fetching transcript' });
    }

    try {
      const output = JSON.parse(stdout);
      res.json(output);
    } catch (parseErr) {
      res.status(500).json({ error: 'Error parsing transcript output' });
    }
  });
});
