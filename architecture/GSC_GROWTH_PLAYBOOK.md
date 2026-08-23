# Search Console growth playbook

## Operating cadence

Use actual Google Search Console bulk-export data to choose improvements; page count is not demand. Review fast signals weekly and durable trends monthly. Log the query window, filters, selected opportunity, owner, release date, and result.

Replace `{{project}}.{{dataset}}.{{searchdata_url_impression}}` with the deployed BigQuery table. Confirm field names against the live export before running these templates.

## Recurring opportunity categories

A. High impressions with low CTR.  
B. Average position 4–15.  
C. Average position 15–30.  
D. Pages declining week over week or month over month.  
E. Rising queries.  
F. Query/page cannibalization.  
G. Pages losing clicks despite stable impressions.  
H. Indexed but low-click pages.  
I. Locale opportunities among genuinely published localizations.  
J. Content gaps supported by query demand.

Thresholds below are placeholders to calibrate from real distributions.

## SQL templates

### High impressions, low CTR

```sql
SELECT url, SUM(impressions) impressions, SUM(clicks) clicks,
 SAFE_DIVIDE(SUM(clicks),SUM(impressions)) ctr,
 SAFE_DIVIDE(SUM(sum_top_position),SUM(impressions))+1 avg_position
FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
WHERE data_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY) AND DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY url HAVING impressions >= {{minimum_impressions}} AND ctr < {{ctr_threshold}}
ORDER BY impressions DESC;
```

### Position 4–15

```sql
SELECT query,url,SUM(impressions) impressions,SUM(clicks) clicks,
 SAFE_DIVIDE(SUM(sum_top_position),SUM(impressions))+1 avg_position
FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY) AND NOT is_anonymized_query
GROUP BY query,url HAVING avg_position BETWEEN 4 AND 15 AND impressions >= {{minimum_impressions}}
ORDER BY impressions DESC;
```

### Page decline week over week

```sql
WITH x AS (SELECT url,IF(data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 7 DAY),'current','previous') period,
 SUM(clicks) clicks,SUM(impressions) impressions
 FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
 WHERE data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 14 DAY) GROUP BY url,period)
SELECT url,MAX(IF(period='current',clicks,NULL)) current_clicks,
 MAX(IF(period='previous',clicks,NULL)) previous_clicks,
 SAFE_DIVIDE(MAX(IF(period='current',clicks,NULL))-MAX(IF(period='previous',clicks,NULL)),MAX(IF(period='previous',clicks,NULL))) change
FROM x GROUP BY url HAVING previous_clicks >= {{minimum_previous_clicks}} ORDER BY change;
```

### Page decline month over month

Use the preceding query with two complete 28-day periods, a 56-day source window, and `INTERVAL 28 DAY` in the period expression. Annotate seasonality and releases.

### Query growth

```sql
WITH x AS (SELECT query,IF(data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 28 DAY),'current','previous') period,
 SUM(clicks) clicks,SUM(impressions) impressions
 FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
 WHERE data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 56 DAY) AND NOT is_anonymized_query GROUP BY query,period)
SELECT query,MAX(IF(period='current',impressions,NULL)) current_impressions,
 MAX(IF(period='previous',impressions,NULL)) previous_impressions
FROM x GROUP BY query HAVING current_impressions>previous_impressions
ORDER BY current_impressions-previous_impressions DESC;
```

### Query/page cannibalization

```sql
SELECT query,COUNT(DISTINCT url) pages,
 ARRAY_AGG(STRUCT(url,impressions,clicks) ORDER BY impressions DESC LIMIT 10) competing_pages
FROM (SELECT query,url,SUM(impressions) impressions,SUM(clicks) clicks
 FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
 WHERE data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 28 DAY) AND NOT is_anonymized_query GROUP BY query,url)
GROUP BY query HAVING pages>1 AND SUM(impressions)>={{minimum_impressions}} ORDER BY pages DESC;
```

### Locale/subdirectory performance

```sql
SELECT COALESCE(REGEXP_EXTRACT(url,r'https?://[^/]+/(en|hi|fr|ja)(?:/|$)'),'other') locale,
 SUM(clicks) clicks,SUM(impressions) impressions,SAFE_DIVIDE(SUM(clicks),SUM(impressions)) ctr
FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
WHERE data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 28 DAY) GROUP BY locale ORDER BY clicks DESC;
```

### Content-cluster performance

```sql
SELECT CASE
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/personality/') THEN 'Personality'
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/compare(?:/|$)') THEN 'Compare'
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/(careers|personality/[^/]+/careers)(?:/|$)') THEN 'Careers'
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/insights(?:/|$)') THEN 'Insights'
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/jobs(?:/|$)') THEN 'Jobs'
 WHEN REGEXP_CONTAINS(url,r'/(en|hi|fr|ja)/community(?:/|$)') THEN 'Community'
 ELSE 'Other' END cluster,
 SUM(clicks) clicks,SUM(impressions) impressions,SAFE_DIVIDE(SUM(clicks),SUM(impressions)) ctr
FROM `{{project}}.{{dataset}}.{{searchdata_url_impression}}`
WHERE data_date>=DATE_SUB(CURRENT_DATE(),INTERVAL 28 DAY) GROUP BY cluster ORDER BY clicks DESC;
```

## CTR optimization

Select targets from actual impression and position data. Inspect query intent, title, description, snippet alignment, genuine freshness, structured data, and live SERP competition. Change a small cohort, annotate the release, compare equivalent windows, and retain only improvements. Do not rewrite titles at scale automatically.

## Content expansion gate

A page family needs distinct demonstrated intent, useful first-party/editorial content, a clear canonical owner, supportive internal links, maintainable localization, and query or keyword evidence. Reject mass personality-role combinations, thin AI pages, location/job pages without inventory, and near-duplicate localized pages.

## Organic conversion

Join GSC landing clusters to privacy-safe analytics cohorts, not personal identifiers. Measure organic landing → deeper content; Personality → Careers; Career → Jobs; Jobs directory → detail; detail → signup/save/apply; Insight landing → start; and assessment start → completion. Reuse the event registry rather than duplicating events.
