import pandas as pd
import json
import re
from collections import Counter

df = pd.read_json("processed/merged_with_sentiment.json", lines=True)
df['created_dt'] = pd.to_datetime(df['created_utc'], unit='s')
df['hour'] = df['created_dt'].dt.hour
df['day_of_week'] = df['created_dt'].dt.day_name()

# 1. Sentiment Over Time (daily average)
daily = (
    df.set_index('created_dt')
      .resample('D')['compound']
      .mean()
      .reset_index()
      .rename(columns={'compound':'avg_sentiment'})
)
daily.to_json("processed/avg_sentiment_by_day.json", orient='records')

# 2. Distribution bins for histogram
hist_vals = df['compound'].tolist()
with open("processed/sentiment_distribution.json","w") as f:
    json.dump(hist_vals, f)

# 3. Engagement vs Sentiment scatter
scatter = df[['compound','score']].dropna().to_dict(orient='records')
with open("processed/engagement_scatter.json","w") as f:
    json.dump(scatter, f)

# 4. Sentiment by Flair
by_flair = (
    df.groupby('link_flair_text')['compound']
      .mean()
      .reset_index()
      .rename(columns={'compound':'avg_sentiment'})
)
by_flair.to_json("processed/sentiment_by_flair.json", orient='records')

# 5. Top Positive & Negative Threads
# First, let's get the posts data to properly merge titles
posts_df = pd.read_json("data/r_r_Invincible_posts.jsonl", lines=True)
posts_titles = posts_df[['id', 'title']].set_index('id')

posts_sentiment = df.groupby('post_id').agg({
    'compound': 'mean'
}).reset_index()

# Merge with posts to get proper titles
posts_sentiment = posts_sentiment.merge(posts_titles, left_on='post_id', right_index=True, how='left')

# Filter out posts without titles and get top/bottom 10
posts_with_titles = posts_sentiment.dropna(subset=['title'])
top_positive = posts_with_titles.nlargest(10, 'compound')[['title', 'compound']].to_dict(orient='records')
top_negative = posts_with_titles.nsmallest(10, 'compound')[['title', 'compound']].to_dict(orient='records')

with open("processed/top_threads.json","w") as f:
    json.dump({"positive": top_positive, "negative": top_negative}, f)

# 6. Enhanced word frequency analysis
def extract_words(text):
    if pd.isna(text):
        return []
    # Remove URLs, mentions, markdown, clean text
    text = re.sub(r'http\S+|www\S+|@\w+|#\w+|\*+|&gt;|&lt;|\[.*?\]|\(.*?\)', '', str(text).lower())
    words = re.findall(r'\b[a-z]{4,}\b', text)  # Increased to 4+ chars for better quality
    
    # Comprehensive stopwords including Reddit-specific and common words
    stopwords = {
        # Common stopwords
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way', 'she', 'yet',
        # Additional common words
        'this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'what', 'than', 'many', 'some', 'very', 'when', 'much', 'then', 'them', 'these', 'more', 'your', 'would', 'about', 'think', 'know', 'just', 'first', 'into', 'over', 'also', 'back', 'after', 'well', 'only', 'being', 'where', 'before', 'here', 'through', 'there', 'could', 'should', 'still', 'such', 'make', 'even', 'most', 'other', 'another', 'while', 'again', 'come', 'take', 'want', 'like', 'really', 'dont', 'doesnt', 'wasnt', 'isnt', 'cant', 'wont', 'wouldnt', 'shouldnt', 'couldnt',
        # Reddit-specific
        'edit', 'deleted', 'removed', 'reddit', 'comment', 'thread', 'post', 'upvote', 'downvote'
    }
    
    # Filter words and remove common patterns
    filtered_words = []
    for word in words:
        if (word not in stopwords and 
            len(word) > 3 and 
            not word.isdigit() and 
            not re.match(r'^[aeiou]+$', word) and  # Remove vowel-only words
            not re.match(r'^[bcdfghjklmnpqrstvwxyz]+$', word)):  # Remove consonant-only words
            filtered_words.append(word)
    
    return filtered_words

positive_comments = df[df['compound'] > 0.1]['body']
negative_comments = df[df['compound'] < -0.1]['body']

pos_words = []
neg_words = []

for text in positive_comments:
    pos_words.extend(extract_words(text))
    
for text in negative_comments:
    neg_words.extend(extract_words(text))

pos_freq = dict(Counter(pos_words).most_common(50))
neg_freq = dict(Counter(neg_words).most_common(50))

with open("processed/word_frequencies.json","w") as f:
    json.dump({"positive": pos_freq, "negative": neg_freq}, f)

