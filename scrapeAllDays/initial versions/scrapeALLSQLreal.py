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
    start = time.time()
    print(f"\nScraping {url}")
    driver.get(url)
    
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//div[contains(@class, "columns is-vcentered ClassTimeScheduleItemDesktop_separator__1vvuL")]')))
        print("Page loaded successfully")
    except TimeoutException:
        print("Timeout waiting for page load")
        return []
        
    try:
        elements = driver.find_elements(By.XPATH, '//div[contains(@class, "columns is-vcentered ClassTimeScheduleItemDesktop_separator__1vvuL")]')
        if len(elements) == 0:
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
    for element in elements:
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