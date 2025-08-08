# current working version of scraping an entire week of data and entering it into a sql database
# doubles mondays and tuesdays for TMILLY becausse they have no weekend classes
# Date 3/26/2025 7:32 PM
# Derek Trauner
import mysql
import mysql.connector
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC

start = time.time()
#connect to sql database
#EXTRA TEST
mydb = mysql.connector.connect(
  host="localhost",
  user="dance",
  password="5678",
  database="danceappstorage"
)

mycursor = mydb.cursor()

def scrape_class_data(driver):
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
        Date = Date[11:len(Date)]
    except NoSuchElementException:
        print("Date not found")
        Date = "N/A"
    # Loop through each class element and extract the data
    class_list = []
    for element in class_Elements:
        className = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_classLink__1tyYz")]')  # Query within the parent container
        Instructor = safe_find(element, './/a[contains(@class, "ClassTimeScheduleItemDetails_link__1gju5")]')
        Price = safe_find(element, './/p[contains(@class, "Price_price__295Er Price_priceFont__1nZCw")]')
        Time = safe_find(element, './/h5[contains(@class, "has-text-primary is-marginless")]')
        Length = safe_find(element, './/p[contains(@class, "ClassTimeScheduleItemDesktop_endTime__26mcG")]', "N/A").replace("(", "").replace(")", "")
        class_item = (
            className,
            Instructor,
            Price,
            Time,
            Length,
            Date
        )
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

def scrape(driver, url):
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
        print("Finding day button");
        day_button_elements = entire_week_button_container.find_elements(By.XPATH, './/div[contains(@class, "column")]')
        print(len(day_button_elements))
    except TimeoutException:
        print("Timeout waiting for day button container")
        return []
    except NoSuchElementException:
        print("Day button element not found")
        return []
    # code to scrape the class schedule from the page
    all_classes = []
    processed_dates = set()  # track dates already scraped
    for day, button in enumerate(day_button_elements):
        day_text = button.text.strip()
        if not day_text:
            print(f"Skipping day button at index {day} because text is empty")
            continue
        try:
            WebDriverWait(driver, 5).until(EC.element_to_be_clickable(button))
            actions.move_to_element(button).click().perform()
            print(f"Day button for {day_text} clicked")
            classes = scrape_class_data(driver)
            if classes:
                # using the date from the first scraped record as key (adjust index based on your tuple)
                scraped_date = classes[0][-1]
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
    ("https://www.mindbodyonline.com/explore/locations/tmilly-studio", "INSERT INTO tmilly (classname, instructor, price, time, length, date) VALUES (%s, %s, %s, %s, %s, %s)"),
    ("https://www.mindbodyonline.com/explore/locations/movement-lifestyle-noho", "INSERT INTO ml (classname, instructor, price, time, length, date) VALUES (%s, %s, %s, %s, %s, %s)"),
    ("https://www.mindbodyonline.com/explore/locations/millennium-dance-complex-studio-city", "INSERT INTO mdc (classname, instructor, price, time, length, date) VALUES (%s, %s, %s, %s, %s, %s)")
]

for table in ["mdc", "ml", "tmilly"]:
    mycursor.execute(f"DELETE FROM {table}")
    mycursor.execute(f"ALTER TABLE {table} AUTO_INCREMENT = 1")

mydb.commit()

try:
    op = webdriver.ChromeOptions()
    op.add_argument('headless')
    op.page_load_strategy = 'none'
    op.add_argument('--log-level=3')
    driver = webdriver.Chrome(options=op)

    for url, sql in websites:
        try:
            class_data = scrape(driver, url)
            print(f"Entering data for {url}")
            mycursor.executemany(sql, class_data)
            print(f"Completed {url.split('/')[-1]}:")
        except Exception as e:
            print(f"Error processing {url}: {str(e)}")
            
    mydb.commit()
    print("\nAll operations completed")
    print(f"{mycursor.rowcount} records inserted.")
    
finally:
    # Clean up resources
    driver.quit()
    mycursor.close()
    mydb.close()
    
end = time.time()
print(f"\nTotal execution time: {end - start} seconds")