// ========================================
// CIVICPULSE SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://xebgdxspirohngfhqhsr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_KCxEuVZjdUzfP4NyNfbu-g_o1moEpnN";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("CivicPulse Supabase client initialized.");


async function testSupabaseConnection() {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("id")
    .limit(5);

  if (error) {
    console.error("CivicPulse database test failed:", error.message);
    return;
  }

  console.log("CivicPulse database connection successful!");
  console.log("Reports found in Supabase:", data.length);
}

testSupabaseConnection();


const reports = [
  {
    id: "Akanran area, Ona Ara", lat: 7.32, lng: 4.02,
    title: "Large pothole on the main road",
    category: "Roads",
    location: "Amuloko, Ibadan",
    description: "A large pothole has formed on the main road, causing traffic delays and posing a risk to vehicles.",
    severity: 5,
    confirmations: 8,
    affectedPeople: 300,
    status: "Pending",
    pressure: 88,
    days: 8
  },
  {
    id: "Ona Ara demo area 2", lat: 7.30, lng: 4.05,
    title: "Flooding after heavy rainfall",
    category: "Flooding",
    location: "Ariyo, Ibadan",
    description: "Heavy rainfall has caused flooding in the area, leading to water accumulation and potential safety hazards.",
    severity: 5,
    confirmations: 7,
    affectedPeople: 250,
    status: "In Progress",
    pressure: 76,
    days: 5
  },
  {
    id: "Ona-ara-demo-area-3", lat: 7.34, lng: 4.06,
    title: "Waste collection overdue",
    category: "Waste",
    location: "Oke-Eleshin, Ibadan",
    description: "The waste collection service has not been performed for several weeks, resulting in garbage piling up and creating an unsanitary environment.",
    severity: 4,
    confirmations: 5,
    affectedPeople: 150,
    status: "Pending",
    pressure: 61,
    days: 4
  },
  {
    id: "Ona-ara-demo-area-4", lat: 7.29, lng: 4.00,
    title: "Broken streetlight near junction",
    category: "Streetlights",
    location: "Olohunsogo, Ibadan",
    description: "A streetlight near the junction is not working, causing visibility issues and potential safety concerns.",
    severity: 4,
    confirmations: 4,
    affectedPeople: 100,
    status: "Pending",
    pressure: 54,
    days: 3
  },
  {
    id: "Ona-ara-demo-area-5", lat: 7.35, lng: 4.01,
    title: "Blocked drainage channel",
    category: "Drainage",
    location: "Larodo, Ibadan",
    description: "A drainage channel is blocked, leading to water accumulation and potential safety hazards.",
    severity: 3,
    confirmations: 3,
    affectedPeople: 80,
    status: "Resolved",
    pressure: 35,
    days: 7
  },
  {
    id: "Ona-ara-demo-area-6", lat: 7.31, lng: 4.08,
    title: "Water supply restored",
    category: "Water supply",
    location: "Odeyale, Ibadan",
    description: "The water supply has been restored after a period of outage.",
    severity: 2,
    confirmations: 2,
    affectedPeople: 30,
    status: "Resolved",
    pressure: 25,
    days: 2
  }
];

