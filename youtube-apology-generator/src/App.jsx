import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';


function App() {
  const [confession, setConfession] = useState('');
  const [apology, setApology] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleGenerate = async () => {
    if (!confession.trim()) return;

    setLoading(true);
    setApology(''); // Clear previous apology

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-apology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confession }),
      });

      const data = await res.json();
      setApology(data.apology || 'No apology returned. Try again.');
    } catch (err) {
      console.error('Error generating apology:', err);
      setApology('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>YouTube Apology Generator</h1>
      <h2 className="description">
        For when you're cooked, this is your <span style={{ color: '#D72638' }}>redemption arc.</span>
      </h2>

      <input
        type="text"
        placeholder="What did you do this time?"
        value={confession}
        onChange={(e) => setConfession(e.target.value)}
      />

      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Apology'}
      </button>

      {apology && (
        <>
          <div className="apology-box">
            <h2>Your Apology</h2>
            <p>{apology}</p>
          </div>

          <div className="video-button">
            <button onClick={() => navigate('/record', { state: { script: apology } })}>
              Want to record your apology video now?
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;