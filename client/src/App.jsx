import { useState } from 'react';
import jsPDF from 'jspdf';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscript('');

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('YouTube URL and Full Transcript', 12, 22);

    doc.setFontSize(12);
    doc.text(`Video URL: ${videoUrl}`, 12, 32);

    doc.setFontSize(16);
    doc.text('Transcript:', 12, 44);

    const splitTranscript = doc.splitTextToSize(transcript || 'Transcript unavailable', 180);
    doc.setFontSize(12);
    doc.text(splitTranscript, 12, 54);

    doc.save('youtube-transcript.pdf');
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
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <h2>Transcript</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{transcript}</p>
        </div>
      )}

      {transcript && (
        <button onClick={exportToPDF} style={{ marginTop: '1rem' }}>
          Export Transcript as PDF
        </button>
      )}
    </div>
  );
}

export default App;