const reportList = document.getElementById("reportList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const reportDialog = document.getElementById("reportDialog");
const reportForm = document.getElementById("reportForm");


function calculatePressureScore(report) {
  const severity = Math.min(
    5,
    Math.max(1, Number(report.severity) || 1)
  );

  const confirmations = Math.min(
    10,
    Math.max(0, Number(report.confirmations) || 0)
  );

  const days = Math.min(
    30,
    Math.max(0, Number(report.days) || 0)
  );

  const affectedPeople = Math.min(
    500,
    Math.max(0, Number(report.affectedPeople) || 0)
  );

  const severityPoints = (severity / 5) * 35;
  const corroborationPoints = (confirmations / 10) * 25;
  const durationPoints = (days / 30) * 20;
  const affectedPoints = (affectedPeople / 500) * 20;

  const total =
    severityPoints +
    corroborationPoints +
    durationPoints +
    affectedPoints;

  return Math.round(Math.min(100, total));
}

function getPressureBreakdown(report) {
  const severity = Math.min(
    5, Math.max(1, Number(report.severity) || 1)
  );
  const confirmations = Math.min(
    10, Math.max(0, Number(report.confirmations) || 0)
  );
  const days = Math.min(
    30, Math.max(0, Number(report.days) || 0)
  );
  const affectedPeople = Math.min(
    500, Math.max(0, Number(report.affectedPeople) || 0)
  );

  return {
    severity: Math.round((severity / 5) * 35),
    corroboration: Math.round((confirmations / 10) * 25),
    duration: Math.round((days / 30) * 20),
    affected: Math.round((affectedPeople / 500) * 20)
  };
}

function pressureLevel(score) {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

// Recalculate the demonstration scores from their factors.
reports.forEach((report) => {
  report.pressure = calculatePressureScore(report);
});



function statusClass(status) {
  if (status === "In Progress") return "status-progress";
  if (status === "Resolved") return "status-resolved";
  return "status-pending";
}

function renderReports() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const status = statusFilter.value;

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      `${report.title} ${report.location} ${report.id}`
        .toLowerCase()
        .includes(query);

    const matchesCategory =
      category === "all" || report.category === category;

    const matchesStatus =
      status === "all" || report.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

 

  if (filteredReports.length === 0) {
    reportList.innerHTML = `
      <div class="empty-state">
        <h3>No reports found</h3>
        <p>Try another search term or change your filters.</p>
      </div>
    `;
    return;
  }

  reportList.innerHTML = filteredReports.map((report) => `
    <article class="report-card">
      <div>
        <div class="report-meta">
          <span class="tag">${report.category}</span>
          <span>${report.id}</span>
          <span class="status ${statusClass(report.status)}">
            ${report.status}
          </span>
        </div>
        <h3>${escapeHTML(report.title)}</h3>
        <p>📍 ${escapeHTML(report.location)} · Reported ${report.days} days ago</p>
      </div>

      <div>
  <div class="pressure ${pressureLevel(report.pressure)}"
       title="Illustrative priority score, not a validated AI prediction">
    <strong>${report.pressure}</strong>
    <span>Pressure Score / 100</span>
  </div>
  <div class="report-actions">
    <button class="view-details-btn"
      data-report-id="${escapeHTML(report.id)}">
      View details →
    </button>
  </div>
</div>
    </article>
  `).join("");

  updateStats();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function updateStats() {
  document.getElementById("totalReports").textContent = reports.length;
  document.getElementById("pendingReports").textContent =
    reports.filter((report) => report.status !== "Resolved").length;
  document.getElementById("resolvedReports").textContent =
    reports.filter((report) => report.status === "Resolved").length;
  document.getElementById("highPriority").textContent =
    reports.filter((report) => report.pressure >= 70).length;
}

function openReportForm() {
  reportDialog.showModal();
}

document.getElementById("openReport")
  .addEventListener("click", openReportForm);

document.getElementById("heroReport")
  .addEventListener("click", openReportForm);

document.getElementById("closeDialog")
  .addEventListener("click", () => reportDialog.close());

document.getElementById("showAll")
  .addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    statusFilter.value = "all";
    renderReports();
  });

searchInput.addEventListener("input", renderReports);
categoryFilter.addEventListener("change", renderReports);
statusFilter.addEventListener("change", renderReports);


reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = reportForm.querySelector(
    'button[type="submit"]'
  );
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    const formData = new FormData(reportForm);
    console.log("Community at submission:", formData.get("community"));
    console.log(
  "Dropdown element:",
  document.getElementById("issueCommunity")
);

console.log(
  "Dropdown value:",
  document.getElementById("issueCommunity")?.value
);

console.log(
  "Form contains dropdown:",
  reportForm.contains(document.getElementById("issueCommunity"))
);
    console.log("Community from form:", formData.get("community"));
    console.log("Form being submitted:", reportForm);

    const title = String(formData.get("title")).trim();
    const category = String(formData.get("category")).trim();
    const location = String(formData.get("location")).trim();
    const community = String(formData.get("community")).trim();

