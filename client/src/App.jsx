import { useState } from 'react';

function App() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted URL:', videoUrl);
    //send to backend here
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>YouTube Video Notes Extractor</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">YouTube URL:</label>
        <input
          id="url"
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Get Notes
        </button>
      </form>
    </div>
  );
}

export default App;
