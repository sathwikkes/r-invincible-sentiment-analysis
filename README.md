# 🦸‍♂️ Invincible Reddit Sentiment Analysis Dashboard

A comprehensive data analytics platform that transforms raw Reddit discussion data into actionable sentiment insights. This project combines Python-based ETL pipelines with an interactive React dashboard to provide real-time sentiment analysis and community engagement metrics for r/Invincible discussions.

## 🎯 Project Overview

This sentiment analysis system processes thousands of Reddit comments and posts to understand community sentiment patterns, engagement trends, and discussion dynamics. The platform provides business-ready insights for content creators, community managers, and data analysts looking to gauge audience reception and optimize engagement strategies.

### Key Features

- **Real-time Sentiment Tracking**: VADER sentiment analysis on Reddit comments with compound scores (-1 to +1)
- **Temporal Analysis**: Daily sentiment trends, hourly patterns, and day-of-week analytics
- **Engagement Correlation**: Relationship between sentiment and upvote engagement
- **Content Analysis**: Word frequency, bigram/trigram analysis for positive vs negative discussions
- **Community Insights**: Top contributors, most discussed threads, and flair-based sentiment breakdowns
- **Interactive Visualizations**: 11 dynamic charts and data tables powered by Plotly.js

## 🚀 Business Applications

### Content Strategy & Audience Insights
- **Monitor audience reception** of new episodes, characters, or story arcs
- **Identify trending topics** through word frequency analysis
- **Optimize posting times** using temporal sentiment patterns
- **Track community health** and engagement metrics over time

### Community Management
- **Early sentiment detection** for controversial topics or negative trends
- **Identify top community contributors** and positive influencers
- **Understand discussion dynamics** across different post categories (flairs)
- **Measure content impact** through engagement vs sentiment correlation

### Marketing & Brand Intelligence
- **Real-time brand sentiment monitoring** for entertainment properties
- **Competitive analysis** of audience reception
- **Content performance benchmarking** across different discussion themes
- **Audience segmentation** based on engagement patterns

## 🛠 Technical Architecture

### Data Pipeline (Python Backend)
```
Raw Reddit Data → Data Wrangling → Sentiment Analysis → Metrics Export → Dashboard
```

#### Core Technologies
- **Data Processing**: Pandas for data manipulation and aggregation
- **Sentiment Analysis**: NLTK VADER (Valence Aware Dictionary and sEntiment Reasoner)
- **Text Processing**: Advanced regex and NLP for n-gram extraction
- **Data Storage**: JSON-based metrics for frontend consumption

#### Pipeline Components

1. **Data Wrangling** (`data_wrangling.py`)
   - Merges Reddit posts and comments datasets
   - Cleans and normalizes text data
   - Handles missing values and data validation
   - Creates relational structure between posts and comments

2. **Sentiment Analysis** (`sentiment_analysis.py`)
   - Implements VADER sentiment scoring
   - Processes comment text with noise reduction
   - Generates compound sentiment scores (-1 to +1 scale)
   - Handles edge cases and data quality issues

3. **Metrics Export** (`metrics_export.py`)
   - Aggregates 12 different analytical dimensions
   - Advanced text processing with stopword filtering
   - Temporal analysis with hour/day breakdowns
   - Author-level sentiment profiling
   - N-gram analysis (unigrams, bigrams, trigrams)

### Frontend Dashboard (React/TypeScript)
```
Vite Build System → React Components → Plotly.js Visualizations → Real-time Updates
```

#### Technologies
- **Framework**: React 19 with TypeScript for type safety
- **Build System**: Vite for fast development and optimized builds
- **Visualization**: Plotly.js with React integration
- **Styling**: CSS Grid for responsive dashboard layout
- **Data Fetching**: Async/await with Promise.all for parallel loading

#### Dashboard Features
- **10 Interactive Charts**: Line plots, histograms, scatter plots, bar charts, and heatmaps
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Real-time Data**: Live updates from processed JSON endpoints
- **Performance Optimized**: Lazy loading and efficient rendering

