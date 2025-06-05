import { useState } from 'react';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscript('');
    setSummary('');

    try {
      const response = await fetch('http://localhost:3001/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.transcript);
      setSummary(data.summary); // Currently placeholder
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto', textAlign: 'center' }}>
      <h1>YouTube Video Notes Extractor</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label htmlFor="url">YouTube URL:</label>
        <input
          id="url"
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Loading...' : 'Get Notes'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {transcript && (
        <div>
          <h2>Transcript</h2>
          <p style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{transcript}</p>
        </div>
      )}

      {summary && (
        <div>
          <h2>Summary</h2>
          <p style={{ textAlign: 'left' }}>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
