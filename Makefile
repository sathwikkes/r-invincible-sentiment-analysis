.PHONY: pipeline serve-dashboard clean

# Run full ETL pipeline: data wrangling, sentiment, metrics export
pipeline:
	python backend/data_wrangling.py
	python backend/sentiment_analysis.py
	python backend/metrics_export.py

# Launch the React dashboard (Vite dev server)
serve-dashboard:
	cd dashboard && npm run dev

# Clean processed outputs
clean:
	rm -rf processed/*