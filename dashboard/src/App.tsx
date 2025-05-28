import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import type { 
  SentimentData, 
  EngagementData, 
  FlairData, 
  TopThreads, 
  WordFreq, 
  BigramFreq,
  TrigramFreq,
  TimeData, 
  AuthorData 
} from './types';
import './App.css';

function App() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [distributionData, setDistributionData] = useState<number[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [flairData, setFlairData] = useState<FlairData[]>([]);
  const [topThreads, setTopThreads] = useState<TopThreads>({ positive: [], negative: [] });
  const [wordFreq, setWordFreq] = useState<WordFreq>({ positive: {}, negative: {} });
  const [bigramFreq, setBigramFreq] = useState<BigramFreq>({ positive: {}, negative: {} });
  const [trigramFreq, setTrigramFreq] = useState<TrigramFreq>({ positive: {}, negative: {} });
  const [hourData, setHourData] = useState<TimeData[]>([]);
  const [dayData, setDayData] = useState<TimeData[]>([]);
  const [authorData, setAuthorData] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          sentimentRes,
          distributionRes,
          engagementRes,
          flairRes,
          threadsRes,
          wordRes,
          bigramRes,
          trigramRes,
          hourRes,
          dayRes,
          authorRes
        ] = await Promise.all([
          fetch('/processed/avg_sentiment_by_day.json'),
          fetch('/processed/sentiment_distribution.json'),
          fetch('/processed/engagement_scatter.json'),
          fetch('/processed/sentiment_by_flair.json'),
          fetch('/processed/top_threads.json'),
          fetch('/processed/word_frequencies.json'),
          fetch('/processed/bigram_frequencies.json'),
          fetch('/processed/trigram_frequencies.json'),
          fetch('/processed/hour_sentiment.json'),
          fetch('/processed/day_sentiment.json'),
          fetch('/processed/author_sentiment.json')
        ]);

        setSentimentData(await sentimentRes.json());
        setDistributionData(await distributionRes.json());
        setEngagementData(await engagementRes.json());
        setFlairData(await flairRes.json());
        setTopThreads(await threadsRes.json());
        setWordFreq(await wordRes.json());
        setBigramFreq(await bigramRes.json());
        setTrigramFreq(await trigramRes.json());
        setHourData(await hourRes.json());
        setDayData(await dayRes.json());
        setAuthorData(await authorRes.json());
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="app">
      <header>
        <h1>🦸‍♂️ Invincible Sentiment Analysis Dashboard</h1>
        <p>Analyzing sentiment from r/Invincible Reddit discussions</p>
      </header>

      <div className="dashboard-grid">
        {/* Sentiment Over Time */}
        <div className="chart-container">
          <Plot
            data={[{
              x: sentimentData.map(d => new Date(d.created_dt).toLocaleDateString()),
              y: sentimentData.map(d => d.avg_sentiment),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Average Sentiment',
              line: { color: '#e74c3c', width: 2 },
              marker: { color: '#e74c3c', size: 4 },
              hovertemplate: '<b>Date:</b> %{x}<br><b>Avg Sentiment:</b> %{y:.3f}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'r/Invincible Daily Sentiment Trends',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Date',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              yaxis: { 
                title: 'Average Sentiment Score (-1 to +1)', 
                range: [-1, 1],
                titlefont: { size: 14, color: '#2c3e50' },
                zeroline: true,
                zerolinecolor: '#bdc3c7',
                zerolinewidth: 1
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Sentiment Distribution */}
        <div className="chart-container">
          <Plot
            data={[{
              x: distributionData,
              type: 'histogram',
              nbinsx: 30,
              marker: { color: '#3498db', opacity: 0.7 },
              hovertemplate: '<b>Sentiment Range:</b> %{x:.2f}<br><b>Comment Count:</b> %{y}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'Distribution of Comment Sentiment Scores',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Sentiment Score (VADER Compound)',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              yaxis: { 
                title: 'Number of Comments',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Engagement vs Sentiment */}
        <div className="chart-container">
          <Plot
            data={[{
              x: engagementData.map(d => d.compound),
              y: engagementData.map(d => d.score),
              mode: 'markers',
              type: 'scatter',
              marker: { color: '#9b59b6', opacity: 0.6, size: 6 },
              hovertemplate: '<b>Sentiment:</b> %{x:.3f}<br><b>Upvotes:</b> %{y}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'Comment Engagement vs Sentiment Correlation',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Sentiment Score (VADER Compound)',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              yaxis: { 
                title: 'Comment Upvotes',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Sentiment by Flair */}
        <div className="chart-container">
          <Plot
            data={[{
              x: flairData.map(d => d.link_flair_text || 'No Flair'),
              y: flairData.map(d => d.avg_sentiment),
              type: 'bar',
              marker: { color: '#f39c12' },
              hovertemplate: '<b>Flair:</b> %{x}<br><b>Avg Sentiment:</b> %{y:.3f}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'Average Sentiment by Post Flair Category',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Post Flair Category',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              yaxis: { 
                title: 'Average Sentiment Score',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Hour of Day Heatmap */}
        <div className="chart-container">
          <Plot
            data={[{
              x: hourData.map(d => d.hour),
              y: hourData.map(d => d.compound),
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#2ecc71', size: 8 },
              line: { color: '#2ecc71', width: 3 },
              hovertemplate: '<b>Hour:</b> %{x}:00<br><b>Avg Sentiment:</b> %{y:.3f}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'Comment Sentiment Patterns by Hour of Day',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Hour of Day (24-hour format)',
                titlefont: { size: 14, color: '#2c3e50' },
                dtick: 2
              },
              yaxis: { 
                title: 'Average Sentiment Score',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Day of Week */}
        <div className="chart-container">
          <Plot
            data={[{
              x: dayOrder,
              y: dayOrder.map(day => {
                const dayItem = dayData.find(d => d.day_of_week === day);
                return dayItem ? dayItem.compound : 0;
              }),
              type: 'bar',
              marker: { color: '#e67e22' },
              hovertemplate: '<b>Day:</b> %{x}<br><b>Avg Sentiment:</b> %{y:.3f}<br><extra></extra>'
            }]}
            layout={{
              title: {
                text: 'Weekly Sentiment Patterns by Day of Week',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Day of Week',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              yaxis: { 
                title: 'Average Sentiment Score',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Top Authors */}
        <div className="chart-container">
          <Plot
            data={[{
              x: authorData.slice(0, 10).map(d => d.author),
              y: authorData.slice(0, 10).map(d => d.avg_sentiment),
              type: 'bar',
              marker: { color: '#1abc9c' },
              hovertemplate: '<b>Author:</b> %{x}<br><b>Avg Sentiment:</b> %{y:.3f}<br><b>Comment Count:</b> %{customdata[0]}<br><b>Total Score:</b> %{customdata[1]}<br><extra></extra>',
              customdata: authorData.slice(0, 10).map(d => [d.comment_count, d.total_score])
            }]}
            layout={{
              title: {
                text: 'Top 10 Most Positive Community Contributors',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Reddit Username',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              yaxis: { 
                title: 'Average Sentiment Score',
                titlefont: { size: 14, color: '#2c3e50' },
                range: [-1, 1]
              },
              showlegend: false,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Word Frequency */}
        <div className="chart-container">
          <Plot
            data={[
              {
                x: Object.keys(wordFreq.positive).slice(0, 15),
                y: Object.values(wordFreq.positive).slice(0, 15),
                type: 'bar',
                name: 'Positive Comments',
                marker: { color: '#2ecc71' },
                hovertemplate: '<b>Word:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Positive comments<br><extra></extra>'
              },
              {
                x: Object.keys(wordFreq.negative).slice(0, 15),
                y: Object.values(wordFreq.negative).slice(0, 15),
                type: 'bar',
                name: 'Negative Comments',
                marker: { color: '#e74c3c' },
                yaxis: 'y2',
                hovertemplate: '<b>Word:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Negative comments<br><extra></extra>'
              }
            ]}
            layout={{
              title: {
                text: 'Most Frequent Words in Positive vs Negative Comments',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Words (4+ characters, stopwords removed)',
                titlefont: { size: 14, color: '#2c3e50' }
              },
              yaxis: { 
                title: 'Frequency in Positive Comments', 
                side: 'left',
                titlefont: { size: 14, color: '#2ecc71' }
              },
              yaxis2: { 
                title: 'Frequency in Negative Comments', 
                side: 'right', 
                overlaying: 'y',
                titlefont: { size: 14, color: '#e74c3c' }
              },
              showlegend: true,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff'
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Bigram Frequency */}
        <div className="chart-container">
          <Plot
            data={[
              {
                x: Object.keys(bigramFreq.positive).slice(0, 12),
                y: Object.values(bigramFreq.positive).slice(0, 12),
                type: 'bar',
                name: 'Positive Comments',
                marker: { color: '#27ae60' },
                hovertemplate: '<b>Phrase:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Positive comments<br><extra></extra>'
              },
              {
                x: Object.keys(bigramFreq.negative).slice(0, 12),
                y: Object.values(bigramFreq.negative).slice(0, 12),
                type: 'bar',
                name: 'Negative Comments',
                marker: { color: '#c0392b' },
                yaxis: 'y2',
                hovertemplate: '<b>Phrase:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Negative comments<br><extra></extra>'
              }
            ]}
            layout={{
              title: {
                text: 'Most Common Phrases (Bigrams) in Positive vs Negative Comments',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Two-word Phrases (semantic context)',
                titlefont: { size: 14, color: '#2c3e50' },
                tickangle: -45
              },
              yaxis: { 
                title: 'Frequency in Positive Comments', 
                side: 'left',
                titlefont: { size: 14, color: '#27ae60' }
              },
              yaxis2: { 
                title: 'Frequency in Negative Comments', 
                side: 'right', 
                overlaying: 'y',
                titlefont: { size: 14, color: '#c0392b' }
              },
              showlegend: true,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff',
              margin: { b: 120 }
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>

        {/* Trigram Frequency */}
        <div className="chart-container">
          <Plot
            data={[
              {
                x: Object.keys(trigramFreq.positive).slice(0, 10),
                y: Object.values(trigramFreq.positive).slice(0, 10),
                type: 'bar',
                name: 'Positive Comments',
                marker: { color: '#16a085' },
                hovertemplate: '<b>Phrase:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Positive comments<br><extra></extra>'
              },
              {
                x: Object.keys(trigramFreq.negative).slice(0, 10),
                y: Object.values(trigramFreq.negative).slice(0, 10),
                type: 'bar',
                name: 'Negative Comments',
                marker: { color: '#a93226' },
                yaxis: 'y2',
                hovertemplate: '<b>Phrase:</b> %{x}<br><b>Frequency:</b> %{y}<br><b>Context:</b> Negative comments<br><extra></extra>'
              }
            ]}
            layout={{
              title: {
                text: 'Most Common Three-Word Phrases (Trigrams) in Comments',
                font: { size: 16, color: '#2c3e50' }
              },
              xaxis: { 
                title: 'Three-word Phrases (enhanced semantic context)',
                titlefont: { size: 14, color: '#2c3e50' },
                tickangle: -45
              },
              yaxis: { 
                title: 'Frequency in Positive Comments', 
                side: 'left',
                titlefont: { size: 14, color: '#16a085' }
              },
              yaxis2: { 
                title: 'Frequency in Negative Comments', 
                side: 'right', 
                overlaying: 'y',
                titlefont: { size: 14, color: '#a93226' }
              },
              showlegend: true,
              plot_bgcolor: '#ffffff',
              paper_bgcolor: '#ffffff',
              margin: { b: 140 }
            }}
            style={{ width: '100%', height: '400px' }}
            config={{ responsive: true }}
          />
        </div>
      </div>

      {/* Top Threads Tables */}
      <div className="tables-section">
        <div className="table-container">
          <h3>🏆 Most Positive Discussion Threads</h3>
          <p className="table-description">Posts with the most positive average comment sentiment</p>
          <table>
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Avg Comment Sentiment</th>
                <th>Sentiment Category</th>
              </tr>
            </thead>
            <tbody>
              {topThreads.positive
                .filter(thread => thread.title) // Filter out null titles
                .map((thread, idx) => (
                <tr key={idx}>
                  <td title={thread.title}>{thread.title.length > 80 ? thread.title.substring(0, 80) + '...' : thread.title}</td>
                  <td className="positive">{thread.compound.toFixed(3)}</td>
                  <td>
                    <span className="sentiment-badge positive">
                      {thread.compound > 0.5 ? 'Very Positive' : 'Positive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-container">
          <h3>👎 Most Negative Discussion Threads</h3>
          <p className="table-description">Posts with the most negative average comment sentiment</p>
          <table>
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Avg Comment Sentiment</th>
                <th>Sentiment Category</th>
              </tr>
            </thead>
            <tbody>
              {topThreads.negative
                .filter(thread => thread.title) // Filter out null titles
                .map((thread, idx) => (
                <tr key={idx}>
                  <td title={thread.title}>{thread.title.length > 80 ? thread.title.substring(0, 80) + '...' : thread.title}</td>
                  <td className="negative">{thread.compound.toFixed(3)}</td>
                  <td>
                    <span className="sentiment-badge negative">
                      {thread.compound < -0.5 ? 'Very Negative' : 'Negative'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
