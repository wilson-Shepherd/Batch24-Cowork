import { useState, useEffect } from 'react';
import axios from 'axios';
import './Check.css';

const API_BASE_URL = 'http://localhost:3000';

const Check = () => {
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextPageExists, setNextPageExists] = useState(true);

  const fetchUrls = async (page) => {
    try {
      setLoading(true);
      console.log(`Fetching URLs for page: ${page}`);
      const response = await axios.get(`${API_BASE_URL}/api/1.0/shortUrl?paging=${page}`);
      console.log('Raw API Response:', response);
      console.log('API Response data:', response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setUrls(response.data.data);
        setNextPageExists(response.data.next_page !== null && response.data.next_page !== undefined);
        setError('');
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('Received invalid data from server');
        setUrls([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching short URLs:', error);
      setLoading(false);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received');
        setError('No response from server');
      } else {
        console.error('Error details:', error.message);
        setError('Error setting up request');
      }
    }
  };

  useEffect(() => {
    console.log('useEffect triggered. Current page:', currentPage);
    fetchUrls(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    const term = e.target.value;
    console.log('Search term changed:', term);
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (nextPageExists) {
      console.log('Moving to next page');
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      console.log('No next page available');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      console.log('Moving to previous page');
      setCurrentPage(prevPage => prevPage - 1);
    } else {
      console.log('Already on the first page');
    }
  };

  const filteredUrls = urls.filter(url =>
    url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered URLs:', filteredUrls);

  return (
    <div className="check-container">
      <h1>My Short URLs</h1>
      <input
        type="text"
        placeholder="Search URLs..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : filteredUrls.length > 0 ? (
        <ul className="url-list">
          {filteredUrls.map(url => {
            console.log('Rendering URL item:', url);
            return (
              <li key={url.id} className="url-item">
                <div className="url-item-content">
                  <div className="url-details">
                    <p><strong>Original:</strong> {url.longUrl}</p>
                    <p><strong>Short:</strong> <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></p>
                  </div>
                  <span className="click-count">Clicks: {url.clickCount}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No shortened URLs found.</p>
      )}
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 0} className="pagination-button">Previous</button>
        <button onClick={handleNextPage} disabled={!nextPageExists} className="pagination-button">Next</button>
      </div>
    </div>
  );
};

export default Check;