const communityCoordinates = {
  "amuloko": { lat: 7.32, lng: 4.02 },
  "akanran": { lat: 7.30, lng: 4.05 },
  "ariyo": { lat: 7.30, lng: 4.05 },
  "oke-eleshin": { lat: 7.34, lng: 4.06 }
};

const coordinates = communityCoordinates[community];
console.log("Community selected:", community);
console.log("Coordinates found:", coordinates);
console.log("Latitude for report:", coordinates?.lat);
console.log("Longitude for report:", coordinates?.lng);
    const description = String(formData.get("description")).trim();
    const severity = Number(formData.get("severity"));
    const affectedPeople = Number(formData.get("affectedPeople"));

    if (!title || !category || !location || !description) {
      alert("Please complete all fields.");
      return;
    }

    const newReport = {
      id: `CP-${Date.now()}`,
      title,
      category,
      location,
      description,
      status: "Pending",
      severity,
      confirmations: 0,
      affectedPeople,
      pressure: 0,
      days: 0,
      lat: coordinates ? coordinates.lat : null,
      lng: coordinates ? coordinates.lng : null,
      history: [
        {
          status: "Pending",
          note: "Report submitted through CivicPulse."
        }
      ]
    };

    newReport.pressure = calculatePressureScore(newReport);

    // Save the report to Supabase first.
    console.log("Supabase project:", SUPABASE_URL);
    console.log("Submitting report ID:", newReport.id);

   
const { data, error } = await supabaseClient
  .from("reports")
  .insert({
    id: newReport.id,
    title: newReport.title,
    category: newReport.category,
    location: newReport.location,
    description: newReport.description,
    severity: newReport.severity,
    confirmations: newReport.confirmations,
    affectedPeople: newReport.affectedPeople,
    status: newReport.status,
    pressure: newReport.pressure,
    days: newReport.days,
    lat: newReport.lat,
    lng: newReport.lng
  })
  .select("id, title");

