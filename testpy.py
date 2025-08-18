import time
import os
import shutil
import tempfile
from datetime import datetime
from supabase import create_client, Client
from supabase.client import ClientOptions
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

start = time.time()
driver = None

url: str = os.environ.get("SUPABASE_URL")
anon_key: str = os.environ.get("SUPABASE_KEY")

if not url or not anon_key:
    raise ValueError("Supabase URL or Service Role Key is not set in the environment!")

supabase: Client = create_client(
    url, 
    anon_key,
    options=ClientOptions(
        postgrest_client_timeout=4,
        storage_client_timeout=4,
        schema="public",
    )
)

auth_response = supabase.auth.sign_in_with_password({
            "email": "teddytrauner@gmail.com",
            "password": "scrape123"
        })
print("Auth successful:", auth_response.user.id)

try:
    tables = supabase.table("danceClassStorage").select("count").execute()
    print("Successful connection to SupabaseDB")
except Exception as e:
    print("Connection error:", str(e))

def safe_find(element, xpath, default="N/A"):
    try:
        return element.find_element(By.XPATH, xpath).text
    except NoSuchElementException:
        return default

def scrape_class_data(driver, studio_name):
    try:
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.ClassTimeScheduleList_wrapper__Pve3t")))        
        print("Classes loaded successfully")
    except TimeoutException:
        print("Timeout waiting for classes load")
        return []
    except NoSuchElementException:
        print("Class schedule parent container not found")
        return []

    try:
        parent_container = driver.find_element(By.XPATH, ".//div[contains(@class, 'ClassTimeScheduleList_wrapper__Pve3t')]")
        print("Parent container found")
    except (TimeoutException, NoSuchElementException):
        print("Class schedule wrapper not found")
        return []

    try:
        class_Elements = parent_container.find_elements(By.CSS_SELECTOR, "div.ClassTimeScheduleItemDesktop_separator__1vvuL")
        if len(class_Elements) == 0:
            print("WARNING: No class elements found")
            return []
    except NoSuchElementException:
        print("Class containers not found")
        return []

    try:
        Date = driver.find_element(By.XPATH, '//h5[contains(@class, "is-marginless")]').text
        print(f'preformat date: {Date}')
        Date = Date[11:len(Date)]
        Date_formatted = datetime.strptime(Date + f", {datetime.now().year}", "%A, %B %d, %Y").date().isoformat()
        print(f'format date: {Date_formatted}')
    except NoSuchElementException:
        print("Date not found")
        Date_formatted = "N/A"

    class_list = []
    for element in class_Elements:
        className = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_classLink__1tyYz")]')
        Instructor = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_link__1gju5")]')
        Price = safe_find(element, './/p[contains(@class, "Price_price__295Er Price_priceFont__1nZCw")]')
        raw_time = safe_find(element, './/h5[contains(@class, "has-text-primary is-marginless")]')
        try:
            Time_clean = raw_time.strip().split(" ")[0].lower()
            Time_formatted = datetime.strptime(Time_clean, "%I:%M%p").time().isoformat()
        except ValueError as ve:
            print(f"Time parsing error for '{raw_time}': {ve}")
            Time_formatted = "00:00:00"
        Length = safe_find(element, './/p[contains(@class, "ClassTimeScheduleItemDesktop_endTime__26mcG")]', "N/A").replace("(", "").replace(")", "")
        class_item = {'classname': className,
                      'instructor': Instructor,
                      'price': Price,
                      'time': Time_formatted,
                      'length': Length,
                      'date': Date_formatted,
                      'studio_name': studio_name}
        class_list.append(class_item)

    return class_list

consent_clicked = False

