# working on converting script to use supabase database, not mysql to be used with web app Class Connect.
# classconnect.derktrauner.com
# Date 4/9/2025 12:36 AM
# Derek Trauner
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
    print("Succesful connection to SupabaseDB")
except Exception as e:
    print("Connection error:", str(e))

def scrape_class_data(driver, studio_name):
    # Wait for the parent class container to load
    try:
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.ClassTimeScheduleList_wrapper__Pve3t")))        
        print("Classes loaded successfully")
    except TimeoutException:
        print("Timeout waiting for classes load")
        return []
    except NoSuchElementException:
        print("Class schedule parent container not found")
        return []
    # Find the parent container for the class schedule
    try:
        parent_container = driver.find_element(By.XPATH, ".//div[contains(@class, 'ClassTimeScheduleList_wrapper__Pve3t')]")
        print("Parent container found")
        #print(parent_container.get_attribute('outerHTML'))  # Debug print
    except TimeoutException:
        print("Timeout waiting for parent contrainer")
        return []
    except NoSuchElementException:
        print("Class schedule wrapper not found")
        return []
    # Select all the class elements
    try:
        class_Elements = parent_container.find_elements(By.CSS_SELECTOR, "div.ClassTimeScheduleItemDesktop_separator__1vvuL")
        if len(class_Elements) == 0:
            print("WARNING: No class elements found")
            return []
    except NoSuchElementException:
        print("Class containers not found")
        return []
    # Get the date of the classes
    try:
        Date = driver.find_element(By.XPATH, '//h5[contains(@class, "is-marginless")]').text
        print(f'preformat date: {Date}')
        Date = Date[11:len(Date)]
        Date_formatted = datetime.strptime(Date + f", {datetime.now().year}", "%A, %B %d, %Y").date().isoformat()
        print(f'format date: {Date}')
    except NoSuchElementException:
        print("Date not found")
        Date = "N/A"
    # Loop through each class element and extract the data
    class_list = []
    for element in class_Elements:
        className = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_classLink__1tyYz")]')  # Query within the parent container
        Instructor = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_link__1gju5")]')
        Price = safe_find(element, './/p[contains(@class, "Price_price__295Er Price_priceFont__1nZCw")]')
        raw_time = safe_find(element, './/h5[contains(@class, "has-text-primary is-marginless")]')
        print(f"preformat time: {raw_time}")
        try:
            Time_clean = raw_time.strip().split(" ")[0].lower()
            Time_formatted = datetime.strptime(Time_clean, "%I:%M%p").time().isoformat()
        except ValueError as ve:
            print(f"Time parsing error for '{raw_time}': {ve}")
            Time_formatted = "00:00:00"
        Length = safe_find(element, './/p[contains(@class, "ClassTimeScheduleItemDesktop_endTime__26mcG")]', "N/A").replace("(", "").replace(")", "")
        class_item = {'classname' : className,
                   'instructor' : Instructor,
                   'price'  : Price,
                   'time' : Time_formatted,
                   'length' : Length,
                   'date' : Date_formatted,
                   'studio_name' : studio_name}
        # print(f"type of class_item:{type(class_item)}")
        class_list.append(class_item)
    end = time.time()
    length = end - start
    print("\nIt took", length, "seconds!")
    return class_list

def safe_find(element, xpath, default="N/A"):
    try:
        return element.find_element(By.XPATH, xpath).text
    except NoSuchElementException:
        return default

consent_clicked = False

