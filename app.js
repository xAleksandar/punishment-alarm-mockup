// Simple mock interactivity for Alarm App Demo
let alarms = [
  { time: "07:00", label: "Wake up for work", punishment: ["Pay $2"], active: true },
  { time: "08:30", label: "Gym Time", punishment: ["Math Puzzle"], active: false },
];

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

function renderAlarms() {
  const list = $(".alarms-list");
  if (!list) return;
  list.innerHTML = alarms.map((alarm, i) => `
    <div class="alarm-item${alarm.active ? '' : ' inactive'}">
      <div>
        <b>${alarm.time}</b> <span class="label">${alarm.label}</span><br/>
        <span class="punishment">${alarm.punishment.join(", ")}</span>
      </div>
      <div class="controls">
        <label class="radio-style">
          <input type="radio" name="alarm-toggle" ${alarm.active ? "checked" : ""} onchange="toggleAlarm(${i})">
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
  `).join("");
}

window.toggleAlarm = function(i) {
  alarms[i].active = !alarms[i].active;
  renderAlarms();
}

function showScreen(screen) {
  $(".alarms-main").style.display = (screen === 'main') ? 'block' : 'none';
  $(".set-alarm").style.display = (screen === 'add') ? 'block' : 'none';
  $(".alarm-modal").style.display = (screen === 'ring') ? 'flex' : 'none';
}

// New alarm logic
$(".plus-btn").onclick = () => {
  showScreen('add');
  $("#alarm-time").value = "07:00";
  $("#alarm-label").value = "";
  $all(".alarm-punish input[type=checkbox]").forEach(cb => cb.checked = false);
  $("#random-punish").checked = false;
  punishToggle();
};

$(".cancel-alarm").onclick = () => showScreen('main');

$(".save-alarm").onclick = () => {
  let time = $("#alarm-time").value;
  let label = $("#alarm-label").value || "Alarm";
  let acts = [];
  if($("#random-punish").checked) acts = ["Random punishment"];
  else $all(".alarm-punish input[type=checkbox]").forEach(cb => { if(cb.checked) acts.push(cb.nextElementSibling.innerText); });
  if (acts.length === 0) acts = ["Pay $2"];
  alarms.push({ time, label, punishment: acts, active: true });
  renderAlarms();
  showScreen('main');
};

// Punishment selection logic
function punishToggle() {
  let isRand = $("#random-punish").checked;
  $all(".alarm-punish input[type=checkbox]").forEach(cb => { if(cb.id!=="random-punish") cb.disabled = isRand; });
}
$("#random-punish").onchange = punishToggle;

// Alarm modal mockup
$(".alarms-list").ondblclick = () => {
  // On double-click, show modal
  let a = alarms.find(a => a.active);
  if(a){
    $(".alarm-modal .alarm-title").innerText = a.label;
    $(".alarm-modal .alarm-time").innerText = a.time;
    showScreen('ring');
  }
};

$(".snooze-btn").onclick = () => {
  $(".alarm-modal .feedback").innerHTML = '<span class="feedback-err">Punishment triggered!</span>';
};
$(".stop-btn").onclick = () => {
  $(".alarm-modal .feedback").innerHTML = '<span class="feedback-ok">Alarm stopped.</span>';
  setTimeout(()=>showScreen('main'), 1100);
};

window.onload = renderAlarms;
