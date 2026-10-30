import { useState, useEffect } from 'react';
import type { Spark, Entry, WritingTaskEntry } from './types';
import { fetchRandomSpark } from './wikipediaService';
import { getDailyWritingTask } from './writingTasks';
import { RandomSong } from './RandomSong';
import './App.css';

type Tab = 'spark' | 'writing' | 'song' | 'archive';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('spark');
  const [spark, setSpark] = useState<Spark | null>(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [writingTaskEntries, setWritingTaskEntries] = useState<WritingTaskEntry[]>([]);
  const [saved, setSaved] = useState(false);
  const [streak, setStreak] = useState(0);

  const writingTask = getDailyWritingTask();

  useEffect(() => {
    loadTodaySpark();
    loadEntries();
    calculateStreak();
  }, []);

  const calculateStreak = () => {
    const allEntries = [
      ...JSON.parse(localStorage.getItem('fullEntries') || '[]'),
      ...JSON.parse(localStorage.getItem('writingTaskEntries') || '[]')
    ];

    if (allEntries.length === 0) {
      setStreak(0);
      return;
    }

    // Sort by date
    allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if wrote today
    const latestEntry = new Date(allEntries[0].date.split('.').reverse().join('-'));
    latestEntry.setHours(0, 0, 0, 0);

    if (latestEntry.getTime() !== today.getTime()) {
      // Check if wrote yesterday
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (latestEntry.getTime() !== yesterday.getTime()) {
        setStreak(0);
        return;
      }
    }

    // Count consecutive days
    let checkDate = new Date(latestEntry);
    for (const entry of allEntries) {
      const entryDate = new Date(entry.date.split('.').reverse().join('-'));
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (entryDate.getTime() < checkDate.getTime()) {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const loadTodaySpark = async () => {
    const today = new Date().toDateString();
    const cachedSpark = localStorage.getItem('todaySpark');
    const cachedDate = localStorage.getItem('sparkDate');

    if (cachedSpark && cachedDate === today) {
      setSpark(JSON.parse(cachedSpark));
      setLoading(false);
    } else {
      setLoading(true);
      const newSpark = await fetchRandomSpark();
      setSpark(newSpark);
      localStorage.setItem('todaySpark', JSON.stringify(newSpark));
      localStorage.setItem('sparkDate', today);
      setLoading(false);
    }
  };

  const loadEntries = () => {
    const stored = localStorage.getItem('entries');
    if (stored) {
      setEntries(JSON.parse(stored));
    }
    const taskEntries = localStorage.getItem('writingTaskEntries');
    if (taskEntries) {
      setWritingTaskEntries(JSON.parse(taskEntries));
    }
  };

  const saveEntry = (isWritingTask = false) => {
    if (!response.trim()) return;

    if (isWritingTask) {
      const newEntry: WritingTaskEntry = {
        id: Date.now().toString(),
        taskId: writingTask.id,
        date: new Date().toLocaleDateString('he-IL'),
        response: response.trim(),
        taskType: writingTask.type,
        taskTitle: writingTask.title,
      };

      const updatedEntries = [newEntry, ...writingTaskEntries];
      setWritingTaskEntries(updatedEntries);
      localStorage.setItem('writingTaskEntries', JSON.stringify(updatedEntries));
    } else {
      if (!spark) return;

      const newEntry: Entry = {
        id: Date.now().toString(),
        sparkId: spark.id,
        date: new Date().toLocaleDateString('he-IL'),
        response: response.trim(),
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('entries', JSON.stringify(updatedEntries));

      const entryWithSpark = {
        ...newEntry,
        sparkTitle: spark.title,
        sparkContent: spark.content,
        sparkCategory: spark.category,
        sparkImage: spark.imageUrl,
      };

      const fullEntries = JSON.parse(localStorage.getItem('fullEntries') || '[]');
      fullEntries.unshift(entryWithSpark);
      localStorage.setItem('fullEntries', JSON.stringify(fullEntries));
    }

    setResponse('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    calculateStreak();
  };

  const getNewSpark = async () => {
    setLoading(true);
    const newSpark = await fetchRandomSpark();
    setSpark(newSpark);
    localStorage.setItem('todaySpark', JSON.stringify(newSpark));
    localStorage.setItem('sparkDate', new Date().toDateString());
    setLoading(false);
    setResponse('');
  };


  const renderArchive = () => {
    const fullEntries = JSON.parse(localStorage.getItem('fullEntries') || '[]');
    const taskEntries = JSON.parse(localStorage.getItem('writingTaskEntries') || '[]');
    const allEntries = [...fullEntries, ...taskEntries].sort((a, b) => {
      return new Date(b.date.split('.').reverse().join('-')).getTime() -
             new Date(a.date.split('.').reverse().join('-')).getTime();
    });

    return (
      <div className="archive">
        <h1>הארכיון שלי</h1>
        {allEntries.length === 0 ? (
          <p className="empty-state">עדיין לא שמרת רשומות</p>
        ) : (
          <div className="entries-list">
            {allEntries.map((entry: any) => (
              <div key={entry.id} className="archive-entry">
                <div className="entry-header">
                  <span className="entry-date">{entry.date}</span>
                  <span className="entry-category">
                    {entry.sparkCategory || entry.taskTitle}
                  </span>
                </div>
                {entry.sparkTitle && (
                  <>
                    <h3>{entry.sparkTitle}</h3>
                    <p className="entry-spark">{entry.sparkContent.substring(0, 200)}...</p>
                  </>
                )}
                {entry.taskTitle && !entry.sparkTitle && (
                  <h3>{entry.taskTitle}</h3>
                )}
                <div className="entry-response">
                  <strong>מה שכתבתי:</strong>
                  <p>{entry.response}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading && activeTab === 'spark') {
    return (
      <div className="app">
        <div className="loading">טוען ניצוץ חדש...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>✨ ניצוץ יומי</h1>
          {streak > 0 && (
            <div className="streak-badge">
              🔥 {streak} {streak === 1 ? 'יום' : 'ימים'} ברצף!
            </div>
          )}
        </div>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'spark' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('spark')}
        >
          💡 עובדה יומית
        </button>
        <button
          className={activeTab === 'writing' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('writing')}
        >
          ✍️ תרגיל כתיבה
        </button>
        <button
          className={activeTab === 'song' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('song')}
        >
          🎹 שיר לפסנתר
        </button>
        <button
          className={activeTab === 'archive' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('archive')}
        >
          📖 ארכיון
        </button>
      </nav>

      {activeTab === 'archive' && renderArchive()}
      {activeTab === 'song' && <RandomSong />}

      {activeTab === 'spark' && spark && (
        <div className="content">
          <button onClick={getNewSpark} className="btn-new-spark">
            עובדה חדשה 🔄
          </button>

          {spark.imageUrl && (
            <div className="spark-image">
              <img src={spark.imageUrl} alt={spark.title} />
            </div>
          )}

          <div className="spark-section">
            <div className="category-badge">{spark.category}</div>
            <h2 className="spark-title">{spark.title}</h2>
            <div className="spark-content">{spark.content}</div>
            {spark.wikiUrl && (
              <div className="wiki-link-section">
                <a
                  href={spark.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-read-more"
                >
                  📖 קרא עוד בויקיפדיה
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'writing' && (
        <div className="content">
          <div className="writing-task-section">
            <div className="task-type-badge">{writingTask.title}</div>
            <h2 className="task-instruction">{writingTask.instruction}</h2>
            {writingTask.prompt && (
              <div className="task-prompt">
                <span className="task-prompt-word">{writingTask.prompt}</span>
              </div>
            )}
          </div>

          <div className="response-section">
            <h3 className="response-title">הכתיבה שלי</h3>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="התחילי לכתוב כאן..."
              className="response-textarea"
              rows={10}
            />
            <div className="response-actions">
              {saved && <span className="saved-indicator">✓ נשמר!</span>}
              <button
                onClick={() => saveEntry(true)}
                disabled={!response.trim()}
                className="btn-primary"
              >
                שמור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
