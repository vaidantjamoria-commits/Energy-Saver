// EnergySaver: beginner-friendly reminder app using HTML, CSS and JavaScript.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const sampleReminders = [
  { id: 1, title: "Turn off lights when not in use", note: "Your room, washroom, common areas", time: "12:30", active: true, completed: false, icon: "♧", notifiedDate: "" },
  { id: 2, title: "Unplug phone chargers", note: "After charging is complete", time: "16:00", active: true, completed: false, icon: "♟", notifiedDate: "" },
  { id: 3, title: "Keep AC at 24°C or higher", note: "For better efficiency", time: "18:00", active: true, completed: false, icon: "❄", notifiedDate: "" },
  { id: 4, title: "Save water", note: "Avoid running taps unnecessarily", time: "20:00", active: true, completed: false, icon: "♢", notifiedDate: "" }
];
let reminders = JSON.parse(localStorage.getItem("energySaverReminders") || "null") || sampleReminders;

let toastTimer;

function storeData() {
  localStorage.setItem("energySaverReminders", JSON.stringify(reminders));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}
function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function renderReminders() {
  const html = reminders.slice().sort((a,b) => a.time.localeCompare(b.time)).map(item => `
    <div class="reminder-item ${item.completed ? "completed" : ""}">
      <div class="reminder-symbol">${item.icon || "♧"}</div>
      <div class="reminder-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.note || "A small step for the planet")}</small></div>
      <span class="reminder-time">${formatTime(item.time)}</span>
      <div class="reminder-controls">
        <button class="check-btn ${item.completed ? "done" : ""}" data-complete="${item.id}" title="${item.completed ? "Mark incomplete" : "Mark completed"}" aria-label="Toggle completed"><span></span></button>
        <button class="delete-btn" data-delete="${item.id}" title="Delete reminder" aria-label="Delete reminder">×</button>
      </div>
    </div>`).join("");
  $("#reminderList").innerHTML = html;
  $("#allReminderList").innerHTML = html || '<p class="empty-message">No reminders yet.</p>';
  $("#emptyMessage").classList.toggle("hidden", reminders.length > 0);
  const completedTotal = reminders.filter(r => r.completed).length;
  $("#savedValue").textContent = completedTotal;
  $("#statsSaved").textContent = completedTotal;
  $("#completedCount").textContent = reminders.filter(r => r.completed).length;
  $("#activeCount").textContent = reminders.filter(r => r.active && !r.completed).length;
  const percent = reminders.length ? Math.round(reminders.filter(r => r.completed).length / reminders.length * 100) : 0;
  $("#progressBar").style.width = percent + "%";
  $("#progressText").textContent = percent ? `${percent}% complete — great work keeping your habits green!` : "Complete a reminder to grow your progress.";
}
function setPage(pageName) {
  $$(".page").forEach(page => page.classList.toggle("active-page", page.id === pageName));
  $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === pageName));
  if (pageName === "stats") renderReminders();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openModal(prefill = "") {
  $("#modal").classList.remove("hidden");
  $("#reminderTitle").value = prefill;
  $("#reminderNote").value = "";
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  $("#reminderTime").value = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  $("#reminderTitle").focus();
}
function closeModal() { $("#modal").classList.add("hidden"); }