## 📊 Analytics Capabilities

### Sentiment Metrics
- **Daily Sentiment Trends**: Track community mood over time
- **Sentiment Distribution**: Histogram of comment sentiment scores
- **Engagement Correlation**: Scatter plot of sentiment vs upvotes

### Temporal Analysis
- **Hourly Patterns**: Identify peak discussion times
- **Day-of-Week Trends**: Weekly engagement cycles
- **Time-series Visualization**: Long-term sentiment evolution

### Content Intelligence
- **Word Frequency Analysis**: Most common terms in positive/negative discussions
- **Bigram/Trigram Analysis**: Contextual phrase patterns
- **Topic Clustering**: Identify discussion themes and sentiment associations

### Community Insights
- **Top Contributors**: Most positive community members
- **Thread Analysis**: Best and worst performing discussions
- **Flair-based Segmentation**: Sentiment by content category

## 🏗 Repository Structure

```
├── backend/                     # Python ETL Pipeline
│   ├── data_wrangling.py       # Data cleaning and merging
│   ├── sentiment_analysis.py   # VADER sentiment processing
│   ├── metrics_export.py       # Analytics aggregation
│   ├── legacy_dashboard.html   # Prototype visualization
│   └── requirements.txt        # Python dependencies
├── dashboard/                   # React TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx            # Main dashboard component
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── App.css            # Dashboard styling
│   ├── public/processed/       # Generated analytics JSON
│   ├── package.json           # Node.js dependencies
│   └── vite.config.ts         # Build configuration
├── data/                       # Raw Reddit datasets (JSONL)
├── Makefile                    # Automation commands
└── README.md                   # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control
- **(Optional)** GNU Make for automation

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/invincible-sentiment-analysis.git
   cd invincible-sentiment-analysis
   ```

2. **Python Environment Setup**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

3. **Frontend Dependencies**
   ```bash
   cd dashboard
   npm install
   cd ..
   ```

4. **Data Processing Pipeline**
   ```bash
   make pipeline
   # OR run manually:
   # python backend/data_wrangling.py
   # python backend/sentiment_analysis.py
   # python backend/metrics_export.py
   ```

5. **Launch Dashboard**
   ```bash
   make serve-dashboard
   # OR: cd dashboard && npm run dev
   ```

   Access dashboard at: `http://localhost:5173`

## 📈 Usage Examples

### Automated Pipeline Execution
```bash
# Complete ETL pipeline
make pipeline

# Clean previous outputs
make clean

# Development server
make serve-dashboard
```

### Manual Step-by-Step Processing
```bash
# Step 1: Process raw Reddit data
python backend/data_wrangling.py

# Step 2: Generate sentiment scores
python backend/sentiment_analysis.py

# Step 3: Create dashboard metrics
python backend/metrics_export.py

# Step 4: Launch visualization
cd dashboard && npm run dev
```

## 🎯 Future Enhancements

### Technical Roadmap
- **Advanced NLP**: Implement transformer-based sentiment models (BERT, RoBERTa)
- **Real-time Processing**: Streaming data pipeline with Apache Kafka
- **Database Integration**: PostgreSQL for production data storage
- **API Development**: RESTful endpoints for programmatic access
- **Machine Learning**: Predictive sentiment modeling and anomaly detection

### Business Features
- **Multi-subreddit Analysis**: Cross-community sentiment comparison
- **Automated Reporting**: Scheduled PDF/email reports
- **Alert System**: Real-time notifications for sentiment spikes
- **A/B Testing**: Content performance experiments
- **Export Capabilities**: CSV, PDF, and API data exports

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for complete terms and conditions.

## 🙏 Acknowledgments

- **NLTK Team** for the VADER sentiment analysis toolkit
- **Reddit API** for community data access
- **Plotly.js** for powerful visualization capabilities
- **React & Vite** communities for frontend tooling

---

**Built with ❤️ for data-driven community insights**