def scrape(driver, url, studio_name):
    global consent_clicked
    start = time.time()
    print(f"\nScraping {url}")
    driver.get(url)
    actions = ActionChains(driver)

    if not consent_clicked:
        try:
            consent_button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "truste-consent-button")))
            consent_button.click()
            consent_clicked = True
            print("DEBUG: Consent button clicked")
        except (TimeoutException, NoSuchElementException):
            print("DEBUG: Consent button not found or timed out")

    all_classes = []
    processed_dates = set()

    for current_week in range(1, 4):
        print(f"DEBUG: Starting week {current_week}")

        try:
            week_container = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "columns.is-vcentered.is-mobile"))
            )
        except (TimeoutException, NoSuchElementException):
            print(f"ERROR: Week {current_week} container not found")
            continue

        # Extract day buttons properly
        day_button_elements = week_container.find_elements(By.CLASS_NAME, "Day_item__1lPxK")
        filtered_day_buttons = []

        for idx, button in enumerate(day_button_elements):
            try:
                day_name_elem = button.find_element(By.CLASS_NAME, "Day_uppercase__A-4T9")
                day_name = day_name_elem.text.strip()[:3].capitalize()
                if day_name in ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]:
                    filtered_day_buttons.append(button)
                    print(f"DEBUG: Week {current_week}, button {idx} is a valid day: {day_name}")
                else:
                    print(f"DEBUG: Week {current_week}, button {idx} ignored (not a day): {day_name}")
            except NoSuchElementException:
                print(f"DEBUG: Week {current_week}, button {idx} ignored (no Day_uppercase__A-4T9 element)")

        print(f"DEBUG: Week {current_week}, found day buttons: {len(filtered_day_buttons)}")

        # Loop through day buttons
        for day_idx, button in enumerate(filtered_day_buttons):
            try:
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
                actions.move_to_element(button).click().perform()
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.ClassTimeScheduleList_wrapper__Pve3t"))
                )
                classes = scrape_class_data(driver, studio_name)
                if classes:
                    scraped_date = classes[0]['date']
                    if scraped_date not in processed_dates:
                        processed_dates.add(scraped_date)
                        all_classes.extend(classes)
                        print(f"DEBUG: Added {len(classes)} classes for {scraped_date}")
                    else:
                        print(f"DEBUG: Skipping duplicate date {scraped_date}")
                else:
                    print(f"DEBUG: No classes found for day index {day_idx}")
            except Exception as e:
                print(f"ERROR: Clicking day button {day_idx} failed: {str(e)}")

        # Click next week arrow (always last button)
        try:
            next_button = week_container.find_elements(By.CLASS_NAME, "Arrow_arrow__2dDFC")[-1]
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", next_button)
            actions.move_to_element(next_button).click().perform()
            print(f"DEBUG: Clicked 'next week' button for week {current_week}")
            time.sleep(1)  # small pause to allow new week to render
        except Exception as e:
            print(f"ERROR: Next week button click failed: {str(e)}")
            break

    return all_classes

websites = [
    {'studio_name': 'TMILLY', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/tmilly-studio'},
    {'studio_name': 'MDC', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/millennium-dance-complex-studio-city'},
    {'studio_name': 'ML', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/movement-lifestyle-noho'},
    {'studio_name': 'EIGHTYEIGHT', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/eighty-eight-studios'},
    {'studio_name': 'PLAYGROUND', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/the-playground-la'},
    {'studio_name': 'THESIX', 'studio_url': 'https://www.mindbodyonline.com/explore/locations/the-six-compound'}
]

studios = {'TMILLY', 'MDC', 'ML', 'EIGHTYEIGHT', 'PLAYGROUND', 'THESIX'}

def clear_previous_classes(supabase, studio_name):
    try:
        response = supabase.table("danceClassStorage").delete().eq("studio_name", studio_name).execute()
        print(f'Success deleting classes from {studio_name}')
    except Exception as e:
        print(f"Error deleting classes for studio {studio_name}: {e}")


chrome_profile_dir = tempfile.mkdtemp()

try:
    op = Options()
    op.add_argument("--headless")
    op.add_argument("--no-sandbox")
    op.add_argument("--disable-dev-shm-usage")
    op.add_argument("--disable-gpu")
    op.add_argument("--window-size=1920,1080")
    op.page_load_strategy = 'none'
    op.add_argument('--log-level=3')
    op.add_argument(f"--user-data-dir={chrome_profile_dir}")
    driver = webdriver.Chrome(options=op)

    for studio in studios:
        try:
            clear_previous_classes(supabase, studio)
        except Exception as e:
            print(f"[DEBUG] Error deleting classes for studio {studio}: {e}")

    for studio in websites:
        try:
            class_data = scrape(driver, studio['studio_url'], studio['studio_name'])
            print(f"Inserting {len(class_data)} classes for {studio['studio_name']}")
            if class_data:
                supabase.table("danceClassStorage").insert(class_data).execute()
                print(f"DEBUG: Inserted class data for {studio['studio_name']}")
        except Exception as e:
            print(f"ERROR: Processing {studio['studio_name']} failed: {str(e)}")

    print("\nAll operations completed")

except Exception as e:
    print(f"Chrome error: {e}")

finally:
    if driver:
        driver.quit()
    shutil.rmtree(chrome_profile_dir, ignore_errors=True)

end = time.time()
print(f"\nTotal execution time: {end - start} seconds")