console.log("Supabase insert result:", { data, error });


      console.log("Supabase insert result:", { data, error });

    if (error) {
      console.error("Could not save report:", error);
      alert(
        "Your report could not be saved. Please try again. " +
        "Your form details have been kept."
      );
      return;
    }

    // Update the existing dashboard only after saving succeeds.
    reports.unshift(newReport);

    reportForm.reset();
    reportDialog.close();

    searchInput.value = "";
    categoryFilter.value = "all";
    statusFilter.value = "all";

    renderReports();

    alert(
      "Your report has been saved to CivicPulse. " +
      "It has not been sent to a government agency."
    );

    document.getElementById("reports").scrollIntoView({
      behavior: "smooth"
    });

  } catch (error) {
    console.error("Unexpected submission error:", error);
    alert("Something went wrong while submitting. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});



const detailsDialog = document.getElementById("detailsDialog");
const detailContent = document.getElementById("detailContent");
const detailTitle = document.getElementById("detailTitle");
const detailStatus = document.getElementById("detailStatus");
const notice = document.getElementById("notice");

let selectedReportId = null;

function showNotice(message) {
  notice.textContent = message;
  notice.classList.add("show");

  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => {
    notice.classList.remove("show");
  }, 3000);
}

function getReportHistory(report) {
  if (!report.history) {
    report.history = [
      {
        status: "Pending",
        note: "Report received in the CivicPulse demo."
      }
    ];

    if (report.status !== "Pending") {
      report.history.push({
        status: report.status,
        note: "Current demo status recorded."
      });
    }
  }

  return report.history;
}

function renderTrackingTimeline(report) {
  const steps = [
    {
      status: "Pending",
      title: "Report submitted",
      note: "The issue has been recorded."
    },
    {
      status: "In Progress",
      title: "Work in progress",
      note: "The issue is being addressed."
    },
    {
      status: "Resolved",
      title: "Marked resolved",
      note: "The issue has been marked as resolved."
    }
  ];

  const currentIndex = steps.findIndex(
    (step) => step.status === report.status
  );

  return `
    <div class="tracking-timeline">
      ${steps.map((step, index) => {
        const completed = index < currentIndex;
        const current = index === currentIndex;

        const className = completed
          ? "complete"
          : current
            ? "current"
            : "";

        const symbol = completed
          ? "✓"
          : index + 1;

        return `
          <div class="timeline-step ${className}">
            <span class="timeline-marker">${symbol}</span>
            <div class="timeline-copy">
              <strong>${step.title}</strong>
              <p>${step.note}</p>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function openReportDetails(reportId) {
  const report = reports.find((item) => item.id === reportId);

  if (!report) {
    showNotice("We could not find that report.");
    return;
  }

  selectedReportId = report.id;
  const history = getReportHistory(report);

  detailTitle.textContent = report.title;
  detailStatus.value = report.status;

  detailContent.innerHTML = `
    <div class="detail-summary">
      <p><strong>Tracking ID:</strong> ${escapeHTML(report.id)}</p>
      <p><strong>Category:</strong> ${escapeHTML(report.category)}</p>
      <p><strong>Location:</strong> ${escapeHTML(report.location)}</p>
      <p><strong>Status:</strong>
        <span class="status ${statusClass(report.status)}">
          ${escapeHTML(report.status)}
        </span>
      </p>
      
<p>
  <strong>Pressure Score:</strong>
  ${report.pressure}/100
</p>

<h3>How this score was calculated</h3>

<div class="detail-summary">
  <p>
    <strong>Severity (35% maximum):</strong>
    ${getPressureBreakdown(report).severity}/35 points
  </p>
  <p>
    <strong>Community corroboration (25% maximum):</strong>
    ${getPressureBreakdown(report).corroboration}/25 points
    · ${report.confirmations || 0} confirmations
  </p>
  <p>
    <strong>Duration (20% maximum):</strong>
    ${getPressureBreakdown(report).duration}/20 points
    · ${report.days} days
  </p>
  <p>
    <strong>People affected (20% maximum):</strong>
    ${getPressureBreakdown(report).affected}/20 points
    · ${report.affectedPeople || 0} estimated
  </p>
  <p>
    <em>
      Scores are calculated from reported information and have not
      necessarily been independently verified.
    </em>
  </p>
</div>

    </div>

    <h3>Issue description</h3>
    <p class="detail-description">
      ${escapeHTML(report.description || "No description was provided.")}
    </p>

    <h3>Progress timeline</h3>
    ${renderTrackingTimeline(report)}

    <h3>Update history</h3>
    <div class="detail-summary">
      ${history.map((entry) => `
        <p>
          <strong>${escapeHTML(entry.status)}</strong><br>
          ${escapeHTML(entry.note)}
        </p>
      `).join("")}
    </div>
  `;

  detailsDialog.showModal();
}

reportList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-report-id]");

  if (!button) return;

  openReportDetails(button.dataset.reportId);
});

document.getElementById("closeDetails")
  .addEventListener("click", () => detailsDialog.close());

document.getElementById("saveStatus")
  .addEventListener("click", () => {
    const report = reports.find(
      (item) => item.id === selectedReportId
    );

    if (!report) return;

    const newStatus = detailStatus.value;

    if (newStatus === report.status) {
      showNotice("The report already has this status.");
      return;
    }

    report.status = newStatus;

    getReportHistory(report).push({
      status: newStatus,
      note: `Status changed to ${newStatus} in the CivicPulse demo.`
    });

    renderReports();
    openReportDetails(report.id);
    showNotice(`Report ${report.id} updated to ${newStatus}.`);
  });


/* ONA ARA INTERACTIVE COMMUNITY MAP */

let communityMap = null;
let mapMarkers = null;

