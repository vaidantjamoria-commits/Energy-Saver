# EnergySaver — Smart Energy Saving Reminder System

A beginner-friendly mini project built with **HTML, CSS, JavaScript and Python**. The interface is inspired by the reference image, with a dark-red/white theme and a dark mode in Settings.

## Features
- Home dashboard with energy-saving suggestions and reminder list
- Add custom reminders with a time and optional note
- Mark reminders complete or delete them
- Browser notifications with a custom leaf-themed EnergySaver icon
- Optional reminder chime
- Light theme and dark-red theme switch
- Tips library and simple progress statistics
- Saves reminders and theme in browser local storage
- Displays actual completed-reminder counts instead of invented kWh savings
- Includes a Terms & Conditions page with notification and local-data limitations
- Uses solid colors (no gradient backgrounds)
- Responsive layout for mobile and desktop

## Run it
1. Install Python 3 if you do not already have it.
2. Extract this folder.
3. Open a terminal in the `energysaver_project` folder.
4. Run `python app.py` (Windows may use `py app.py`).
5. Open **http://127.0.0.1:8000** in your browser.
6. Click **Enable notifications** and allow permission.

No extra Python packages are required.

## Important notification note
This beginner version checks reminders while the website tab is open. Browser notifications normally work on `localhost` or HTTPS after permission is granted. If the browser is closed, the computer is asleep, or notifications are blocked, scheduled alerts may not appear. A production app would need a service worker plus a push-notification backend for reliable background delivery.

## Project files
- `index.html` — page structure and content
- `style.css` — dark red/white design, responsive layout and dark theme
- `script.js` — reminders, local storage, notification permission, chime and dashboard actions
- `app.py` — small Python server using only the standard library

## Beginner concepts demonstrated
- HTML forms and buttons
- CSS variables, grid, flexbox and media queries
- JavaScript arrays, objects, functions, event listeners and intervals
- `localStorage` for saving data
- Browser Notification API
- Python's built-in `http.server`
