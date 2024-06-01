import { useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
        const response = await axios.post('http://localhost:3000/api/1.0/shortUrl', {
            longUrl,
        });

        const { id } = response.data;

        const shortUrlResponse = await axios.get(`http://localhost:3000/api/1.0/shortUrl/${id}`);
        setShortUrl(shortUrlResponse.data.shortUrl);
    } catch (error) {
        console.error('Error generating short URL:', error);
        setError('Error generating short URL');
    }
};


  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Short URL copied to clipboard!');
  };

  return (
    <div className="container">
      <h1>My Short URL Website</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Long URL: 
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </label>
        <button type="submit">Short My URL</button>
      </form>
      {shortUrl && (
        <div className="result">
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <button onClick={handleCopy}>Copy</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;
