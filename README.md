# 🐉 Technical Symposium Registration Page

A **fully functional, open-source event registration website** built with vanilla HTML, CSS, and JavaScript. Features a Game of Thrones–inspired dark aesthetic, animated countdowns, multi-step registration form, UPI payment with screenshot upload, and an automated Google Apps Script backend that generates **Entry Pass PDFs** and **OD Letters** and emails them to participants after admin verification.

---

## ✨ Features

- 🎨 Dark, cinematic UI with GSAP animations
- 🗂️ Multi-step registration form (personal details → payment)
- 📸 UPI QR code payment + screenshot upload
- ⏳ Live countdown timers (event date & registration close)
- 🎫 Auto-generated Entry Pass PDF (with QR code)
- 📄 Auto-generated OD / Participation Letter PDF
- 📧 Automated confirmation email via Google Apps Script
- 🗃️ Google Sheets as database
- 📁 Payment screenshots saved to Google Drive

---

## 📁 Project Structure

```
Reg Page/
├── index.html          ← Main webpage (events, registration form, footer)
├── script.js           ← Frontend logic (events data, form handling, API call)
├── styles.css          ← All styling (no framework needed)
├── google_script.gs    ← Google Apps Script backend (sheet, email, PDF)
└── assets/
    ├── your_upi_qr_code.png     ← ⚠️ Replace with your UPI QR code
    ├── <event-banner-images>    ← Event card images
    └── ...
```

---

## 🚀 Setup & Configuration

### Step 1 — Clone / Download

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

> No build tools needed. Open `index.html` directly in a browser to preview, or serve with any static web server.

---

### Step 2 — Configure `index.html`

Search for the following placeholders and replace them:

| Placeholder | What to replace it with |
|---|---|
| `YOUR_COLLEGE_NAME` | Full name of your institution |
| `YOUR_SYMPOSIUM_NAME` | Name of your technical symposium |
| `EVENT_DATE_DISPLAY` | Display date, e.g. `September 09, 2026` |
| `REGISTRATION_CLOSE_DATE` | Last date for registration, e.g. `September 06, 2026` |
| `COORDINATOR_1_NAME` | Name of the first coordinator |
| `COORDINATOR_2_NAME` | Name of the second coordinator |
| `COORDINATOR_3_NAME` | Name of the third coordinator |
| `coordinator1@yourdomain.com` | Email of coordinator 1 |
| `coordinator2@yourdomain.com` | Email of coordinator 2 |
| `coordinator3@yourdomain.com` | Email of coordinator 3 |
| `+910000000001` | Phone number of coordinator 1 |
| `+910000000002` | Phone number of coordinator 2 |
| `+910000000003` | Phone number of coordinator 3 |
| `YOUR_LINKEDIN_1` | LinkedIn username of coordinator 1 |
| `YOUR_LINKEDIN_2` | LinkedIn username of coordinator 2 |
| `YOUR_LINKEDIN_3` | LinkedIn username of coordinator 3 |
| `assets/your_upi_qr_code.png` | Path to your actual UPI QR code image (place it in `assets/`) |
| `YEAR` | Year of the event, e.g. `2026` |
| `YOUR_DEPARTMENT` | Department name, e.g. `CSE` |
| `YOUR_CLUB_NAME` | Club/association name, e.g. `TECHNO CLUB` |
| `YOUR_NAME` | Name of the developer/designer |

---

### Step 3 — Configure `script.js`

#### 3a. Event Coordinator Details

Each event in `eventsData[]` has a `contact` and `phone` field. Replace all `COORDINATOR_NAME` and `+91 XXXXXXXXXX` placeholders with the actual coordinator assigned to that event:

```js
{
    id: "paper_presentation",
    title: "Paper Presentation",
    // ...
    contact: "Your Coordinator Name",   // ← Replace
    phone: "+91 98765 43210",           // ← Replace
}
```

#### 3b. Event & Registration Dates (Countdown Timers)

Find the `initCountdowns()` function near the bottom of `script.js` and replace the date strings:

```js
// TODO: Update the dates below for your event
const EVENT_DATE     = new Date('2026-09-09T09:00:00+05:30');  // ← Your event start date/time
const REG_CLOSE_DATE = new Date('2026-09-07T23:59:59+05:30'); // ← Your registration deadline
```

> **Format:** `YYYY-MM-DDTHH:MM:SS+05:30` (IST, UTC+5:30). Change the offset if your timezone differs.

#### 3c. Google Apps Script Web App URL

After deploying `google_script.gs` (see Step 4), paste your Web App URL here:

