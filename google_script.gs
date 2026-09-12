/**
 * ================================================================
 * CEBROID 2K26 - Registration & Automated Pass Backend
 * Production Version
 *
 * FEATURES
 * ----------------------------------------------------------------
 * 1. Receives registration data from website/frontend
 * 2. Uploads payment screenshot to Google Drive
 * 3. Stores registration in Google Sheets
 * 4. Generates unique Cebroid ticket number
 * 5. Admin verifies payment in Column J
 * 6. Automatically generates:
 *      - Entry Pass PDF
 *      - OD Letter PDF
 * 7. Generates QR code using QuickChart
 * 8. Sends professional HTML email with both PDFs attached
 * 9. Prevents duplicate pass/email generation
 * 10. Maintains email/document status
 *
 * SHEET COLUMNS
 * ----------------------------------------------------------------
 * A Timestamp
 * B Full Name
 * C Contact Number
 * D Email
 * E College / Institution
 * F Events Selected
 * G Food Preference
 * H Registration Fee
 * I Transaction ID
 * J Payment Screenshot
 * K Ticket Number
 * L Verification Status
 * M Pass Sent
 * N OD Generated
 * O Email Status
 * P Email Sent At
 * Q Error Log
 * ================================================================
 */

// ================================================================
// CONFIGURATION
// ================================================================

const CONFIG = {
  // ----------------------------------------------------------------
  // TODO: Create a Google Drive folder for payment screenshots and
  // paste its folder ID here.
  // Folder ID is the last part of the folder's URL:
  // https://drive.google.com/drive/folders/YOUR_FOLDER_ID
  // ----------------------------------------------------------------
  DRIVE_FOLDER_ID: "YOUR_DRIVE_FOLDER_ID",

  // Optional:
  // If you want generated PDFs saved to Drive,
  // create a folder and put its ID here.
  //
  // Leave empty ("") if you don't want to permanently
  // save generated PDFs.
  PDF_FOLDER_ID: "",

  // Google Sheet
  SHEET_NAME: "Registrations",

  // Event details
  // TODO: Update with your event's name, date, and venue
  EVENT_NAME: "YOUR_EVENT_NAME",
  EVENT_DATE: "DD Month YYYY",
  EVENT_VENUE: "YOUR_COLLEGE_NAME",

  // Organization
  // TODO: Update with your department and organization details
  DEPARTMENT: "Department of YOUR_DEPARTMENT",
  ORGANIZATION: "YOUR_CLUB_NAME",
  COLLEGE_NAME: "YOUR_COLLEGE_NAME",

  // Registration
  // TODO: Update registration fee if different
  DEFAULT_FEE: "₹200",

  // Ticket prefix — change to match your event
  TICKET_PREFIX: "TICKET-",

  // QR provider
  QR_API: "https://quickchart.io/qr",

  // Email
  // TODO: Update sender name shown in emails
  EMAIL_SENDER_NAME: "YOUR_CLUB_NAME - YOUR_EVENT_NAME",

  // Whether PDFs should be saved to Drive
  SAVE_GENERATED_PDFS: false,

  // PDF filenames
  ENTRY_PASS_PREFIX: "Entry_Pass_",
  OD_LETTER_PREFIX: "OD_Letter_",
};

// ================================================================
// SHEET COLUMN DEFINITIONS
// ================================================================

const COL = {
  TIMESTAMP: 1,
  NAME: 2,
  PHONE: 3,
  EMAIL: 4,
  COLLEGE: 5,
  EVENTS: 6,
  FOOD: 7,
  FEE: 8,
  TXN_ID: 9,
  SCREENSHOT: 10,
  TICKET: 11,
  VERIFICATION: 12,
  PASS_SENT: 13,
  OD_GENERATED: 14,
  EMAIL_STATUS: 15,
  EMAIL_SENT_AT: 16,
  ERROR_LOG: 17,
};

// ================================================================
// POST API
// ================================================================

