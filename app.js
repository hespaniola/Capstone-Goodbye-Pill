const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const state = {
  emotion: "",
  stepIndex: 0,
  secondsLeft: 60,
  timerId: null,
  reduceMotion: false,
  audioOn: false,
};

const steps = [
  { text: (e) => `Name it gently: “I’m feeling ${e || "something heavy"}.”`, seconds: 0 },
  { text: () => `Inhale for 4… exhale for 6.`, seconds: 20 },
  { text: () => `What’s one thing you can release right now (even 1%)?`, seconds: 0 },
  { text: () => `You did enough for today. When ready, complete the symbolic release.`, seconds: 0 },
];

function setYear() {
  $("#year").textContent = new Date().getFullYear();
}

function routeTo(viewName) {
  $$(".view").forEach(v => v.classList.remove("is-active"));
  const view = $(`.view[data-view="${viewName}"]`);
  if (view) view.classList.add("is-active");

  $$(".nav-btn").forEach(btn => {
    const isCurrent = btn.dataset.route === viewName;
    if (isCurrent) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
}

function selectEmotion(emotion) {
  state.emotion = emotion;
  $("#emotionBadge").textContent = `Emotion: ${emotion}`;
  $("#sessionSubtitle").textContent = `A short symbolic reset for ${emotion.toLowerCase()}.`;
  $("#emotionSelect").value = emotion;

  // Move to session view to make it feel responsive
  routeTo("session");
  resetSessionUI();
}

function resetSessionUI() {
  stopTimer();
  state.stepIndex = 0;
  state.secondsLeft = 60;

  $("#timeLeft").textContent = String(state.secondsLeft);
  $("#promptText").textContent = state.emotion
    ? steps[0].text(state.emotion)
    : "Choose an emotion to begin.";

  $("#sessionStart").disabled = !state.emotion;
  $("#sessionNext").disabled = true;
  $("#releaseBtn").disabled = true;

  setBreathPulse(false);
}

function setBreathPulse(on) {
  const orb = $("#breathOrb");
  if (!orb) return;

  orb.animate?.([], { duration: 1 }); // harmless no-op for older browsers
  orb.style.transform = "scale(1)";

  if (!on || state.reduceMotion) return;

  // Simple pulse animation using WAAPI if available
  orb._anim?.cancel?.();
  orb._anim = orb.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
    { duration: 2500, iterations: Infinity, easing: "ease-in-out" }
  );
}

function stopTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function startTimer() {
  stopTimer();
  state.secondsLeft = 60;
  $("#timeLeft").textContent = String(state.secondsLeft);

  state.timerId = window.setInterval(() => {
    state.secondsLeft -= 1;
    $("#timeLeft").textContent = String(state.secondsLeft);

    if (state.secondsLeft <= 0) {
      stopTimer();
      $("#sessionNext").disabled = false;
      $("#releaseBtn").disabled = false;
      $("#breathHint").textContent = "Timer complete. Continue when ready.";
      setBreathPulse(false);
    }
  }, 1000);
}

function showStep(idx) {
  state.stepIndex = idx;
  const step = steps[idx];

  $("#promptText").textContent = step.text(state.emotion);

  // If this step is timed breathing, start the timer and pulse
  if (step.seconds > 0) {
    $("#sessionNext").disabled = true;
    $("#releaseBtn").disabled = true;
    $("#breathHint").textContent = "Inhale… Exhale…";
    setBreathPulse(true);
    startTimer();
  } else {
    stopTimer();
    $("#sessionNext").disabled = false;
    $("#breathHint").textContent = "Take your time.";
    setBreathPulse(false);
  }

  // Final step enables symbolic release
  if (idx === steps.length - 1) {
    $("#sessionNext").disabled = true;
    $("#releaseBtn").disabled = false;
  }
}

function completeRelease() {
  stopTimer();
  setBreathPulse(false);

  $("#promptText").textContent =
    `Release completed for ${state.emotion}. You can reflect, or start again anytime.`;

  $("#releaseHint").textContent = "Nice work. Consider writing one sentence in Reflect.";
  $("#sessionNext").disabled = true;
  $("#releaseBtn").disabled = true;

  // Route to reflect after a short beat
  window.setTimeout(() => routeTo("reflect"), 500);
}

function toggleAudio() {
  const audio = $("#ambientAudio");
  const btn = $("#toggleAudioBtn");
  if (!audio) return;

  state.audioOn = !state.audioOn;
  btn.setAttribute("aria-pressed", String(state.audioOn));

  if (state.audioOn) {
    btn.textContent = "Ambient audio: On";
    audio.volume = 0.35;
    audio.play().catch(() => {
      // If no source added yet or browser blocks autoplay
      btn.textContent = "Ambient audio: (add file)";
      state.audioOn = false;
      btn.setAttribute("aria-pressed", "false");
    });
  } else {
    btn.textContent = "Ambient audio: Off";
    audio.pause();
  }
}

function initReflection() {
  const intensity = $("#intensity");
  const intensityValue = $("#intensityValue");
  intensity.addEventListener("input", () => {
    intensityValue.textContent = intensity.value;
  });

  $("#saveLocalBtn").addEventListener("click", () => {
    const data = {
      ts: Date.now(),
      emotion: $("#emotionSelect").value,
      intensity: $("#intensity").value,
      journal: $("#journal").value.trim(),
    };
    localStorage.setItem("gbp_reflection", JSON.stringify(data));
    $("#localStatus").textContent = "Saved locally on this device.";
  });

  $("#clearLocalBtn").addEventListener("click", () => {
    localStorage.removeItem("gbp_reflection");
    $("#localStatus").textContent = "Cleared.";
  });

  // Load if exists
  const saved = localStorage.getItem("gbp_reflection");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.emotion) $("#emotionSelect").value = data.emotion;
      if (data.intensity) $("#intensity").value = data.intensity;
      $("#intensityValue").textContent = $("#intensity").value;
      if (data.journal) $("#journal").value = data.journal;
      $("#localStatus").textContent = "Loaded your last local reflection.";
    } catch {
      // ignore
    }
  }
}

