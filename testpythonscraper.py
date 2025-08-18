import requests
import json

# IDs from the HTML
VICE_ACCOUNT_ID = "c5a5ef2b-3e73-4fcf-8fcb-0c23d418b5f5"
VICE_SITE_ID = "e295a7c0-48a1-4337-81ec-447eb7433ccd"

# Base Vice API endpoint
BASE_URL = f"https://sd.mindbodyonline.com/mndbdy/vice_loader/{VICE_ACCOUNT_ID}/{VICE_SITE_ID}"

# Headers to look like a browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/135.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.mindbodyonline.com/",
    "Origin": "https://www.mindbodyonline.com",
    "Connection": "keep-alive"
}

def get_classes(start_date: str, end_date: str):
    """Fetch classes between two dates from Vice API."""
    payload = {
        "method": "GetClasses",
        "params": {
            "StartDateTime": start_date,
            "EndDateTime": end_date,
            "HideCanceledClasses": True,
            "locationIDs": [],
            "sessionTypeIDs": [],
            "staffIDs": [],
            "classIDs": []
        }
    }

    response = requests.post(BASE_URL, headers=HEADERS, json=payload, timeout=30)
    response.raise_for_status()
    data = response.json()

    # Vice API usually wraps classes under 'Classes' or similar key
    return data.get("Classes", [])

if __name__ == "__main__":
    classes = get_classes("2025-08-17", "2025-08-24")
    print(json.dumps(classes, indent=2))
