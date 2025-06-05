const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const { YoutubeTranscript } = require('youtube-transcript'); //import from lib

app.use(cors());
app.use(express.json());

// POST endpoint to handle transcript requests
// sends back transcript string
app.post('/api/transcript', async (req, res) => {
  const { videoUrl } = req.body;
  console.log('Received URL:', videoUrl); // prints full vid URL

  try {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log('Video ID:', videoId);

    //method from lib
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);

    const fullTranscript = transcriptArray.map(line => line.text).join(' ');

    res.json({
      videoUrl,
      transcript: fullTranscript,
      summary: 'Summary soon' // placeholder
    });
  } catch (err) {
    console.error('Transcript error:', err);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// extract video ID from YouTube URL
function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    } else if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.substring(1);
    }
  } catch (e) {
    return null;
  }
}

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
