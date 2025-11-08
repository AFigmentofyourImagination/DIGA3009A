// ------------------ Google API Setup ------------------

const CLIENT_ID = "323114305807-j8cfvivdk499n6lev7s3rq6hofplrlf3.apps.googleusercontent.com";
const API_KEY = "AIzaSyAey1SNI6xvGhM0W2W6jsos3P3OCQPRlZ4";
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// ------------------ API Initialization ------------------

function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // set later
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  // If you had authorize/signout buttons, enable them here
  // Optional if you just want form submission after first login
}

// ------------------ Auth ------------------

function handleAuthClick(callback) {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) throw resp;
    // now attach form submission
    callback();
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

// ------------------ Form Submission ------------------

function attachFormSubmission() {
  const form = document.querySelector("form");
  const content = document.getElementById("content");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent default HTML submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;

    // Ask for auth if not already
    if (!gapi.client.getToken()) {
      handleAuthClick(() => sendData(name, email, feedback));
    } else {
      sendData(name, email, feedback);
    }
  });
}

async function sendData(name, email, feedback) {
  const content = document.getElementById("content");

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: "1bYzf85QwjAgTUzKlid6WeMmMwlKm8J8GMx_RzVgl_c4",
      range: "Form responses",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [[name, email, feedback, new Date().toLocaleString()]],
      },
    });
    console.log("Row added:", response);
    content.innerText = "Feedback submitted successfully!";
    form.reset();
  } catch (err) {
    console.error("Error appending row:", err);
    content.innerText = "Failed to submit feedback. Check console.";
  }
}

// ------------------ Initialize form after page load ------------------

window.addEventListener("DOMContentLoaded", () => {
  attachFormSubmission();
});

// ------------------ Show all feedback (for owner only) ------------------

document.getElementById("showFeedback")?.addEventListener("click", async () => {
  const content = document.getElementById("content");

  // Prompt login if not already
  if (!gapi.client.getToken()) {
    handleAuthClick(fetchFeedback); // call fetchFeedback after login
  } else {
    fetchFeedback();
  }
});

async function fetchFeedback() {
  const content = document.getElementById("content");

  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1bYzf85QwjAgTUzKlid6WeMmMwlKm8J8GMx_RzVgl_c4",
      range: "Form responses",
    });

    const rows = response.result.values;
    if (!rows || rows.length === 0) {
      content.innerHTML = "<p>No feedback submitted yet.</p>";
      return;
    }

    // Create HTML table
    let table = "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    
    // Add headers from the first row
    table += "<thead><tr>";
    rows[0].forEach(header => {
      table += `<th>${header}</th>`;
    });
    table += "</tr></thead>";

    // Add the rest of the rows
    table += "<tbody>";
    for (let i = 1; i < rows.length; i++) {
      table += "<tr>";
      rows[i].forEach(cell => {
        table += `<td>${cell}</td>`;
      });
      table += "</tr>";
    }
    table += "</tbody></table>";

    content.innerHTML = table;

  } catch (err) {
    console.error("Error reading sheet:", err);
    content.innerHTML = "<p>Failed to fetch feedback. Check console.</p>";
  }
}

// ------------------ Export feedback as CSV (for owner only) ------------------

document.getElementById("exportFeedback")?.addEventListener("click", async () => {
  // Prompt login if needed
  if (!gapi.client.getToken()) {
    handleAuthClick(fetchAndExportFeedback);
  } else {
    fetchAndExportFeedback();
  }
});

async function fetchAndExportFeedback() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1bYzf85QwjAgTUzKlid6WeMmMwlKm8J8GMx_RzVgl_c4",
      range: "Form responses",
    });

    const rows = response.result.values;
    if (!rows || rows.length === 0) {
      alert("No feedback submitted yet.");
      return;
    }

    // Convert rows to CSV
    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    // Create a downloadable link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "feedback.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Feedback exported as CSV successfully!");
  } catch (err) {
    console.error("Error exporting feedback:", err);
    alert("Failed to export feedback. Check console.");
  }
}
