#!/usr/bin/env python3
"""
Gubicoo News Fetcher - RSS Feed Ingestion Script
This script fetches news from RSS feeds and stores them in the database.
Run daily via cron job: 0 8 * * * python3 fetch_news.py
"""

import feedparser
import mysql.connector
from datetime import datetime
import re
from html import unescape

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password_here',
    'database': 'gubicoo'
}

# RSS Feed Sources
RSS_FEEDS = [
    {
        "url": "https://www.cicnews.com/feed/",
        "country": "Canada",
        "source": "CIC News",
        "category": "Policy Change"
    },
    {
        "url": "https://www.schengenvisainfo.com/news/feed/",
        "country": "Europe",
        "source": "Schengen Visa Info",
        "category": "Policy Change"
    },
    {
        "url": "https://workpermit.com/feed/",
        "country": "Global",
        "source": "Workpermit.com",
        "category": "Policy Change"
    }
]

# Category detection keywords
CATEGORY_KEYWORDS = {
    "Draw": ["draw", "invitation", "ita", "round", "selected"],
    "Policy Change": ["policy", "change", "update", "announcement", "new rule"],
    "New Program": ["new program", "launch", "introduce", "announce"],
    "Processing Update": ["processing", "time", "delay", "faster", "improve"],
    "Study Visa": ["student", "study", "education", "university"],
    "Work Visa": ["work", "employment", "job", "worker", "permit"]
}

def detect_category(title, summary):
    """Detect news category based on title and summary keywords"""
    text = (title + " " + summary).lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return category
    return "Policy Change"  # Default category

def clean_html(text):
    """Remove HTML tags and decode entities"""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = unescape(text)
    return text.strip()

def get_summary(entry, max_length=200):
    """Extract summary from feed entry"""
    summary = entry.get('summary', '') or entry.get('description', '')
    summary = clean_html(summary)
    if len(summary) > max_length:
        summary = summary[:max_length] + "..."
    return summary

def fetch_and_store_news():
    """Fetch news from RSS feeds and store in database"""
    try:
        # Connect to database
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()
        
        # Check if news table exists, create if not
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                country VARCHAR(50),
                category VARCHAR(50),
                source_name VARCHAR(100),
                source_url TEXT,
                published_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_news (title(100), source_name(50), published_date)
            )
        """)
        
        news_count = 0
        
        # Process each RSS feed
        for feed_config in RSS_FEEDS:
            try:
                print(f"Fetching from {feed_config['source']}...")
                parsed = feedparser.parse(feed_config['url'])
                
                for entry in parsed.entries[:10]:  # Limit to 10 most recent
                    try:
                        title = clean_html(entry.get('title', ''))
                        if not title:
                            continue
                        
                        summary = get_summary(entry)
                        link = entry.get('link', '')
                        
                        # Parse published date
                        published_date = None
                        if hasattr(entry, 'published_parsed') and entry.published_parsed:
                            published_date = datetime(*entry.published_parsed[:3]).date()
                        elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                            published_date = datetime(*entry.updated_parsed[:3]).date()
                        else:
                            published_date = datetime.now().date()
                        
                        # Detect category
                        category = detect_category(title, summary)
                        
                        # Insert news (ignore duplicates)
                        cursor.execute("""
                            INSERT IGNORE INTO news 
                            (title, summary, country, category, source_name, source_url, published_date)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """, (
                            title,
                            summary,
                            feed_config['country'],
                            category,
                            feed_config['source'],
                            link,
                            published_date
                        ))
                        
                        if cursor.rowcount > 0:
                            news_count += 1
                            print(f"  ✓ Added: {title[:50]}...")
                    
                    except Exception as e:
                        print(f"  ✗ Error processing entry: {e}")
                        continue
            
            except Exception as e:
                print(f"✗ Error fetching from {feed_config['source']}: {e}")
                continue
        
        # Commit changes
        db.commit()
        print(f"\n✓ Successfully added {news_count} new articles")
        
        # Clean old news (older than 90 days)
        cursor.execute("""
            DELETE FROM news 
            WHERE published_date < DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        """)
        deleted = cursor.rowcount
        if deleted > 0:
            print(f"✓ Cleaned {deleted} old articles")
        
        cursor.close()
        db.close()
        
    except mysql.connector.Error as e:
        print(f"✗ Database error: {e}")
    except Exception as e:
        print(f"✗ Unexpected error: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("Gubicoo News Fetcher")
    print("=" * 50)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    fetch_and_store_news()
    
    print(f"\nCompleted at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)