def scrape(driver, url, studio_name):
    global consent_clicked
    print("test")
    start = time.time()
    print(f"\nScraping {url}")
    driver.get(url)
    actions = ActionChains(driver)
    # Only click the consent button if it hasn't been clicked before
    if not consent_clicked:
        try:
            consent_button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "truste-consent-button")))
            consent_button.click()
            consent_clicked = True
            print("Consent button clicked")
        except TimeoutException:
            print("Consent button timed out")
        except NoSuchElementException:
            print("Consent button not found")
    else:
        print("Consent already given, skipping consent button")
    # Find the week button container
    try:
        print("Trying to find entire week's button container")
        entire_week_button_container = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, './/div[contains(@class, "columns is-vcentered is-mobile")]')))
        print("Entir Week's button container found")
        #print(week_button_container.get_attribute('outerHTML'))  # Debug print
    except TimeoutException:
        print("Timeout waiting for week button container")
        return []
    except NoSuchElementException:
        print("Week button container not found")
        return []
    
    # Find the day button and press it
    try:
        print("Finding day buttons");
        day_button_elements = entire_week_button_container.find_elements(By.XPATH, './/div[contains(@class, "column")]')
        day_texts = [button.text.strip() for button in day_button_elements]
        print("Day buttons found:", day_texts)  
        print(f"amount of day buttons found: {len(day_button_elements)}")
    except TimeoutException:
        print("Timeout waiting for day button container")
        return []
    except NoSuchElementException:
        print("Day button element not found")
        return []
    # code to scrape the class schedule from the page
    all_classes = []
    processed_dates = set()  # track dates already 
    last_heading_text = ""
    for day, button in enumerate(day_button_elements):
        day_text = button.text.strip()
        if not day_text:
            print(f"Skipping day button at index {day} because text is empty")
            continue        
        
        try:
            WebDriverWait(driver, 5).until(EC.element_to_be_clickable(button))
            try:
                last_heading_text = driver.find_element(By.XPATH, '//h5[contains(@class, "is-marginless")]').text
            except NoSuchElementException:
                last_heading_text = ""

            # Ensure button is in view, then click
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
            actions.move_to_element(to_element=button).click().perform()

            # Wait for the header to change to confirm day switch
            try:
                WebDriverWait(driver, 10).until(
                    lambda d: d.find_element(By.XPATH, '//h5[contains(@class, "is-marginless")]').text != last_heading_text
                )
            except TimeoutException:
                print("Timeout waiting for heading to change after click")

            # Ensure the class list container is present before scraping
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.ClassTimeScheduleList_wrapper__Pve3t"))
            )
            print(f"Day button for {day_text} clicked")
            classes = scrape_class_data(driver, studio_name)
            print(f"Found {len(classes)} classes for {day_text}")
            if classes:
                # using the date from the first scraped record as key (adjust index based on your tuple)
                scraped_date = classes[0].get('date')
                # print(classes[0]) # debug statement to show what class is printing
                print(f"scraped date:{scraped_date}")
                if scraped_date in processed_dates:
                    print(f"Skipping duplicate date: {scraped_date}")
                    continue
                processed_dates.add(scraped_date)
                print(f"Adding classes for {scraped_date}")
                all_classes.extend(classes)
            else:
                print(f"No classes found for button at index {day} ({day_text})")
        except Exception as e:
            print(f"Error processing day button at index {day} ({day_text}): {str(e)}")
    
    end = time.time()
    print("\nIt took", end - start, "seconds to scrape an entire week of classes!")
    return all_classes

websites = [
    {
        'studio_name': 'TMILLY',
        'studio_url': 'https://www.mindbodyonline.com/explore/locations/tmilly-studio'
    },
    {
        'studio_name': 'MDC',
        'studio_url': 'https://www.mindbodyonline.com/explore/locations/millennium-dance-complex-studio-city'
    },
    {
        'studio_name': 'ML',
        'studio_url': 'https://www.mindbodyonline.com/explore/locations/movement-lifestyle-noho'
    },
    {
        'studio_name': 'EIGHTYEIGHT',
        'studio_url': 'https://www.mindbodyonline.com/explore/locations/eighty-eight-studios'
    },
    {
        'studio_name': 'PLAYGROUND',
        'studio_url': 'https://www.mindbodyonline.com/explore/locations/the-playground-la'
    }
]


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

    # with open("logs/scraper.log", "a") as f:
    #     f.write(f"Scraped at {datetime.now()}\n")

    records = supabase.table("danceClassStorage").select("class_id").execute()

    # Extract list of UUIDs
    ids = [row["class_id"] for row in records.data]

    # Only delete if IDs exist
    if ids:
        supabase.table("danceClassStorage").delete().in_("class_id", ids).execute()
        print(f"Deleted {len(ids)} rows")
        print("Sucessfully deleted previous class data")
    else:
        print("No rows to delete")

    for studio in websites:
        try:
            class_data = scrape(driver, studio.get('studio_url'), studio.get('studio_name'))
            # print(type(class_data))
            print(f"inserting 1 week of class data for {studio.get('studio_url')}")
            try:
                response = (
                supabase.table("danceClassStorage")
                .insert(class_data)
                .execute()
                )
                print("import dictionary of classes sucess")
            except Exception as e:
                print("Error insertingss:", str(e))
            print(f"Completed {studio.get('studio_url')}:")
        except Exception as e:
            print(f"Error processing {studio.get('studio_url')}: {str(e)}")

    print("\nAll operations completed")

except Exception as e:
    print(f"Chrome error: {e}")
    
# Clean up resources
finally:
    if driver:
        driver.quit()    
    
end = time.time()

shutil.rmtree(chrome_profile_dir, ignore_errors=True)

print(f"\nTotal execution time: {end - start} seconds")