```js
// TODO: Replace this with your own Google Apps Script Web App URL
const WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

---

### Step 4 — Set Up Google Apps Script Backend

> The backend handles: receiving form data, saving to Google Sheets, uploading screenshots to Drive, generating PDFs, and sending emails.

#### 4a. Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Open **Extensions → Apps Script** from within that Sheet (this creates a container-bound script so `getActiveSpreadsheet()` works automatically).

#### 4b. Create a Google Drive Folder

1. Go to [drive.google.com](https://drive.google.com) and create a new folder named e.g. `Payment Screenshots`.
2. Open the folder. Copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/THIS_IS_YOUR_FOLDER_ID
   ```

#### 4c. Configure `google_script.gs`

Open `google_script.gs` and update the `CONFIG` object at the top:

```js
const CONFIG = {
  DRIVE_FOLDER_ID: "YOUR_DRIVE_FOLDER_ID",   // ← Paste the folder ID from 4b

  SHEET_NAME: "Registrations",               // Keep as-is or rename

  EVENT_NAME:  "YOUR_EVENT_NAME",            // e.g. "TechFest 2026"
  EVENT_DATE:  "DD Month YYYY",              // e.g. "09 September 2026"
  EVENT_VENUE: "YOUR_COLLEGE_NAME",          // Full venue name

  DEPARTMENT:  "Department of YOUR_DEPARTMENT",
  ORGANIZATION: "YOUR_CLUB_NAME",
  COLLEGE_NAME: "YOUR_COLLEGE_NAME",

  DEFAULT_FEE:  "₹200",                     // Registration fee
  TICKET_PREFIX: "TICKET-",                 // Prefix for ticket numbers

  EMAIL_SENDER_NAME: "YOUR_CLUB_NAME - YOUR_EVENT_NAME",

  SAVE_GENERATED_PDFS: false,               // Set true to also save PDFs to Drive
};
```

#### 4d. Deploy as a Web App

1. Paste the full contents of `google_script.gs` into the Apps Script editor.
2. Click **Deploy → New deployment**:
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone** (required for the form to POST)
3. Click **Deploy**, authorize permissions, and copy the **Web App URL**.
4. Paste this URL into `script.js` as `WEB_APP_URL` (Step 3c above).

#### 4e. Set the Edit Trigger

The script sends emails **only after admin verification**. Set up a trigger:

1. In the Apps Script editor, click **Triggers** (clock icon on the left sidebar).
2. Click **+ Add Trigger**:
   - Function to run: `processVerification`
   - Event source: **From spreadsheet**
   - Event type: **On edit**
3. Save and authorize.

> **How verification works:** When a registration arrives in Google Sheets with status `Pending` in Column L, an admin changes it to `Verified`. This triggers `processVerification`, which generates the Entry Pass + OD Letter PDFs and sends the email automatically.

---

### Step 5 — Replace Assets

| Asset | Action |
|---|---|
| `assets/your_upi_qr_code.png` | Replace with your actual UPI payment QR code image |
| Logo image in nav | Replace with your club/department logo |
| `assets/Title.png` | Replace with your symposium title banner |
| Event date banner | Replace with your event date graphic |
| `assets/<event-name>.png` | Replace with poster images for each event |

---

### Step 6 — Customize Events

In `script.js`, the `eventsData` array defines all event cards. Edit each object:

```js
{
    id: "your_event_id",           // Unique identifier (no spaces)
    title: "Your Event Title",
    theme: "Thematic Name",        // Shown on the event card
    tier: "Tier 1",                // Tier 1 / Tier 2 / Tier 3
    tagline: "Short tagline...",
    desc: "Full description...",
    rules: [
        "Rule 1",
        "Rule 2",
    ],
    teamSize: "Individual / Up to N members",
    prizes: "1st: ₹XXXX",
    contact: "Coordinator Name",   // ← Event coordinator
    phone: "+91 XXXXXXXXXX",       // ← Their phone number
    img: "assets/YourEventImage.png"
}
```

---

## 🔒 Security Notes

- **Never commit** real phone numbers, email addresses, Google Drive folder IDs, or Apps Script Web App URLs to a public repository.
- All sensitive values have been replaced with `PLACEHOLDER` strings in this template — fill them in **locally only**.
- The Google Drive folder for payment screenshots is set to **"Anyone with link can view"** by the script. Keep the folder link confidential and share only with your team.
- Consider restricting Apps Script Web App access to specific users if this is a private or institutional event.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, Vanilla CSS, Vanilla JavaScript |
| Animations | [GSAP 3](https://greensock.com/gsap/) + Flip plugin |
| Icons | [Font Awesome 6](https://fontawesome.com/) |
| Fonts | [Google Fonts](https://fonts.google.com/) (Cinzel + Inter) |
| Backend | [Google Apps Script](https://developers.google.com/apps-script) |
| Database | Google Sheets |
| File Storage | Google Drive |
| Email | Google MailApp (via Apps Script) |
| QR Codes | [QuickChart.io](https://quickchart.io/qr) |

---

## 📄 License

This project is open-source under the MIT License. You are free to use, modify, and distribute it for your own events with attribution.