# Optional: Enhanced semantic analysis with bigrams
def extract_bigrams(text):
    if pd.isna(text):
        return []
    # Clean text more aggressively for bigrams
    text = re.sub(r'http\S+|www\S+|@\w+|#\w+|\*+|&gt;|&lt;|\[.*?\]|\(.*?\)|[^\w\s]', ' ', str(text).lower())
    words = re.findall(r'\b[a-z]{3,}\b', text)
    
    # Basic stopwords for bigrams
    stopwords = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way', 'she', 'yet', 'this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'what', 'than', 'many', 'some', 'very', 'when', 'much', 'then', 'them', 'these', 'more', 'your', 'would', 'about', 'think', 'know', 'just', 'first', 'into', 'over', 'also', 'back', 'after', 'well', 'only', 'being', 'where', 'before', 'here', 'through', 'there', 'could', 'should', 'still', 'such', 'make', 'even', 'most', 'other', 'another', 'while', 'again', 'come', 'take', 'want', 'like', 'really'}
    
    # Filter and create bigrams
    filtered_words = [w for w in words if w not in stopwords and len(w) > 2]
    bigrams = []
    for i in range(len(filtered_words) - 1):
        bigram = f"{filtered_words[i]} {filtered_words[i+1]}"
        bigrams.append(bigram)
    
    return bigrams

# Generate bigram frequencies for more semantic context
pos_bigrams = []
neg_bigrams = []

for text in positive_comments:
    pos_bigrams.extend(extract_bigrams(text))
    
for text in negative_comments:
    neg_bigrams.extend(extract_bigrams(text))

pos_bigram_freq = dict(Counter(pos_bigrams).most_common(25))
neg_bigram_freq = dict(Counter(neg_bigrams).most_common(25))

with open("processed/bigram_frequencies.json","w") as f:
    json.dump({"positive": pos_bigram_freq, "negative": neg_bigram_freq}, f)

# Enhanced semantic analysis with trigrams
def extract_trigrams(text):
    if pd.isna(text):
        return []
    # Clean text more aggressively for trigrams
    text = re.sub(r'http\S+|www\S+|@\w+|#\w+|\*+|&gt;|&lt;|\[.*?\]|\(.*?\)|[^\w\s]', ' ', str(text).lower())
    words = re.findall(r'\b[a-z]{3,}\b', text)
    
    # Basic stopwords for trigrams
    stopwords = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'way', 'she', 'yet', 'this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'what', 'than', 'many', 'some', 'very', 'when', 'much', 'then', 'them', 'these', 'more', 'your', 'would', 'about', 'think', 'know', 'just', 'first', 'into', 'over', 'also', 'back', 'after', 'well', 'only', 'being', 'where', 'before', 'here', 'through', 'there', 'could', 'should', 'still', 'such', 'make', 'even', 'most', 'other', 'another', 'while', 'again', 'come', 'take', 'want', 'like', 'really'}
    
    # Filter and create trigrams
    filtered_words = [w for w in words if w not in stopwords and len(w) > 2]
    trigrams = []
    for i in range(len(filtered_words) - 2):
        trigram = f"{filtered_words[i]} {filtered_words[i+1]} {filtered_words[i+2]}"
        trigrams.append(trigram)
    
    return trigrams

# Generate trigram frequencies for more semantic context
pos_trigrams = []
neg_trigrams = []

for text in positive_comments:
    pos_trigrams.extend(extract_trigrams(text))
    
for text in negative_comments:
    neg_trigrams.extend(extract_trigrams(text))

pos_trigram_freq = dict(Counter(pos_trigrams).most_common(20))
neg_trigram_freq = dict(Counter(neg_trigrams).most_common(20))

with open("processed/trigram_frequencies.json","w") as f:
    json.dump({"positive": pos_trigram_freq, "negative": neg_trigram_freq}, f)

# 7. Hour-of-Day Heatmap
hour_sentiment = df.groupby('hour')['compound'].mean().reset_index()
hour_sentiment.to_json("processed/hour_sentiment.json", orient='records')

# 8. Day-of-Week Heatmap  
day_sentiment = df.groupby('day_of_week')['compound'].mean().reset_index()
day_sentiment.to_json("processed/day_sentiment.json", orient='records')

# 9. Author-level Sentiment
author_stats = df.groupby('author').agg({
    'compound': ['mean', 'count'],
    'score': 'sum'
}).round(3)
author_stats.columns = ['avg_sentiment', 'comment_count', 'total_score']
author_stats = author_stats[author_stats['comment_count'] >= 5].reset_index()
top_authors = author_stats.nlargest(20, 'avg_sentiment').to_dict(orient='records')

with open("processed/author_sentiment.json","w") as f:
    json.dump(top_authors, f)