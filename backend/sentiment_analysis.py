import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk

# 1. download VADER lexicon if you haven’t yet
nltk.download('vader_lexicon')

def compute_sentiment(df, text_col='body'):
    sia = SentimentIntensityAnalyzer()
    # apply to each comment
    scores = df[text_col].fillna("").apply(sia.polarity_scores)
    # turn into columns
    scores_df = pd.DataFrame(list(scores))
    return pd.concat([df.reset_index(drop=True), scores_df], axis=1)

if __name__ == "__main__":
    merged = pd.read_csv("data/merged.csv")  # or however you saved it
    merged_sent = compute_sentiment(merged, text_col='body')
    # save for downstream JSON exports
    merged_sent.to_json("processed/merged_with_sentiment.json", orient='records', lines=True)