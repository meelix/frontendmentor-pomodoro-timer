/* ---------------------------------- setup --------------------------------- */

const pct = document.querySelector('.pct');
const pctIndicator = document.querySelector('#pct-ind');
const durationElement = document.querySelector('#duration');

const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

const fullCircle = 2 * (22 / 7) * 47; // 2PI * Radius

const settingsDialog = document.getElementById("settings");

const formElement = document.querySelector("#settings form");

const actionButton = document.getElementById("timer");
const actionButtonText = actionButton.querySelector(".asdf");

const resetButton = document.getElementById("reset-timer");

let timerInterval;

let isToggelable = true; //pause with spacebar

const defaultSettings = {
  times: {
    pomodoro: 25,
    long: 15,
    short: 5
  },
  font: "var(--font-sans)",
  color: "var(--c-orange)",
}
localStorage.getItem("settings") || localStorage.setItem("settings", JSON.stringify(defaultSettings));
let settings = JSON.parse(localStorage.getItem("settings"));

let currentTimer = localStorage.getItem("currentTimer") || "timer-pomodoro";
localStorage.setItem("currentTimer", currentTimer);
let lol = JSON.parse(localStorage.getItem(currentTimer));

if(currentTimer != undefined) {
  initializeTimer();
} else {
  alert("error1")
}

function initializeTimer() {
  switch(currentTimer) {
    case "timer-pomodoro":
      let a_distance = new Date().getTime() + (settings.times.pomodoro * 60 * 1000) - new Date().getTime();
      let a_minutes = Math.max(0, Math.floor((a_distance % (1000 * 60 * 60)) / (1000 * 60)));
      let a_seconds = Math.max(0, Math.floor((a_distance % (1000 * 60)) / 1000));
      let a_timeString = `<span>${String(a_minutes).padStart(2, '0')}</span><span>:</span><span>${String(a_seconds).padStart(2, '0')}</span>`;
      if(!localStorage.getItem(currentTimer) || !lol) {
        lol = {
          diffrence: a_distance,
          percent: 0,
          timeString: a_timeString
        }
        durationElement.innerHTML = a_timeString;
        asdf(0);
      } else {
        lol = JSON.parse(localStorage.getItem(currentTimer));
        durationElement.innerHTML = lol.timeString;
        asdf(lol.percent);
      }
      break;
    case "timer-short-break":
      let b_distance = new Date().getTime() + (settings.times.short * 60 * 1000) - new Date().getTime();
      let b_minutes = Math.max(0, Math.floor((b_distance % (1000 * 60 * 60)) / (1000 * 60)));
      let b_seconds = Math.max(0, Math.floor((b_distance % (1000 * 60)) / 1000));
      let b_timeString = `<span>${String(b_minutes).padStart(2, '0')}</span><span>:</span><span>${String(b_seconds).padStart(2, '0')}</span>`;
      if(!localStorage.getItem(currentTimer) || !lol) {
        lol = {
          diffrence: b_distance,
          percent: 0,
          timeString: b_timeString
        }
        durationElement.innerHTML = b_timeString;
        asdf(0);
      } else {
        lol = JSON.parse(localStorage.getItem(currentTimer));
        durationElement.innerHTML = lol.timeString;
        asdf(lol.percent);
      }
      break;
    case "timer-long-break":
      let c_distance = new Date().getTime() + (settings.times.long * 60 * 1000) - new Date().getTime();
      let c_minutes = Math.max(0, Math.floor((c_distance % (1000 * 60 * 60)) / (1000 * 60)));
      let c_seconds = Math.max(0, Math.floor((c_distance % (1000 * 60)) / 1000));
      let c_timeString = `<span>${String(c_minutes).padStart(2, '0')}</span><span>:</span><span>${String(c_seconds).padStart(2, '0')}</span>`;
      if(!localStorage.getItem(currentTimer) || !lol) {
        lol = {
          diffrence: c_distance,
          percent: 0,
          timeString: c_timeString
        }
        durationElement.innerHTML = c_timeString;
        asdf(0);
      } else {
        lol = JSON.parse(localStorage.getItem(currentTimer));
        durationElement.innerHTML = lol.timeString;
        asdf(lol.percent);
      }
      break;
  }
}

document.documentElement.style.setProperty('--theme-font', settings.font);
document.documentElement.style.setProperty('--theme-color', settings.color);
document.body.setAttribute("data-theme-color",document.querySelector(`[value="${settings.color}"]`).id);
document.body.setAttribute("data-theme-font",document.querySelector(`[value="${settings.font}"]`).id);

