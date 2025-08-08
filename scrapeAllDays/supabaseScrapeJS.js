// Mindbody Class Schedule Scraper – Converted from Python to JavaScript/Node.js
// Uses Playwright for browser automation (headless) and Supabase JS client for data insertion.

// Import required libraries
const { chromium, errors } = require("playwright"); // Playwright for headless browser automation
const { createClient } = require("@supabase/supabase-js"); // Supabase official JavaScript client

// Supabase connection configuration (replace with your actual Supabase project URL and API key)
const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_OR_SERVICE_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mindbody schedule page URL configuration (replace with the actual schedule URL of the studio/gym).
// Typically, Mindbody "classic" consumer mode URL includes studioid and other parameters. For example:
// const SCHEDULE_PAGE_URL = 'https://clients.mindbodyonline.com/classic/ws?studioid=123456&stype=-7&sView=day&sLoc=0';
// Make sure to include any required parameters (studio ID, location, etc.) and use sView=day for day-by-day view.
const SCHEDULE_PAGE_URL =
  "https://clients.mindbodyonline.com/classic/ws?studioid=YOUR_STUDIO_ID&stype=-7&sView=day&sLoc=0";

// Helper function to format Date object as MM/DD/YYYY (Mindbody uses this format in URLs and inputs)
function formatDateMMDDYYYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// Main async function to run the scraping and data insertion
(async () => {
  let browser;
  try {
    console.log("Launching headless browser...");
    browser = await chromium.launch({ headless: true }); // Launch a headless browser
    const context = await browser.newContext();
    const page = await context.newPage();

    // Determine the start of the week (Monday of the current week)
    const today = new Date();
    // Calculate offset to Monday (assuming Monday as first day of week).
    // If today is Sunday (getDay() == 0), this will give last Monday (6 days ago).
    // Otherwise, it gives this week's Monday.
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
    const mondayDate = new Date(today);
    mondayDate.setDate(today.getDate() + mondayOffset);
    const startDateStr = formatDateMMDDYYYY(mondayDate);
    console.log(`Starting week schedule scrape from Monday: ${startDateStr}`);

    // Navigate to the schedule page for the start date (Monday)
    const initialURL = `${SCHEDULE_PAGE_URL}&date=${encodeURIComponent(
      startDateStr
    )}`;
    console.log(`Navigating to schedule page for ${startDateStr}...`);
    await page.goto(initialURL, { waitUntil: "networkidle" }); // Wait until network is idle to ensure page loads

    // Handle cookie consent popup if it appears (only once at the start)
    try {
      // Try a few common selectors for "Accept Cookies" buttons
      const consentSelectors = [
        "#onetrust-accept-btn-handler", // OneTrust cookie banner accept button
        ".onetrust-close-btn-handler", // OneTrust banner close (in case "accept all" not found)
        'button:has-text("Accept")', // Any button with text "Accept" (case-sensitive)
        'button:has-text("accept")', // Any button with text "accept" (in case different casing)
      ];
      for (const selector of consentSelectors) {
        const consentButton = await page.$(selector);
        if (consentButton) {
          await consentButton.click();
          console.log("Cookie consent popup found and accepted.");
          // Give a moment for the popup to close and page to settle
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch (consentError) {
      console.error("Error during cookie consent handling:", consentError);
    }

    // Ensure the page is in "Day" view mode (if the schedule page supports toggling views)
    try {
      // Click the "Day" view toggle if it's clickable (sometimes the page may already be in day view by default)
      await page.click("text=Day");
      console.log("Switched to Day view mode for schedule.");
      // Wait briefly for any view change to take effect
      await page.waitForTimeout(500);
    } catch (e) {
      // It's fine if this fails (e.g., if already in Day view or no such toggle exists).
      console.log(
        "Day view toggle not found or already in Day view, continuing..."
      );
    }

    // Prepare to loop through 7 days (Monday to Sunday) and scrape class data
    const allClasses = []; // array to collect all class entries

    for (let i = 0; i < 7; i++) {
      // Calculate the date for this iteration (Monday + i days)
      const currentDate = new Date(mondayDate);
      currentDate.setDate(mondayDate.getDate() + i);
      const dateStr = formatDateMMDDYYYY(currentDate);

      console.log(`\nScraping classes for ${dateStr}...`);

      // If i > 0, navigate to the next day's page (for i=0, we are already on Monday's page from initial load)
      if (i > 0) {
        const targetURL = `${SCHEDULE_PAGE_URL}&date=${encodeURIComponent(
          dateStr
        )}`;
        try {
          console.log(`Loading schedule page for ${dateStr}...`);
          await page.goto(targetURL, { waitUntil: "networkidle" });
        } catch (navError) {
          console.error(
            `Failed to navigate to ${dateStr} schedule page:`,
            navError
          );
          continue; // skip this day and move to next
        }
      }

      // Wait for the class schedule table or content to appear on the page
      try {
        // Wait for the main schedule table that lists classes (adjust selector if needed for the specific page)
        await page.waitForSelector("#classSchedule-mainTable", {
          timeout: 10000,
        });
      } catch (e) {
        if (e instanceof errors.TimeoutError) {
          console.error(
            `Timeout waiting for class schedule to load for ${dateStr}. Skipping this day.`
          );
          continue; // move to next day if this one didn't load properly
        } else {
          // If it's some other error, throw it to be handled by outer try-catch
          throw e;
        }
      }

      // At this point, the schedule for the current date should be loaded.
      // Fetch all class rows in the schedule table.
      const classRows = await page.$$("table#classSchedule-mainTable tr");

      // If no class rows found, check if there's a message indicating no classes scheduled
      if (classRows.length === 0) {
        // Some Mindbody schedules display a text message when no classes are available for a date
        const noClassesMessage = await page.$("text=There are no classes");
        if (noClassesMessage) {
          console.log(`No classes scheduled for ${dateStr}.`);
        } else {
          console.log(
            `No class entries found for ${dateStr} (possibly no classes or an unexpected page format).`
          );
        }
        continue; // no classes to process for this date, move to next day
      }

      console.log(
        `Found ${classRows.length} classes on ${dateStr}. Collecting details...`
      );

      // Loop through each class row and extract details
      for (const row of classRows) {
        try {
          // Extract class time (first column)
          const timeText = (
            await row.$eval("td:nth-child(1)", (el) => el.innerText)
          ).trim();
          // Extract class name (assuming it's a link with class or attribute we can target)
          // Mindbody classic usually has anchor with class "modalClassDesc" or similar for class name
          let className = "";
          try {
            className = await row.$eval("a.modalClassDesc", (el) =>
              el.innerText.trim()
            );
          } catch {
            // Fallback: maybe class name is just text (if no anchor for class name)
            const classNameCell = await row.$("td:nth-child(3)");
            if (classNameCell) {
              className = (await classNameCell.innerText()).trim();
            }
          }
          // Extract instructor name (anchor with class "modalBio" typically)
          let instructorName = "";
          try {
            instructorName = await row.$eval("a.modalBio", (el) =>
              el.innerText.trim()
            );
          } catch {
            // Fallback if instructor name not in an anchor
            const instructorCell = await row.$("td:nth-child(4)");
            if (instructorCell) {
              instructorName = (await instructorCell.innerText()).trim();
            }
          }
          // Extract location or room (typically the 5th column in classic interface)
          let location = "";
          const locationCell = await row.$("td:nth-child(5)");
          if (locationCell) {
            location = (await locationCell.innerText()).trim();
          }

          // Combine date and time into a single Date object for a full timestamp
          // Mindbody times are usually in 12-hour format with am/pm.
          // We'll create a Date by merging the date and time.
          let classDateTime = new Date(
            `${currentDate.toDateString()} ${timeText}`
          );
          // Note: Using currentDate.toDateString() (which gives "Weekday Mon DD YYYY") combined with timeText (e.g., "4:00 PM")
          // should produce a valid date string for the correct day and time. Alternatively, we could manually parse the time.
          if (isNaN(classDateTime.getTime())) {
            // Fallback parsing if the above fails (e.g., due to locale issues):
            const [timePart, period] = timeText.split(/\\s+/); // split into time and AM/PM
            let [hour, minute] = timePart.split(":").map(Number);
            if (period.toLowerCase().includes("pm") && hour < 12) hour += 12;
            if (period.toLowerCase().includes("am") && hour === 12) hour = 0;
            classDateTime = new Date(currentDate);
            classDateTime.setHours(hour, isNaN(minute) ? 0 : minute, 0, 0);
          }

          // Format date and time for output
          const dateISO = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
          const timeISO = classDateTime.toTimeString().split(" ")[0]; // HH:MM:SS (24-hour format)
          const timestampISO = classDateTime.toISOString(); // full ISO timestamp

          // Log the class info (for debugging/progress logging)
          console.log(
            ` - ${dateISO} ${timeText} | Class: "${className}" with ${instructorName} @ ${location}`
          );

          // Store the class data in an object to be inserted into Supabase
          allClasses.push({
            class_date: dateISO, // Date of the class (YYYY-MM-DD)
            class_time: timeText, // Original time text (e.g., "4:00 PM")
            class_name: className || null, // Class name
            instructor_name: instructorName || null, // Instructor name
            location: location || null, // Location/room of the class
            class_datetime: timestampISO, // Full date-time in ISO format
          });
        } catch (parseError) {
          console.error("Error parsing a class row:", parseError);
          // Continue to next row if one row fails to parse
        }
      } // end for each row
    } // end for each day

    console.log(
      `\nScraping completed. Total classes collected: ${allClasses.length}.`
    );

    // Insert the collected class data into Supabase
    if (allClasses.length > 0) {
      console.log("Inserting class schedule data into Supabase...");
      const { error } = await supabase
        .from("class_schedule")
        .insert(allClasses);
      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
      } else {
        console.log("Successfully inserted class schedule data into Supabase.");
      }
    } else {
      console.log("No class data collected, skipping Supabase insertion.");
    }

    console.log("Script finished successfully.");
  } catch (err) {
    console.error("Unexpected error during script execution:", err);
  } finally {
    // Ensure the browser is closed, even if errors occurred
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
})();
