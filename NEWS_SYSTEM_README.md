# Gubicoo News System - Setup Guide

## Overview
The Gubicoo News System fetches immigration news from RSS feeds and displays them in a unified feed with country and category filtering.

## Frontend Implementation ✅
The frontend is already implemented and working with sample data. It includes:
- News feed display
- Country and category filtering
- Search functionality
- News detail modals
- Responsive design

## Backend Setup (Required for Production)

### 1. Database Setup

Create the news table in your MySQL database:

```sql
CREATE TABLE news (
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
);
```

### 2. Python RSS Fetcher Setup

1. Install required Python packages:
```bash
pip install feedparser mysql-connector-python
```

2. Update `fetch_news.py`:
   - Set your database credentials in `DB_CONFIG`
   - Add/modify RSS feeds in `RSS_FEEDS` array

3. Test the script:
```bash
python3 fetch_news.py
```

4. Set up cron job (runs daily at 8 AM):
```bash
crontab -e
# Add this line:
0 8 * * * /usr/bin/python3 /path/to/fetch_news.py >> /path/to/news_fetch.log 2>&1
```

### 3. API Endpoint Setup

#### Option A: PHP (provided)
1. Update `api_news.php` with your database credentials
2. Place in your web server's API directory
3. Update frontend to call: `/api/news.php`

#### Option B: Node.js/Express
```javascript
// api/news.js
const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'gubicoo'
});

router.get('/', (req, res) => {
  const { country, category, limit = 50 } = req.query;
  let query = 'SELECT * FROM news WHERE 1=1';
  const params = [];
  
  if (country && country !== 'all') {
    query += ' AND country = ?';
    params.push(country);
  }
  
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY published_date DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: results });
  });
});

module.exports = router;
```

### 4. Update Frontend to Use API

In `client-dashboard.js`, update the `loadNewsFromAPI()` function:

```javascript
async function loadNewsFromAPI() {
    try {
        const country = document.getElementById('newsCountryFilter')?.value || 'all';
        const category = document.getElementById('newsCategoryFilter')?.value || 'all';
        
        const response = await fetch(`/api/news.php?country=${country}&category=${category}&limit=100`);
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                NEWS_DATA = result.data;
                filteredNews = [...NEWS_DATA];
                displayNews();
                updateNewsStats();
            }
        }
    } catch (error) {
        console.error('Error loading news:', error);
        // Fallback to local data
        filteredNews = [...NEWS_DATA];
        displayNews();
        updateNewsStats();
    }
}
```

## RSS Feed Sources

### Primary Sources (Global)
- Y-Axis Immigration: https://www.y-axis.com/news/
- Crown World Mobility: https://www.crownworldmobility.com/insights/
- Workpermit.com: https://workpermit.com/

### Country-Specific
- **Canada**: https://www.cicnews.com/feed/
- **Australia**: Check Department of Home Affairs website
- **UK**: https://www.gov.uk/government/announcements
- **Germany**: https://www.make-it-in-germany.com/en/working-in-germany/news
- **Europe**: https://www.schengenvisainfo.com/news/feed/

## Features

✅ **Frontend Features (Implemented)**
- News feed with cards
- Country filtering (Canada, Australia, UK, Germany, Europe, Global)
- Category filtering (Draw, Policy Change, New Program, etc.)
- Search functionality
- News detail modals
- Statistics display
- Refresh button
- Responsive design
- Dark mode support

✅ **Backend Features (Ready to Implement)**
- RSS feed parsing
- Automatic news ingestion
- Database storage
- Duplicate prevention
- Old news cleanup (90 days)
- Category auto-detection

## Testing

1. **Test Frontend**: 
   - Navigate to News & Updates section
   - Test filters and search
   - Click news items to view details

2. **Test Backend**:
   - Run `python3 fetch_news.py` manually
   - Check database for new entries
   - Test API endpoint: `curl http://localhost/api/news.php`

## Maintenance

- **Daily**: Cron job fetches new news automatically
- **Weekly**: Review and update RSS feed sources
- **Monthly**: Check database size and optimize if needed

## Troubleshooting

**No news showing?**
- Check if database has data
- Verify API endpoint is accessible
- Check browser console for errors

**RSS feed not working?**
- Verify feed URL is accessible
- Check feed format (should be valid RSS/Atom)
- Review error logs

**Duplicate news?**
- UNIQUE constraint should prevent duplicates
- Check if published_date format is consistent