function customNotification(title, body) {
  // Browser notifications work on localhost/HTTPS after permission is granted.
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const notice = new Notification("🌿 EnergySaver", {
        body: `${title}\n${body}`,
        icon: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="25" fill="#710e16"/><path d="M50 78V45M50 56C18 55 20 26 20 26s29-1 30 30M50 48C51 17 80 19 80 19s3 28-30 29" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/></svg>')
      });
      notice.onclick = () => { window.focus(); notice.close(); };
    } catch (error) { console.log("Notification could not be displayed:", error); }
  }
}
async function enableNotifications() {
  if (!("Notification" in window)) {
    showToast("This browser does not support notifications. You can still use on-page reminders.");
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showToast("🌿 Notifications enabled! Keep this page open for scheduled reminders.");
      customNotification("Notifications are ready!", "EnergySaver will remind you about your selected habits.");
      $("#notificationPermission").textContent = "✓ Notifications enabled";
      $("#settingsNotify").textContent = "Enabled";
    } else {
      showToast("Notifications were not enabled. You can change this in your browser settings.");
    }
  } catch (error) { showToast("Could not request notification permission in this browser."); }
}
function playChime() {
  if (!$("#soundToggle").checked) return;
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.frequency.value = 660; gain.gain.value = 0.06;
    oscillator.start(); oscillator.stop(audio.currentTime + 0.18);
    oscillator.onended = () => audio.close();
  } catch (error) { /* Audio may be blocked until the user interacts with the page. */ }
}
function checkDueReminders() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const today = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  reminders.forEach(item => {
    if (item.active && !item.completed && item.time === currentTime && item.notifiedDate !== today) {
      item.notifiedDate = today;
      customNotification(item.title, item.note || "Time for a small energy-saving action.");
      showToast(`🌿 Reminder: ${item.title}`);
      playChime();
      storeData();
    }
  });
}
// Browser tabs must stay open for this beginner version's scheduled reminders.
setInterval(checkDueReminders, 15000);

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-page]");
  if (nav) setPage(nav.dataset.page);
  const tip = event.target.closest("[data-tip]");
  if (tip) {
    const map = { lights: "Turn off lights when not in use", chargers: "Unplug phone chargers", ac: "Keep AC at 24°C or higher", water: "Save water" };
    openModal(map[tip.dataset.tip]);
  }
  const addTip = event.target.closest("[data-addtip]");
  if (addTip) openModal(addTip.dataset.addtip);
  const complete = event.target.closest("[data-complete]");
  if (complete) {
    const item = reminders.find(r => r.id === Number(complete.dataset.complete));
    if (item) {
      item.completed = !item.completed;
      if (item.completed) { showToast("Nice work! 🌱 Action marked complete."); }
      storeData(); renderReminders();
    }
  }
  const del = event.target.closest("[data-delete]");
  if (del) {
    reminders = reminders.filter(r => r.id !== Number(del.dataset.delete));
    storeData(); renderReminders(); showToast("Reminder deleted.");
  }
});
$("#openAdd").addEventListener("click", () => openModal());
$("#openAdd2").addEventListener("click", () => openModal());
$("#quickAdd").addEventListener("click", () => openModal());
$("#closeModal").addEventListener("click", closeModal);
$("#modal").addEventListener("click", event => { if (event.target === $("#modal")) closeModal(); });
$("#reminderForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = $("#reminderTitle").value.trim();
  if (!title) return;
  reminders.push({
    id: Date.now(), title, time: $("#reminderTime").value,
    note: $("#reminderNote").value.trim(), active: true, completed: false,
    icon: "🌿", notifiedDate: ""
  });
  storeData(); renderReminders(); closeModal(); showToast("Reminder saved! Keep this page open for its alert.");
});
$("#notificationPermission").addEventListener("click", enableNotifications);
$("#settingsNotify").addEventListener("click", enableNotifications);
$("#darkToggle").addEventListener("change", event => {
  document.body.classList.toggle("dark", event.target.checked);
  localStorage.setItem("energySaverDark", event.target.checked ? "yes" : "no");
});
$("#themeShortcut").addEventListener("click", () => {
  $("#darkToggle").checked = !$("#darkToggle").checked;
  $("#darkToggle").dispatchEvent(new Event("change"));
  showToast($("#darkToggle").checked ? "Dark theme enabled 🌙" : "Light theme enabled ☀");
});
$("#resetData").addEventListener("click", () => {
  if (confirm("Reset all reminders and estimated energy savings?")) {
    reminders = sampleReminders.map(item => ({...item}));
    storeData(); renderReminders(); showToast("Demo data has been reset.");
  }
});
function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short" }) + " · " + now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  const hour = now.getHours();
  $("#greeting").textContent = hour < 12 ? "Good Morning!" : hour < 17 ? "Good Afternoon!" : "Good Evening!";
}
const savedTheme = localStorage.getItem("energySaverDark") === "yes";
$("#darkToggle").checked = savedTheme;
document.body.classList.toggle("dark", savedTheme);
if ("Notification" in window && Notification.permission === "granted") {
  $("#notificationPermission").textContent = "✓ Notifications enabled";
  $("#settingsNotify").textContent = "Enabled";
}
updateClock(); setInterval(updateClock, 30000); renderReminders();