function initializeCommunityMap() {
  const mapElement = document.getElementById("communityMap");

  // Avoid initializing the same map more than once.
  if (!mapElement || communityMap || typeof L === "undefined") {
    return;
  }

  // Initial view centered approximately on the Ona Ara area.
  communityMap = L.map("communityMap").setView([7.32, 4.04], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(communityMap);

  mapMarkers = L.layerGroup().addTo(communityMap);

  renderCommunityMap();

  // Leaflet sometimes needs a size refresh after its container appears.
  setTimeout(() => {
    communityMap.invalidateSize();
  }, 200);
}

function renderCommunityMap() {
  if (!communityMap || !mapMarkers) return;

  mapMarkers.clearLayers();

  const category = document.getElementById("mapCategory").value;
console.log(
  "Reports with coordinates:",
  reports.map((report) => ({
    title: report.title,
    lat: report.lat,
    lng: report.lng,
    latIsNumber: Number.isFinite(report.lat),
    lngIsNumber: Number.isFinite(report.lng)
  }))
);
  const mappedReports = reports.filter((report) => {
    const hasCoordinates =
      Number.isFinite(report.lat) &&
      Number.isFinite(report.lng);

    const isWithinDemoView =
      hasCoordinates &&
      report.lat >= 7.20 &&
      report.lat <= 7.45 &&
      report.lng >= 3.90 &&
      report.lng <= 4.20;

    const matchesCategory =
      category === "all" || report.category === category;

    return isWithinDemoView && matchesCategory;
  });

  mappedReports.forEach((report) => {
    const color =
      report.pressure >= 70
        ? "#dc5548"
        : report.pressure >= 40
          ? "#e5a33c"
          : "#168568";

    const markerIcon = L.divIcon({
      className: "civicpulse-marker-wrapper",
      html: `
        <span style="
          display:flex;
          align-items:center;
          justify-content:center;
          width:30px;
          height:30px;
          border:3px solid white;
          border-radius:50%;
          background:${color};
          color:white;
          font-size:11px;
          font-weight:800;
          box-shadow:0 2px 9px #172b4d55;
        ">!</span>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    console.table(
  mappedReports.map((report) => ({
    title: report.title,
    lat: report.lat,
    lng: report.lng,
    category: report.category
  }))
);

    const marker = L.marker(
      [report.lat, report.lng],
      { icon: markerIcon }
    );

    marker.bindPopup(`
      <div class="map-popup">
        <span class="popup-id">${escapeHTML(report.id)}</span>
        <h3>${escapeHTML(report.title)}</h3>
        <p><strong>Category:</strong> ${escapeHTML(report.category)}</p>
        <p><strong>Location:</strong> ${escapeHTML(report.location)}</p>
        <p><strong>Status:</strong> ${escapeHTML(report.status)}</p>
        <p><strong>Pressure Score:</strong> ${report.pressure}/100</p>
        <p><em>Illustrative demo report</em></p>
      </div>
    `);

    marker.addTo(mapMarkers);
  });
  console.log("Reports accepted:", mappedReports.length);
  console.log("Markers added to map:", mapMarkers.getLayers().length);
  console.log(
  "CURRENT MAP BOUNDS:",
  communityMap.getBounds().toBBoxString()
);

console.log(
  "CURRENT MAP BOUNDS:",
  communityMap.getBounds().toBBoxString()
);
console.log(
  "Map bounds:",
  communityMap.getBounds().toBBoxString()
);
console.log(
  "Marker coordinates:",
  mapMarkers.getLayers().map((marker) => marker.getLatLng())
);

  document.getElementById("mapReportCount").textContent =
    mappedReports.length;
}

document.getElementById("mapCategory")
  .addEventListener("change", renderCommunityMap);

// The reports array already exists, so initialize after the page loads.
initializeCommunityMap();


async function loadReportsFromSupabase() {
  const { data, error } = await supabaseClient
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "Could not load reports from Supabase:",
      error.message
    );
    return;
  }

  if (!data) return;

  data.forEach((savedReport) => {
    const existingIndex = reports.findIndex(
      (report) => report.id === savedReport.id
    );

    const report = {
      ...savedReport,
      lat: savedReport.lat == null
        ? null
        : Number(savedReport.lat),
      lng: savedReport.lng == null
        ? null
        : Number(savedReport.lng),
      severity: Number(savedReport.severity ?? 0),
      confirmations: Number(savedReport.confirmations ?? 0),
      affectedPeople: Number(savedReport.affectedPeople ?? 0),
      pressure: Number(savedReport.pressure ?? 0),
      days: Number(savedReport.days ?? 0)
    };

    if (existingIndex !== -1) {
      reports[existingIndex] = {
        ...reports[existingIndex],
        ...report
      };
    } else {
      reports.push(report);
    }
  });

  renderReports();
  renderCommunityMap();

  console.log(
    "CivicPulse reports loaded from Supabase:",
    data.length
  );
}

loadReportsFromSupabase();


// CivicPulse account dialog controls
document.addEventListener("DOMContentLoaded", () => {
  const accountDialog = document.getElementById("accountDialog");
  const accountForm = document.getElementById("accountForm");
  const accountTitle = document.getElementById("accountTitle");
  const accountSubtitle = document.getElementById("accountSubtitle");
  const accountSubmit = document.getElementById("accountSubmit");
  const accountPassword = document.getElementById("accountPassword");
  const accountMessage = document.getElementById("accountMessage");
  const accountSwitchText = document.getElementById("accountSwitchText");
  const switchAccountMode = document.getElementById("switchAccountMode");

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const closeAccountDialog = document.getElementById("closeAccountDialog");

  let accountMode = "login";

  function openAccountDialog(mode) {
    accountMode = mode;
    accountForm.reset();
    accountMessage.textContent = "";

    if (accountMode === "signup") {
      accountTitle.textContent = "Create your account";
      accountSubtitle.textContent =
        "Join your community on CivicPulse.";
      accountSubmit.textContent = "Create account";
      accountSwitchText.textContent = "Already have an account?";
      switchAccountMode.textContent = "Log in";
      accountPassword.autocomplete = "new-password";
    } else {
      accountTitle.textContent = "Welcome back";
      accountSubtitle.textContent =
        "Log in to your CivicPulse account.";
      accountSubmit.textContent = "Log in";
      accountSwitchText.textContent = "Don't have an account?";
      switchAccountMode.textContent = "Sign up";
      accountPassword.autocomplete = "current-password";
    }

    accountDialog.showModal();
  }

  loginBtn.addEventListener("click", () => {
    openAccountDialog("login");
  });

  signupBtn.addEventListener("click", () => {
    openAccountDialog("signup");
  });

  closeAccountDialog.addEventListener("click", () => {
    accountDialog.close();
  });

  switchAccountMode.addEventListener("click", () => {
    openAccountDialog(accountMode === "login" ? "signup" : "login");
  });

  // Connect CivicPulse accounts to Supabase Auth
  
accountForm.addEventListener("submit", async (event) => {
  event.preventDefault();

   
    const email = document
      .getElementById("accountEmail")
      .value.trim();

    const password = accountPassword.value;

    accountSubmit.disabled = true;
    accountSubmit.textContent =
      accountMode === "signup"
        ? "Creating account..."
        : "Logging in...";

    accountMessage.textContent = "";

    try {
      let result;

      if (accountMode === "signup") {
        result = await supabaseClient.auth.signUp({
          email,
          password
        });
      } else {
        result = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (accountMode === "signup" && !result.data.session) {
        accountMessage.textContent =
          "Registration received! Please check your email for a confirmation link before logging in.";
        return;
      }

      accountMessage.textContent =
        accountMode === "signup"
          ? "Your account has been created successfully!"
          : "You are now logged in!";

      accountDialog.close();

      alert(
        accountMode === "signup"
          ? "Welcome to CivicPulse! Your account has been created."
          : "Welcome back to CivicPulse!"
      );

    } catch (error) {
      console.error("CivicPulse authentication error:", error);

      accountMessage.textContent =
        error.message ||
        "Authentication failed. Please try again.";

    } finally {
      accountSubmit.disabled = false;
      accountSubmit.textContent =
        accountMode === "signup" ? "Create account" : "Log in";
    }
  });

  console.log("CivicPulse account controls initialized successfully.");
});
