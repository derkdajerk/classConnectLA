import requests
import json
from datetime import datetime

# 1) Endpoint + headers (fill in your own session-id if it changes)
url = "https://prod-mkt-gateway.mindbody.io/v1/search/class_times"
headers = {
    "Accept": "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    "Origin": "https://www.mindbodyonline.com",
    "X-Mb-App-Build": "2025-05-15T11:50:38.730Z",
    "X-Mb-App-Name": "mindbody.io",
    "X-Mb-App-Version": "2b4c248a", # from 5/22/25 9:58pm
    "X-Mb-User-Session-Id": "oeu1737512053624r0.9044053025533318",
}

# 2) Payload: adjust your date-range + slug here as needed
payload = {
    "sort": "start_time",
    "page": {"size": 100, "number": 1},
    "filter": {
        "radius": 0,
        "startTimeRanges": [
            {
                "from": "2025-05-23T07:00:00.000Z",
                "to":   "2025-05-24T06:59:59.999Z"
            }
        ],
        "locationSlugs": ["tmilly-studio"],
        "include_dynamic_pricing": "true",
        "inventory_source": ["MB"]
    }
}

# 3) Fire the request and parse JSON
resp = requests.post(url, headers=headers, json=payload)
resp.raise_for_status()
data = resp.json()

# 4) Build lookup maps from the "included" section
course_map = {
    item["id"]: item["attributes"]["name"]
    for item in data.get("included", [])
    if item["type"] == "course"
}
staff_map = {
    item["id"]: item["attributes"]["name"]
    for item in data.get("included", [])
    if item["type"] == "staff"
}

# 5) Extract each class
classes = []
for entry in data.get("data", []):
    attr = entry["attributes"]
    rel  = entry["relationships"]

    # find the single-session price
    price = None
    for option in attr.get("purchaseOptions", []):
        if option.get("isSingleSession"):
            price = option["pricing"]["online"]
            break

    # parse ISO timestamps into a Python date
    start_iso = attr["startTime"]
    dt_start  = datetime.fromisoformat(start_iso.replace("Z", "+00:00"))

    classes.append({
        "name":        course_map.get(rel["course"]["data"]["id"], ""),
        "category":    attr.get("category"),
        "style":       attr.get("subcategory"),
        "instructor":  staff_map.get(rel["staff"]["data"]["id"], ""),
        "start_time":  start_iso,
        "end_time":    attr.get("endTime"),
        "length_min":  attr.get("duration"),
        "price_usd":   price,
        "date":        dt_start.date().isoformat()
    })

# 6) Print out the result
print(json.dumps(classes, indent=2))
