import pandas as pd

posts_df = pd.read_json("data/r_r_invincible_posts.jsonl", lines=True)
comments_df = pd.read_json("data/r_r_invincible_comments.jsonl", lines=True)

# then clean and merge as before
comments_df['post_id'] = comments_df['link_id'].str.replace(r'^t3_', '', regex=True)

merged = comments_df.merge(
    posts_df[['id','title','link_flair_text','score','created_utc']],
    left_on='post_id', right_on='id',
    how='left',
    suffixes=('','_post')
)

print(merged.head())
print(merged.info())   
print(merged.shape)
print(merged.isnull().sum())
print(merged.describe())

merged.to_csv("data/merged.csv", index=False)