function wireUI() {
  // Navigation
  $$(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => routeTo(btn.dataset.route));
  });

  // Emotion pills
  $$(".pill").forEach(btn => {
    btn.addEventListener("click", () => selectEmotion(btn.dataset.emotion));
  });

  // Hero start
  $("#startSessionBtn").addEventListener("click", () => {
    if (!state.emotion) {
      // If user didn’t pick one, choose a default and proceed
      selectEmotion("Stress");
    } else {
      routeTo("session");
      resetSessionUI();
    }
  });

  // Audio toggle
  $("#toggleAudioBtn").addEventListener("click", toggleAudio);

  // Reduce motion toggle
  $("#reduceMotion").addEventListener("change", (e) => {
    state.reduceMotion = e.target.checked;
    document.documentElement.classList.toggle("reduce-motion", state.reduceMotion);
    setBreathPulse(false);
  });

  // Session controls
  $("#sessionStart").addEventListener("click", () => {
    if (!state.emotion) return;
    showStep(0);
    $("#sessionStart").disabled = true;
    $("#sessionNext").disabled = false;
  });

  $("#sessionNext").addEventListener("click", () => {
    const next = Math.min(state.stepIndex + 1, steps.length - 1);
    showStep(next);
  });

  $("#sessionReset").addEventListener("click", resetSessionUI);

  $("#releaseBtn").addEventListener("click", completeRelease);

  // Keep reflect emotion synced when changed
  $("#emotionSelect").addEventListener("change", (e) => {
    state.emotion = e.target.value;
    $("#emotionBadge").textContent = state.emotion ? `Emotion: ${state.emotion}` : "Emotion: —";
  });

  initReflection();
}

function init() {
  setYear();
  routeTo("home");
  resetSessionUI();
  wireUI();
}

init();