document.getElementById("pomodoro").value = settings.times.pomodoro;
document.getElementById("short-break").value = settings.times.short;
document.getElementById("long-break").value = settings.times.long;
document.querySelector(`[value="${settings.font}"]`).checked = true;
document.querySelector(`[value="${settings.color}"]`).checked = true;

if (localStorage.getItem("currentAction") === "running") {
  countdown();
  actionButtonText.textContent = "Pause";
  actionButton.setAttribute("data-action", "pause");
} else {
  if (lol.percent === 0 && localStorage.getItem(currentTimer)) {
    resetButton.classList.remove("hidden");
  } else if (!localStorage.getItem(currentTimer)) {
    resetButton.classList.add("hidden");
  } else {
    resetButton.classList.remove("hidden");
  }
}
console.log(lol.percent);
if (lol.percent === 0 && localStorage.getItem(currentTimer)) {
  resetButton.classList.remove("hidden");
} else if (!localStorage.getItem(currentTimer)) {
  resetButton.classList.add("hidden");
} else {
  resetButton.classList.remove("hidden");
}

actionButton.addEventListener("click", e => {
  e.preventDefault();
});

const durationNavElement = document.querySelector(".duration");
const durationNavButtons = document.querySelectorAll(".duration button");
let savedButton = document.getElementById(currentTimer);
durationNavElement.style.setProperty('--bg-pos', savedButton.getAttribute("data-bg-pos"));
savedButton.classList.add("active");
let prevButton = savedButton;

durationNavButtons.forEach(btn => btn.addEventListener("click", e => {
  durationNavElement.style.setProperty('--bg-pos', e.target.getAttribute("data-bg-pos"));
  prevButton.classList.remove("active");
  prevButton = btn;
  btn.classList.add("active");
}))

/* ---------------------------------- time ---------------------------------- */
function asdf(value) {
  const p = lerp(0,value,fullCircle);    //dec ccw
  // const p = lerp(value,0,fullCircle); //dec cw
  // const p = lerp(1,value,fullCircle); //inc ccw
  // const p = lerp(value,1,fullCircle); //inc cw
  pctIndicator.style = `stroke-dashoffset: ${p};`
}

function countdown(timer = currentTimer) {
  localStorage.setItem("currentAction", "running");

  let start = new Date().getTime();
  let countDownDate = 0;

  if (lol.diffrence > 0) {
    countDownDate = start + parseFloat(lol.diffrence);
  } else {
    switch(timer) {
      case "timer-pomodoro":
        countDownDate = start + (settings.times.pomodoro * 60 * 1000);
        break;
      case "timer-short-break":
        countDownDate = start + (settings.times.short * 60 * 1000);
        break;
      case "timer-long-break":
        countDownDate = start + (settings.times.long * 60 * 1000);
        break;
    }
  }
  let startDate = start;
  let initialDistance = countDownDate - startDate;

  let percent = 0;
  let initialMin = parseFloat(lol.percent) || 0;

  timerInterval = setInterval(function () {
    let now = new Date().getTime();
    let distance = Math.max(0,countDownDate - now);

    percent = range(initialDistance, 0, initialMin, 1, distance);

    let minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    let timeString = `<span>${String(minutes).padStart(2, '0')}</span><span>:</span><span>${String(seconds).padStart(2, '0')}</span>`;

    lol = {
      diffrence: Math.floor(distance),
      percent: percent,
      timeString: timeString
    }

    durationElement.innerHTML = timeString;

    if(timer != undefined) {
      localStorage.setItem(timer, JSON.stringify(lol));
    } else {
      alert("error2")
    }


    asdf(percent);
    
    // debug.textContent = `
    // distance: ${distance}
    // initialDistance: ${initialDistance}
    // percent: ${percent.toFixed(3)}
    // currentTimer: ${currentTimer}
    // lol: ${JSON.stringify(lol)}
    // localstorage lol: ${localStorage.getItem(timer)}
    // `;

    if (distance < 1) {
      clearInterval(timerInterval);

      percent = 0;
      lol.percent = percent;
      localStorage.setItem(timer, JSON.stringify(lol));
      asdf(1);

      actionButtonText.textContent = "Restart";
      actionButton.setAttribute("data-action", "reset");
      localStorage.setItem("currentAction", "holding");
      actionButton.classList.add("finished");
    }
  // }, 33); // ~30hz
  }, 66); // ~15hz
}

