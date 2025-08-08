# took 17-20 seconds for just the 3 scrapes alone to run like this
import mysql
import mysql.connector
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
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

def safe_find(element, xpath, default="N/A"):
    try:
        return element.find_element(By.XPATH, xpath).text
    except NoSuchElementException:
        return default

def scrape(driver, url):
    print("test")
    start = time.time()
    print(f"\nScraping {url}")
    driver.get(url)
    
    # Find the week button container
    try:
        print("Trying to find week button container")
        # Wait for the parent class container to load
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, './/div[contains(@class, "StudioSchedule_wrapper__3-1d7")]')))
        print("presence located")
        parent_container = driver.find_element(By.XPATH, './/div[contains(@class, "StudioSchedule_wrapper__3-1d7")]')  # locate parent container
        print(parent_container.get_attribute('outerHTML'))  # Debug print
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//div[contains(@class, "columns is-vcentered is-mobile")]')))  # wait for week button container to load
        #week_button_container = parent_container.find_element(By.XPATH, "//body/div[@id='root']/main/div/div/div/div[2]/div[1]/div[1]" ) # select the week button container
        #week_button_container = parent_container.find_element(By.CSS_SELECTOR, "div[class='columns is-vcentered is-mobile']") # select the week button container
        week_button_container = parent_container.find_element(By.XPATH, '//div[contains(@class, "columns is-vcentered is-mobile")]') # select the week button container
        print("Week button container found")
        print(week_button_container.get_attribute('outerHTML'))  # Debug print
    except TimeoutException:
        print("Timeout waiting for week button container")
        return []
    except NoSuchElementException:
        print("Week button container not found")
        return []
    
    # Find the week button and press it
    try:
        print("Finding week button");
        week_button = week_button_container.find_elements(By.CSS_SELECTOR, "div[class= 'Day_uppercase__A-4T9']")
        print(len(week_button))
        try:
            week_button[2].click()
            print("Week button clicked")
        except NoSuchElementException:
            print("Week button not found and not clicked")
    except TimeoutException:
        print("Timeout waiting for week button container")
        return []
    except NoSuchElementException:
        print("Week button element not found")
        return []
    
    # Wait for the parent class container to load
    try:
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div[class, 'ClassTimeScheduleList_wrapper__Pve3t')]")))
        #WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, '//div[contains(@class, "ClassTimeScheduleList_wrapper__Pve3t")]')))
        print("Classes loaded successfully")
    except TimeoutException:
        print("Timeout waiting for classes load")
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
    
    try:
        class_Elements = parent_container.find_elements(By.CSS_SELECTOR, "div.ClassTimeScheduleItemDesktop_separator__1vvuL")
        # class_Elements = parent_container.find_elements(By.CSS_SELECTOR, "div[class= 'columns is-vcentered ClassTimeScheduleItemDesktop_separator__1vvuL')]")
        #class_Elements = parent_container.find_elements(By.XPATH, '//div[contains(@class, "columns is-vcentered ClassTimeScheduleItemDesktop_separator__1vvuL")]')
        if len(class_Elements) == 0:
            print("WARNING: No class elements found")
            return []
    except NoSuchElementException:
        print("Class containers not found")
        return []

    try:
        Date = driver.find_element(By.XPATH, '//h5[contains(@class, "is-marginless")]').text
        Date = Date[11:len(Date)]
    except NoSuchElementException:
        print("Date not found")
        Date = "N/A"

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

websites = [
    "https://www.mindbodyonline.com/explore/locations/movement-lifestyle-noho"
]

try:
    op = webdriver.ChromeOptions()
    #op.add_argument('headless')
    op.page_load_strategy = 'none'
    op.add_argument('--log-level=3')
    driver = webdriver.Chrome(options=op)

    for url in websites:
        try:
            class_data = scrape(driver, url)
            print(f"Entering data for {url}")
            print(class_data)
            print(f"Completed {url.split('/')[-1]}:")
        except Exception as e:
            print(f"Error processing {url}: {str(e)}")

    print("\nAll operations completed")
    
finally:
    # Clean up resources
    driver.quit()
    mycursor.close()
    mydb.close()
    
end = time.time()
print(f"\nTotal execution time: {end - start} seconds")