function doPost(e) {
  try {
    // ------------------------------------------------------------
    // Validate request
    // ------------------------------------------------------------

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse("error", "No POST data received.");
    }

    let data;

    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      return jsonResponse("error", "Invalid JSON format.");
    }

    // ------------------------------------------------------------
    // Validate required fields
    // ------------------------------------------------------------

    const requiredFields = ["name", "phone", "email", "college", "events"];

    const missingFields = requiredFields.filter(function (field) {
      return !data[field] || String(data[field]).trim() === "";
    });

    if (missingFields.length > 0) {
      return jsonResponse(
        "error",
        "Missing required fields: " + missingFields.join(", "),
      );
    }

    // ------------------------------------------------------------
    // Clean user input
    // ------------------------------------------------------------

    const name = String(data.name).trim();
    const phone = String(data.phone).trim();
    const email = String(data.email).trim();
    const college = String(data.college).trim();
    const events = String(data.events).trim();
    const food = data.food ? String(data.food).trim() : "Not specified";

    const fee = data.fee ? String(data.fee).trim() : CONFIG.DEFAULT_FEE;
    const txnId = data.transactionId ? String(data.transactionId).trim() : "";

    // ------------------------------------------------------------
    // Validate email
    // ------------------------------------------------------------

    if (!isValidEmail(email)) {
      return jsonResponse("error", "Invalid email address.");
    }

    // ------------------------------------------------------------
    // Open spreadsheet
    // ------------------------------------------------------------

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);

      initializeSheet(sheet);
    } else {
      ensureColumns(sheet);
    }

    // ------------------------------------------------------------
    // Upload payment screenshot
    // ------------------------------------------------------------

    let screenshotLink = "No screenshot provided";

    if (
      data.screenshotBase64 &&
      String(data.screenshotBase64).startsWith("data:")
    ) {
      try {
        screenshotLink = uploadToDrive(
          data.screenshotBase64,
          data.screenshotName || "payment_screenshot.png",
          name,
          phone,
        );
      } catch (error) {
        Logger.log("Drive upload error: " + error.message);

        screenshotLink = "Upload failed: " + error.message;
      }
    }

    // ------------------------------------------------------------
    // Generate unique ticket number
    // ------------------------------------------------------------

    const ticketNumber = generateTicketNumber(sheet);

    // ------------------------------------------------------------
    // Add registration row
    // ------------------------------------------------------------

    const rowData = [
      new Date(),       // A Timestamp
      name,             // B Full Name
      phone,            // C Contact Number
      email,            // D Email
      college,          // E College / Institution
      events,           // F Events Selected
      food,             // G Food Preference
      fee,              // H Registration Fee
      txnId,            // I Transaction ID
      screenshotLink,   // J Payment Screenshot
      ticketNumber,     // K Ticket Number
      "Pending",        // L Verification Status
      "No",             // M Pass Sent
      "No",             // N OD Generated
      "Not Sent",       // O Email Status
      "",               // P Email Sent At
      "",               // Q Error Log
    ];

    sheet.appendRow(rowData);

    // ------------------------------------------------------------
    // Make screenshot clickable
    // ------------------------------------------------------------

    const newRow = sheet.getLastRow();

    if (screenshotLink && screenshotLink.indexOf("https://") === 0) {
      const linkCell = sheet.getRange(newRow, COL.SCREENSHOT);

      linkCell.setFormula(
        '=HYPERLINK("' + screenshotLink + '","View Screenshot")',
      );
    }

    // ------------------------------------------------------------
    // Return success
    // ------------------------------------------------------------

    return jsonResponse("success", "Registration successful.", {
      ticketNumber: ticketNumber,
    });
  } catch (error) {
    Logger.log("doPost ERROR: " + error.stack);

    return jsonResponse("error", "Registration failed: " + error.message);
  }
}

// ================================================================
// GET API HEALTH CHECK
// ================================================================

function doGet(e) {
  return jsonResponse("online", "CEBROID 2K26 Registration API is live.");
}

// ================================================================
// GOOGLE SHEET EDIT TRIGGER
//
// ADMIN ACTION:
// Change Column J from:
//
// Pending
//
// to:
//
// Verified
//
// This function automatically generates the documents and
// sends the email.
// ================================================================

function processVerification(e) {
  try {
    if (!e || !e.range) {
      return;
    }

    const sheet = e.range.getSheet();

    // Only operate on the Registrations sheet

    if (sheet.getName() !== CONFIG.SHEET_NAME) {
      return;
    }

    const row = e.range.getRow();
    const col = e.range.getColumn();

    // Ignore header

    if (row <= 1) {
      return;
    }

    // Only react to Column J

    if (col !== COL.VERIFICATION) {
      return;
    }

    const status = String(e.value || "").trim();

    // Only process Verified

    if (status.toLowerCase() !== "verified") {
      return;
    }

    const passSent = String(
      sheet.getRange(row, COL.PASS_SENT).getValue(),
    ).trim();

    const emailStatus = String(
      sheet.getRange(row, COL.EMAIL_STATUS).getValue(),
    ).trim();

    // ------------------------------------------------------------
    // Prevent duplicate processing
    // ------------------------------------------------------------

    if (
      passSent.toLowerCase() === "yes" ||
      emailStatus.toLowerCase() === "sent"
    ) {
      Logger.log("Pass already processed for row " + row);

      return;
    }

    // ------------------------------------------------------------
    // Process participant
    // ------------------------------------------------------------

    sendParticipantDocuments(sheet, row);
  } catch (error) {
    Logger.log("processVerification ERROR: " + error.stack);
  }
}

