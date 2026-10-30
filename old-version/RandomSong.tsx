import { useState } from 'react';
import './RandomSong.css';

interface Song {
  id: number;
  name: string;
  artist: string;
  year: string;
  albumImage: string;
  previewUrl?: string;
  trackUrl: string;
}

export function RandomSong() {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [yearRange, setYearRange] = useState({ start: 1960, end: 2024 });
  const [language, setLanguage] = useState<'hebrew' | 'english' | 'both'>('both');

  const hebrewArtists = [
    'אריק איינשטיין',
    'עידן רייכל',
    'שלמה ארצי',
    'יהודית רביץ',
    'עומר אדם',
    'אביב גפן',
    'חנה גור',
    'עפרה חזה',
    'יעל נעים',
    'אהוד בנאי',
    'דודו טסה',
    'שרית חדד',
    'סטטיק ובן אל',
    'נועה קירל',
    'אייל גולן',
  ];

  const englishSearchTerms = [
    'piano',
    'Beatles',
    'Elton John',
    'Billy Joel',
    'Adele',
    'Coldplay',
    'Queen',
    'David Bowie',
    'Whitney Houston',
    'Michael Jackson',
    'Stevie Wonder',
    'Alicia Keys',
    'John Legend',
    'Frank Sinatra',
    'Nina Simone',
  ];

  const fetchRandomSong = async (retryCount = 0) => {
    const maxRetries = 3;
    setLoading(true);

    try {
      let searchTerm = '';
      let country = 'us';

      // Choose search term based on language preference
      if (language === 'hebrew') {
        searchTerm = hebrewArtists[Math.floor(Math.random() * hebrewArtists.length)];
        country = 'il'; // Israel for Hebrew songs
      } else if (language === 'english') {
        searchTerm = englishSearchTerms[Math.floor(Math.random() * englishSearchTerms.length)];
        country = 'us';
      } else {
        // both - random mix
        const allTerms = [...hebrewArtists, ...englishSearchTerms];
        searchTerm = allTerms[Math.floor(Math.random() * allTerms.length)];
        country = hebrewArtists.includes(searchTerm) ? 'il' : 'us';
      }

      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&country=${country}&media=music&entity=song&limit=50`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Filter songs by year range
        const filteredSongs = data.results.filter((track: any) => {
          if (!track.releaseDate) return false;
          const year = parseInt(track.releaseDate.split('-')[0]);
          return year >= yearRange.start && year <= yearRange.end;
        });

        if (filteredSongs.length === 0) {
          // Retry with different search term
          if (retryCount < maxRetries) {
            console.log(`No songs in year range, retrying... (${retryCount + 1}/${maxRetries})`);
            return fetchRandomSong(retryCount + 1);
          } else {
            alert('לא נמצאו שירים בטווח השנים הזה. נסי טווח אחר או שפה אחרת.');
            setLoading(false);
            return;
          }
        }

        // Pick a random track from filtered results
        const randomTrack = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];

        const newSong: Song = {
          id: randomTrack.trackId,
          name: randomTrack.trackName,
          artist: randomTrack.artistName,
          year: randomTrack.releaseDate.split('-')[0],
          albumImage: randomTrack.artworkUrl100.replace('100x100', '600x600'), // Get higher quality
          previewUrl: randomTrack.previewUrl,
          trackUrl: randomTrack.trackViewUrl,
        };

        setSong(newSong);
      } else {
        // Retry with different search term
        if (retryCount < maxRetries) {
          console.log(`No results found, retrying... (${retryCount + 1}/${maxRetries})`);
          return fetchRandomSong(retryCount + 1);
        } else {
          alert('לא נמצאו שירים. נסי חיפוש אחר.');
        }
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      // Retry on error
      if (retryCount < maxRetries) {
        console.log(`Error occurred, retrying... (${retryCount + 1}/${maxRetries})`);
        return fetchRandomSong(retryCount + 1);
      } else {
        alert('משהו השתבש. נסי שוב.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="random-song">
      <h1>🎹 שיר אקראי לתרגול</h1>
      <p className="subtitle">בחרי תקופה ונמצא לך שיר לנגן בפסנתר</p>

      <div className="song-filters">
        <div className="filter-group">
          <label>שפה</label>
          <div className="language-buttons">
            <button
              className={language === 'hebrew' ? 'active' : ''}
              onClick={() => setLanguage('hebrew')}
            >
              עברית
            </button>
            <button
              className={language === 'english' ? 'active' : ''}
              onClick={() => setLanguage('english')}
            >
              אנגלית
            </button>
            <button
              className={language === 'both' ? 'active' : ''}
              onClick={() => setLanguage('both')}
            >
              שניהם
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>טווח שנים: {yearRange.start} - {yearRange.end}</label>
          <div className="year-sliders">
            <div className="slider-group">
              <span>משנת</span>
              <input
                type="range"
                min="1960"
                max="2024"
                value={yearRange.start}
                onChange={(e) => setYearRange({ ...yearRange, start: parseInt(e.target.value) })}
                className="year-slider"
              />
              <span>{yearRange.start}</span>
            </div>
            <div className="slider-group">
              <span>עד שנת</span>
              <input
                type="range"
                min="1960"
                max="2024"
                value={yearRange.end}
                onChange={(e) => setYearRange({ ...yearRange, end: parseInt(e.target.value) })}
                className="year-slider"
              />
              <span>{yearRange.end}</span>
            </div>
          </div>
        </div>

        <button onClick={fetchRandomSong} className="btn-generate" disabled={loading}>
          {loading ? '⏳ מחפש שיר...' : '🎲 מצא לי שיר!'}
        </button>
      </div>

      {song && (
        <div className="song-result">
          <div className="song-card">
            {song.albumImage && (
              <img src={song.albumImage} alt={song.name} className="album-cover" />
            )}
            <div className="song-info">
              <h2>{song.name}</h2>
              <p className="artist">{song.artist}</p>
              <p className="year">שנת {song.year}</p>
            </div>
          </div>

          <div className="song-actions">
            {song.previewUrl && (
              <div className="audio-preview">
                <p className="preview-label">🎧 תצוגה מקדימה (30 שניות)</p>
                <audio key={song.id} controls className="audio-player">
                  <source src={song.previewUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}
            <a
              href={song.trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-itunes"
            >
              🎵 פתח ב-Apple Music
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.name + ' ' + song.artist + ' piano tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-youtube"
            >
              📺 חפש שיעור ביוטיוב
            </a>
          </div>
        </div>
      )}

      {!song && !loading && (
        <div className="empty-state">
          <p>🎹</p>
          <p>בחרי שפה וטווח שנים ולחצי על "מצא לי שיר"</p>
        </div>
      )}
    </div>
  );
}