function startTimer(timer = currentTimer) {
  countdown(timer);
  actionButtonText.textContent = "Pause";
  actionButton.setAttribute("data-action", "pause");
  actionButton.classList.remove("finished");
  resetButton.classList.add("hidden");
}
function pauseTimer(timer = currentTimer) {
  localStorage.setItem("currentAction", "holding");
  clearInterval(timerInterval);
  actionButtonText.textContent = "Resume";
  actionButton.setAttribute("data-action", "resume");
  resetButton.classList.remove("hidden");
}
function resumeTimer() {
  countdown(currentTimer);
  actionButtonText.textContent = "Pause";
  actionButton.setAttribute("data-action", "pause");
  resetButton.classList.add("hidden");
}
function resetTimer(timer = currentTimer) {
  asdf(0);
  actionButtonText.textContent = "Start";
  actionButton.setAttribute("data-action", "start");
  localStorage.removeItem(timer)
  initializeTimer();
  resetButton.classList.add("hidden");
}

actionButton.addEventListener("click", () => {
  switch (actionButton.getAttribute("data-action")) {
    case "start":
      startTimer();
      break;
    case "pause":
      pauseTimer();
      break;
    case "resume":
      resumeTimer();
      break;
    case "reset":
      resetTimer();
      break;
  }
});
resetButton.addEventListener("click", e => {
  pauseTimer();
  resetTimer();
  initializeTimer();
})

/* ----------------------------- timer selection ---------------------------- */

document.querySelectorAll("nav.duration button").forEach(btn => btn.addEventListener("click", e => {
  pauseTimer();
  actionButton.classList.add("finished");
  setTimeout(()=>actionButton.classList.remove("finished"), 800);

  currentTimer = e.target.getAttribute("id");
  localStorage.setItem("currentTimer", currentTimer);
  
  if(localStorage.getItem(currentTimer)) {
    lol = JSON.parse(localStorage.getItem(currentTimer));
    asdf(lol.percent);
    durationElement.innerHTML = lol.timeString || `<span>00</span><span>:</span><span>00</span>`;    
  }
  initializeTimer();
  if (lol.percent === 0 && localStorage.getItem(currentTimer)) {
    resetButton.classList.remove("hidden");
  } else if (!localStorage.getItem(currentTimer)) {
    resetButton.classList.add("hidden");
  } else {
    resetButton.classList.remove("hidden");
  }
}));

/* -------------------------------- settings -------------------------------- */

formElement.addEventListener("submit", e => {
  e.preventDefault();
  if (e.submitter.value === "cancel") {
    settingsDialog.close();
    return;
  };

  const formData = new FormData(formElement);
  const values = Object.fromEntries([...formData.entries()]);
  console.log(values);

  let toUpdate = {
    times: {
      pomodoro: values.pomodoro,
      long: values.long_break,
      short: values.short_break
    },
    font: values.font,
    color: values.color,
  }
  console.log(toUpdate);
  updateSettings(toUpdate);

  settingsDialog.close();
});

function updateSettings(newSettings) {
  let updated = { ...settings, ...newSettings };
  settings = updated;

  document.documentElement.style.setProperty('--theme-font', settings.font);
  document.documentElement.style.setProperty('--theme-color', settings.color);
  document.body.setAttribute("data-theme-color",document.querySelector(`[value="${settings.color}"]`).id);
  document.body.setAttribute("data-theme-font",document.querySelector(`[value="${settings.font}"]`).id);

  localStorage.setItem("settings", JSON.stringify(updated));

  initializeTimer();
}

document.getElementById("open-settings").addEventListener("click", e => {
  document.getElementById("pomodoro").value = settings.times.pomodoro;
  document.getElementById("short-break").value = settings.times.short;
  document.getElementById("long-break").value = settings.times.long;
  document.querySelector(`[value="${settings.font}"]`).checked = true;
  document.querySelector(`[value="${settings.color}"]`).checked = true;
  
  settingsDialog.showModal();
  isToggelable = false;
})
document.getElementById("close-settings").addEventListener("click", e => {
  settingsDialog.close();
})
settingsDialog.addEventListener('close', e => {
  isToggelable = true;
});

/* ------------------------------ miscellaneous ----------------------------- */
// this is just for the progress animation - so it wouldn't flicker on page load
window.onload = () => {
  document.body.classList.add("loaded");
};

// qol - start/stop timer with spacebar
document.addEventListener('keyup', (e) => {
  document.activeElement.classList.contains("active");
  if (e.code === "Space" && isToggelable && (document.activeElement.tagName === "HTML" || document.activeElement.tagName === "BODY" || document.activeElement.id === "timer" || document.activeElement.classList.contains("active"))) {
    e.preventDefault();
    if (localStorage.getItem("currentAction") === "running" && actionButton.getAttribute("data-action") !== "reset") { //pause
      pauseTimer();
    } else if (localStorage.getItem("currentAction") === "holding" && actionButton.getAttribute("data-action") !== "reset") { //start
      startTimer();
    } else { //reset
      resetTimer();
      setTimeout(()=>actionButton.classList.remove("finished"), 1000);
    }
  }
});