// ================================================================
// MAIN DOCUMENT PROCESSOR
// ================================================================

function sendParticipantDocuments(sheet, row) {
  const lock = LockService.getScriptLock();

  try {
    // Prevent simultaneous processing

    lock.waitLock(30000);

    // ------------------------------------------------------------
    // Get participant data
    // ------------------------------------------------------------

    const participant = getParticipantData(sheet, row);

    // ------------------------------------------------------------
    // Update status
    // ------------------------------------------------------------

    sheet.getRange(row, COL.EMAIL_STATUS).setValue("Generating documents...");

    sheet.getRange(row, COL.ERROR_LOG).clearContent();

    // ------------------------------------------------------------
    // Generate QR code
    // ------------------------------------------------------------

    const qrBlob = generateQRCode(participant.ticketNumber);

    // ------------------------------------------------------------
    // Generate Entry Pass PDF
    // ------------------------------------------------------------

    const entryPassPDF = generateEntryPassPDF(participant, qrBlob);

    // ------------------------------------------------------------
    // Generate OD Letter PDF
    // ------------------------------------------------------------

    const odLetterPDF = generateODLetterPDF(participant, qrBlob);

    // ------------------------------------------------------------
    // Save PDFs to Drive if enabled
    // ------------------------------------------------------------

    if (CONFIG.SAVE_GENERATED_PDFS) {
      savePDFToDrive(
        entryPassPDF,
        CONFIG.ENTRY_PASS_PREFIX +
          sanitizeFilename(participant.name) +
          "_" +
          participant.ticketNumber +
          ".pdf",
      );

      savePDFToDrive(
        odLetterPDF,
        CONFIG.OD_LETTER_PREFIX +
          sanitizeFilename(participant.name) +
          "_" +
          participant.ticketNumber +
          ".pdf",
      );
    }

    // ------------------------------------------------------------
    // Send email
    // ------------------------------------------------------------

    sheet.getRange(row, COL.EMAIL_STATUS).setValue("Sending...");

    sendParticipantEmail(participant, entryPassPDF, odLetterPDF, qrBlob);

    // ------------------------------------------------------------
    // SUCCESS
    // ------------------------------------------------------------

    sheet.getRange(row, COL.PASS_SENT).setValue("Yes");

    sheet.getRange(row, COL.OD_GENERATED).setValue("Yes");

    sheet.getRange(row, COL.EMAIL_STATUS).setValue("Sent");

    sheet.getRange(row, COL.EMAIL_SENT_AT).setValue(new Date());

    sheet.getRange(row, COL.ERROR_LOG).clearContent();

    Logger.log("Documents sent successfully to " + participant.email);
  } catch (error) {
    Logger.log("sendParticipantDocuments ERROR: " + error.stack);

    // ------------------------------------------------------------
    // FAILURE STATUS
    // ------------------------------------------------------------

    sheet.getRange(row, COL.EMAIL_STATUS).setValue("Failed");

    sheet
      .getRange(row, COL.ERROR_LOG)
      .setValue(new Date().toISOString() + " - " + error.message);
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

// ================================================================
// GET PARTICIPANT DATA
// ================================================================

function getParticipantData(sheet, row) {
  const data = sheet.getRange(row, 1, 1, COL.ERROR_LOG).getValues()[0];

  return {
    row: row,

    timestamp: data[COL.TIMESTAMP - 1],

    name: String(data[COL.NAME - 1] || "").trim(),

    phone: String(data[COL.PHONE - 1] || "").trim(),

    email: String(data[COL.EMAIL - 1] || "").trim(),

    college: String(data[COL.COLLEGE - 1] || "").trim(),

    events: String(data[COL.EVENTS - 1] || "").trim(),

    food: String(data[COL.FOOD - 1] || "Not specified").trim(),

    fee: String(data[COL.FEE - 1] || "").trim(),

    ticketNumber: String(data[COL.TICKET - 1] || "").trim(),
  };
}

// ================================================================
// GENERATE UNIQUE TICKET NUMBER
// ================================================================

function generateTicketNumber(sheet) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    const lastRow = Math.max(sheet.getLastRow(), 1);

    const ticketNumber =
      CONFIG.TICKET_PREFIX + String(lastRow).padStart(3, "0");

    return ticketNumber;
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

// ================================================================
// GENERATE QR CODE
// ================================================================

function generateQRCode(ticketNumber) {
  if (!ticketNumber) {
    throw new Error("Ticket number is missing.");
  }

  const qrUrl =
    CONFIG.QR_API +
    "?text=" +
    encodeURIComponent(ticketNumber) +
    "&size=500" +
    "&margin=2";

  const response = UrlFetchApp.fetch(qrUrl, {
    muteHttpExceptions: true,
  });

  const responseCode = response.getResponseCode();

  if (responseCode !== 200) {
    throw new Error("QR generation failed. HTTP " + responseCode);
  }

  return response.getBlob().setName(ticketNumber + "_QR.png");
}

// ================================================================
// GENERATE ENTRY PASS PDF
// ================================================================

function generateEntryPassPDF(participant, qrBlob) {
  const qrBase64 = Utilities.base64Encode(qrBlob.getBytes());

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

@page {
  size: A4;
  margin: 0;
}

body {

  margin: 0;

  padding: 35px;

  background: #f2f2f2;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #111;

}

.container {

  background: #ffffff;

  border: 2px solid #222;

  min-height: 1040px;

  padding: 35px;

  box-sizing: border-box;

}

.header {

  text-align: center;

  border-bottom: 2px solid #222;

  padding-bottom: 20px;

}

.organization {

  font-size: 14px;

  font-weight: bold;

  letter-spacing: 1px;

}

.department {

  font-size: 12px;

  margin-top: 6px;

}

.event {

  font-size: 32px;

  font-weight: 800;

  margin-top: 20px;

  letter-spacing: 3px;

}

.subtitle {

  font-size: 15px;

  margin-top: 6px;

  color: #555;

  letter-spacing: 1px;

}

.pass-title {

  text-align: center;

  margin-top: 30px;

  font-size: 22px;

  font-weight: bold;

  letter-spacing: 2px;

}

.content {

  margin-top: 35px;

}

.label {

  font-size: 11px;

  color: #777;

  text-transform: uppercase;

  letter-spacing: 1px;

}

.value {

  font-size: 20px;

  font-weight: bold;

  margin-top: 5px;

}

.info {

  margin-top: 20px;

}

.qr-section {

  text-align: center;

  margin-top: 35px;

}

.qr {

  width: 260px;

  height: 260px;

}

.ticket {

  font-size: 25px;

  font-weight: bold;

  letter-spacing: 3px;

  margin-top: 15px;

}

.instructions {

  margin-top: 30px;

  padding: 18px;

  background: #f5f5f5;

  border-left: 4px solid #222;

  font-size: 12px;

  line-height: 1.6;

}

.footer {

  margin-top: 35px;

  border-top: 1px solid #ddd;

  padding-top: 15px;

  text-align: center;

  font-size: 10px;

  color: #777;

}

</style>

</head>


<body>

<div class="container">

  <div class="header">

    <div class="organization">
      ${escapeHtml(CONFIG.COLLEGE_NAME)}
    </div>

    <div class="department">
      ${escapeHtml(CONFIG.DEPARTMENT)}
    </div>

    <div class="event">
      ${escapeHtml(CONFIG.EVENT_NAME)}
    </div>

    <div class="subtitle">
      ${escapeHtml(CONFIG.ORGANIZATION)}
    </div>

  </div>


  <div class="pass-title">
    OFFICIAL ENTRY PASS
  </div>


  <div class="content">

    <div class="info">

      <div class="label">
        Participant Name
      </div>

      <div class="value">
        ${escapeHtml(participant.name)}
      </div>

    </div>


    <div class="info">

      <div class="label">
        Institution
      </div>

      <div class="value">
        ${escapeHtml(participant.college)}
      </div>

    </div>


    <div class="info">

      <div class="label">
        Registered Events
      </div>

      <div class="value">
        ${escapeHtml(participant.events)}
      </div>

    </div>


    <div class="qr-section">

      <img
        class="qr"
        src="data:image/png;base64,${qrBase64}"
      >

      <div class="ticket">
        ${escapeHtml(participant.ticketNumber)}
      </div>

    </div>


    <div class="instructions">

      <strong>ENTRY INSTRUCTIONS</strong>

      <br><br>

      Please present this QR code at the registration/check-in
      desk on the event day.

      <br>

      This QR code is uniquely associated with the participant
      and ticket number mentioned above.

      <br>

      Please do not share or duplicate this pass.

    </div>


    <div class="footer">

      ${escapeHtml(CONFIG.EVENT_NAME)}
      &nbsp; | &nbsp;
      ${escapeHtml(CONFIG.EVENT_DATE)}
      &nbsp; | &nbsp;
      ${escapeHtml(CONFIG.EVENT_VENUE)}

      <br><br>

      ${escapeHtml(CONFIG.DEPARTMENT)}
      -
      ${escapeHtml(CONFIG.ORGANIZATION)}

    </div>

  </div>

</div>

</body>

</html>
`;

  return htmlToPDF(
    html,
    CONFIG.ENTRY_PASS_PREFIX +
      sanitizeFilename(participant.name) +
      "_" +
      participant.ticketNumber +
      ".pdf",
  );
}

// ================================================================
// GENERATE OD LETTER PDF
// ================================================================

function generateODLetterPDF(participant, qrBlob) {
  const qrBase64 = Utilities.base64Encode(qrBlob.getBytes());

  const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

@page {
  size: A4;
  margin: 45px;
}

body {

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #111;

  font-size: 13px;

  line-height: 1.6;

}

.header {

  text-align: center;

  border-bottom: 2px solid #222;

  padding-bottom: 15px;

}

.college {

  font-size: 18px;

  font-weight: bold;

  text-transform: uppercase;

}

.department {

  font-size: 12px;

  margin-top: 5px;

}

.event {

  font-size: 21px;

  font-weight: bold;

  margin-top: 15px;

  letter-spacing: 2px;

}

.document-title {

  text-align: center;

  font-size: 18px;

  font-weight: bold;

  margin-top: 35px;

  text-decoration: underline;

  letter-spacing: 1px;

}

.date {

  text-align: right;

  margin-top: 25px;

}

.recipient {

  margin-top: 25px;

}

.subject {

  margin-top: 25px;

  font-weight: bold;

}

.body-text {

  margin-top: 20px;

  text-align: justify;

}

.details {

  width: 100%;

  border-collapse: collapse;

  margin-top: 25px;

}

.details td {

  border: 1px solid #bbb;

  padding: 9px;

}

.details td:first-child {

  width: 35%;

  font-weight: bold;

  background: #f5f5f5;

}

.qr-area {

  margin-top: 30px;

  text-align: right;

}

.qr {

  width: 115px;

  height: 115px;

}

.signature {

  margin-top: 65px;

}

.signature-line {

  margin-top: 45px;

  width: 180px;

  border-top: 1px solid #111;

}

.footer {

  margin-top: 45px;

  border-top: 1px solid #ccc;

  padding-top: 10px;

  font-size: 9px;

  color: #666;

  text-align: center;

}

</style>

</head>


<body>


<div class="header">

  <div class="college">
    ${escapeHtml(CONFIG.COLLEGE_NAME)}
  </div>

  <div class="department">
    ${escapeHtml(CONFIG.DEPARTMENT)}
  </div>

  <div class="event">
    ${escapeHtml(CONFIG.EVENT_NAME)}
  </div>

</div>


<div class="document-title">
  ON-DUTY / PARTICIPATION LETTER
</div>


<div class="date">

  Date:
  ${escapeHtml(CONFIG.EVENT_DATE)}

</div>


<div class="recipient">

  <strong>
    TO WHOMSOEVER IT MAY CONCERN
  </strong>

</div>


<div class="subject">

  Subject:
  Permission to attend ${escapeHtml(CONFIG.EVENT_NAME)}

</div>


<div class="body-text">

  This is to certify that

  <strong>
    ${escapeHtml(participant.name)}
  </strong>

  from

  <strong>
    ${escapeHtml(participant.college)}
  </strong>

  is a registered participant of

  <strong>
    ${escapeHtml(CONFIG.EVENT_NAME)}
  </strong>

  organized by

  <strong>
    ${escapeHtml(CONFIG.DEPARTMENT)}
    -
    ${escapeHtml(CONFIG.ORGANIZATION)}
  </strong>

  at

  <strong>
    ${escapeHtml(CONFIG.EVENT_VENUE)}
  </strong>

  on

  <strong>
    ${escapeHtml(CONFIG.EVENT_DATE)}
  </strong>.

</div>


<div class="body-text">

  The participant is requested to be permitted to attend the
  above-mentioned event and participate in the scheduled
  technical and co-curricular activities.

  The necessary On-Duty permission may kindly be granted
  for the duration of the event.

</div>


<table class="details">

  <tr>

    <td>
      Participant Name
    </td>

    <td>
      ${escapeHtml(participant.name)}
    </td>

  </tr>


  <tr>

    <td>
      Institution
    </td>

    <td>
      ${escapeHtml(participant.college)}
    </td>

  </tr>


  <tr>

    <td>
      Registered Events
    </td>

    <td>
      ${escapeHtml(participant.events)}
    </td>

  </tr>


  <tr>

    <td>
      Ticket Number
    </td>

    <td>
      ${escapeHtml(participant.ticketNumber)}
    </td>

  </tr>


  <tr>

    <td>
      Event Date
    </td>

    <td>
      ${escapeHtml(CONFIG.EVENT_DATE)}
    </td>

  </tr>


  <tr>

    <td>
      Venue
    </td>

    <td>
      ${escapeHtml(CONFIG.EVENT_VENUE)}
    </td>

  </tr>

</table>


<div class="qr-area">

  <img
    class="qr"
    src="data:image/png;base64,${qrBase64}"
  >

  <br>

  <small>
    ${escapeHtml(participant.ticketNumber)}
  </small>

</div>


<div class="signature">

  <strong>
    Authorized By
  </strong>


  <div class="signature-line"></div>

  Event Coordinator

  <br>

  ${escapeHtml(CONFIG.ORGANIZATION)}

  <br>

  ${escapeHtml(CONFIG.DEPARTMENT)}

</div>


<div class="footer">

  This document is electronically generated for
  ${escapeHtml(CONFIG.EVENT_NAME)}.

  <br>

  Ticket:
  ${escapeHtml(participant.ticketNumber)}

</div>


</body>

</html>
`;

  return htmlToPDF(
    html,
    CONFIG.OD_LETTER_PREFIX +
      sanitizeFilename(participant.name) +
      "_" +
      participant.ticketNumber +
      ".pdf",
  );
}

// ================================================================
// HTML → PDF
// ================================================================

function htmlToPDF(html, filename) {
  const htmlBlob = Utilities.newBlob(
    html,
    "text/html",
    filename.replace(/\.pdf$/i, ".html"),
  );

  const pdf = htmlBlob.getAs("application/pdf");

  return pdf.setName(filename);
}

// ================================================================
// SEND PROFESSIONAL EMAIL
// ================================================================

function sendParticipantEmail(participant, entryPassPDF, odLetterPDF, qrBlob) {
  const safeName = escapeHtml(participant.name);

  const safeCollege = escapeHtml(participant.college);

  const safeEvents = escapeHtml(participant.events);

  const safeTicket = escapeHtml(participant.ticketNumber);

  const subject =
    CONFIG.EVENT_NAME +
    " | Registration Confirmed & Entry Pass - " +
    participant.ticketNumber;

  // --------------------------------------------------------------
  // Plain text fallback
  // --------------------------------------------------------------

  const plainBody = `Dear ${participant.name},

Greetings from ${CONFIG.ORGANIZATION}.

Your registration for ${CONFIG.EVENT_NAME} has been successfully verified.

Participant Details
-------------------
Name       : ${participant.name}
Institution: ${participant.college}
Events     : ${participant.events}
Ticket No. : ${participant.ticketNumber}
Event Date : ${CONFIG.EVENT_DATE}
Venue      : ${CONFIG.EVENT_VENUE}

Your official Entry Pass and OD / Participation Letter are attached to this email.

Please present your QR code at the registration/check-in desk on the event day.

Event Day Instructions
-----------------------
• Participants are requested to appear in formal attire. Shoes are not mandatory.
• Appear before 8:30 AM at the venue.
• You must show this QR code to the reception team at the entrance.

Regards,
${CONFIG.ORGANIZATION}
${CONFIG.DEPARTMENT}
${CONFIG.COLLEGE_NAME}`;

  // --------------------------------------------------------------
  // Professional HTML email
  // --------------------------------------------------------------

  const htmlBody = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<style>

body {

  margin: 0;

  padding: 0;

  background: #f4f4f4;

  font-family:
    Arial,
    Helvetica,
    sans-serif;

  color: #222;

}

.wrapper {

  width: 100%;

  padding: 30px 0;

}

.email {

  width: 600px;

  max-width: 92%;

  margin: auto;

  background: #ffffff;

  border: 1px solid #ddd;

}

.header {

  background: #111;

  color: #ffffff;

  padding: 30px;

  text-align: center;

}

.header h1 {

  margin: 0;

  font-size: 28px;

  letter-spacing: 4px;

}

.header p {

  margin: 8px 0 0;

  color: #ccc;

  font-size: 12px;

  letter-spacing: 1px;

}

.content {

  padding: 35px;

}

.greeting {

  font-size: 16px;

  line-height: 1.6;

}

.status {

  margin: 25px 0;

  padding: 18px;

  background: #f2f7f2;

  border-left: 4px solid #278a42;

}

.status strong {

  color: #23753a;

}

.details {

  width: 100%;

  border-collapse: collapse;

  margin-top: 25px;

}

.details td {

  padding: 10px 12px;

  border-bottom: 1px solid #eee;

}

.details td:first-child {

  width: 35%;

  color: #777;

  font-size: 12px;

}

.details td:last-child {

  font-weight: bold;

}

.ticket {

  margin: 25px 0;

  text-align: center;

  padding: 20px;

  background: #fafafa;

  border: 1px dashed #aaa;

}

.ticket-label {

  font-size: 11px;

  color: #777;

  letter-spacing: 1px;

}

.ticket-number {

  font-size: 25px;

  font-weight: bold;

  letter-spacing: 3px;

  margin-top: 8px;

}

.instructions {

  margin-top: 25px;

  font-size: 13px;

  line-height: 1.7;

}

.footer {

  background: #111;

  color: #aaa;

  padding: 25px;

  text-align: center;

  font-size: 11px;

  line-height: 1.6;

}

</style>

</head>


<body>

<div class="wrapper">

<div class="email">


<div class="header">

  <h1>
    ${escapeHtml(CONFIG.EVENT_NAME)}
  </h1>

  <p>
    ${escapeHtml(CONFIG.ORGANIZATION)}
  </p>

</div>


<div class="content">


<div class="greeting">

  Dear <strong>${safeName}</strong>,

  <br><br>

  Greetings from
  <strong>${escapeHtml(CONFIG.ORGANIZATION)}</strong>.

  We are pleased to inform you that your registration
  for <strong>${escapeHtml(CONFIG.EVENT_NAME)}</strong>
  has been successfully verified.

</div>


<div class="status">

  <strong>Registration Verified</strong>

  <br>

  Your participation has been confirmed.

</div>


<h3>
  Participant Details
</h3>


<table class="details">

<tr>

  <td>
    Full Name
  </td>

  <td>
    ${safeName}
  </td>

</tr>


<tr>

  <td>
    Institution
  </td>

  <td>
    ${safeCollege}
  </td>

</tr>


<tr>

  <td>
    Events
  </td>

  <td>
    ${safeEvents}
  </td>

</tr>


<tr>

  <td>
    Event Date
  </td>

  <td>
    ${escapeHtml(CONFIG.EVENT_DATE)}
  </td>

</tr>


<tr>

  <td>
    Venue
  </td>

  <td>
    ${escapeHtml(CONFIG.EVENT_VENUE)}
  </td>

</tr>

</table>


<div class="ticket">

  <div class="ticket-label">
    YOUR TICKET NUMBER
  </div>

  <div class="ticket-number">
    ${safeTicket}
  </div>

</div>


<div class="instructions">

  <strong>Your documents are attached to this email.</strong>

  <br><br>

  <strong>1. Entry Pass</strong><br>

  Please keep the Entry Pass accessible on your phone
  or carry a printed copy. The QR code will be scanned
  during event registration/check-in.

  <br><br>

  <strong>2. OD / Participation Letter</strong><br>

  The attached OD letter contains your participation
  details and may be submitted to your institution
  for obtaining On-Duty permission.

  <br><br>

  <strong>Important:</strong>

  Please verify your name, institution, events and
  ticket number before the event. Do not share your
  QR code or entry pass with another participant.

  <br><br>

  <strong>Event Day Instructions:</strong>

  <br><br>

  &#8226; Participants are requested to appear in
  <strong>formal attire</strong>. Shoes are not mandatory.

  <br><br>

  &#8226; Appear before <strong>8:30 AM</strong> at the venue.

  <br><br>

  &#8226; You must show this <strong>QR code</strong> to the
  reception team at the entrance.
  
  <br><br>

  &#8226; Participants can contact the event coordinators listed
  in the <strong>Contact</strong> section on the registration website
  for any queries.

</div>


<p style="margin-top:30px;">

  We look forward to welcoming you to
  <strong>${escapeHtml(CONFIG.EVENT_NAME)}</strong>.

</p>


<p>

  Regards,<br>

  <strong>${escapeHtml(CONFIG.ORGANIZATION)}</strong><br>

  ${escapeHtml(CONFIG.DEPARTMENT)}<br>

  ${escapeHtml(CONFIG.COLLEGE_NAME)}

</p>


</div>


<div class="footer">

  ${escapeHtml(CONFIG.EVENT_NAME)}
  &nbsp; | &nbsp;
  ${escapeHtml(CONFIG.EVENT_DATE)}

  <br>

  ${escapeHtml(CONFIG.ORGANIZATION)}
  -
  ${escapeHtml(CONFIG.DEPARTMENT)}

</div>


</div>

</div>

</body>

</html>
`;

  // --------------------------------------------------------------
  // Send email with both PDFs
  // --------------------------------------------------------------

  MailApp.sendEmail({
    to: participant.email,

    subject: subject,

    body: plainBody,

    htmlBody: htmlBody,

    attachments: [entryPassPDF, odLetterPDF],

    name: CONFIG.EMAIL_SENDER_NAME,
  });
}

// ================================================================
// UPLOAD PAYMENT SCREENSHOT
// ================================================================

function uploadToDrive(dataUrl, originalFileName, name, phone) {
  const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);

  if (!mimeMatch) {
    throw new Error("Cannot parse DataURL MIME type.");
  }

  const mimeType = mimeMatch[1];

  const base64Content = dataUrl.split(",")[1];

  if (!base64Content) {
    throw new Error("Invalid Base64 image data.");
  }

  const decoded = Utilities.base64Decode(base64Content);

  const originalName = String(originalFileName || "payment_screenshot.png");

  const extension =
    originalName.indexOf(".") !== -1
      ? originalName.split(".").pop().toLowerCase()
      : "png";

  const safeName = sanitizeFilename(name);

  const safePhone = sanitizeFilename(phone);

  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyyMMdd_HHmmss",
  );

  const fileName =
    safeName + "_" + safePhone + "_" + timestamp + "." + extension;

  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);

  const blob = Utilities.newBlob(decoded, mimeType, fileName);

  const file = folder.createFile(blob);

  // --------------------------------------------------------------
  // NOTE:
  // This makes the payment screenshot accessible to anyone
  // who has the link.
  // --------------------------------------------------------------

  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

// ================================================================
// SAVE GENERATED PDF TO DRIVE
// ================================================================

function savePDFToDrive(pdfBlob, filename) {
  if (!CONFIG.PDF_FOLDER_ID) {
    throw new Error("PDF_FOLDER_ID is not configured.");
  }

  const folder = DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID);

  return folder.createFile(pdfBlob.setName(filename));
}

// ================================================================
// INITIALIZE SHEET
// ================================================================

function initializeSheet(sheet) {
  const headers = [
    "Timestamp",
    "Full Name",
    "Contact Number",
    "Email",
    "College / Institution",
    "Events Selected",
    "Food Preference",
    "Registration Fee",
    "Transaction ID",
    "Payment Screenshot",
    "Ticket Number",
    "Verification Status",
    "Pass Sent",
    "OD Generated",
    "Email Status",
    "Email Sent At",
    "Error Log",
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  sheet.setFrozenRows(1);

  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#222222")
    .setFontColor("#ffffff");

  sheet.autoResizeColumns(1, headers.length);
}

// ================================================================
// ENSURE REQUIRED COLUMNS EXIST
// ================================================================

function ensureColumns(sheet) {
  const requiredHeaders = [
    "Timestamp",
    "Full Name",
    "Contact Number",
    "Email",
    "College / Institution",
    "Events Selected",
    "Food Preference",
    "Registration Fee",
    "Transaction ID",
    "Payment Screenshot",
    "Ticket Number",
    "Verification Status",
    "Pass Sent",
    "OD Generated",
    "Email Status",
    "Email Sent At",
    "Error Log",
  ];

  const currentLastColumn = Math.max(sheet.getLastColumn(), requiredHeaders.length);

  const currentHeaders = sheet
    .getRange(1, 1, 1, currentLastColumn)
    .getValues()[0];

  // SAFE: Only fill cells that are completely empty.
  // Never overwrite an existing header — that would shift all data.
  requiredHeaders.forEach(function (header, index) {
    const column = index + 1;
    const existing = String(currentHeaders[index] || "").trim();
    if (existing === "") {
      sheet.getRange(1, column).setValue(header);
    }
  });

  sheet.setFrozenRows(1);
}

// ================================================================
// VALIDATE EMAIL
// ================================================================

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(String(email).trim());
}

// ================================================================
// SANITIZE FILENAMES
// ================================================================

function sanitizeFilename(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");
}

// ================================================================
// HTML ESCAPE
// ================================================================

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================================================================
// JSON RESPONSE
// ================================================================

function jsonResponse(status, message, extra) {
  const response = {
    status: status,

    message: message,
  };

  if (extra) {
    Object.keys(extra).forEach(function (key) {
      response[key] = extra[key];
    });
  }

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ================================================================
// AUTHORIZATION
//
// Run this manually ONCE from Apps Script editor.
// ================================================================

function authorizeScript() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Force permissions

  if (sheet) {
    sheet.getName();
  }

  DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID).getName();

  Logger.log("Authorization successful.");
}

// ================================================================
// MANUAL TEST
//
// This is useful before using the real verification trigger.
//
// Change TEST_ROW to an actual participant row.
//
// WARNING:
// This will send a REAL email.
//
// Keep false unless intentionally testing.
// ================================================================

function testParticipantDocuments() {
  const TEST_ROW = 2;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    CONFIG.SHEET_NAME,
  );

  if (!sheet) {
    throw new Error("Registrations sheet not found.");
  }

  sendParticipantDocuments(sheet, TEST_ROW);
}
