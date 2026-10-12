/* ==========================================================
   IEM EVENTS — COLLEGE EVENT MANAGEMENT
   Features:
   1. Dynamic event rendering
   2. Category filtering
   3. Live countdown to the next event
   4. Digital clock (India Standard Time)
   5. Dark/light mode with localStorage
   6. Registration form validation
   7. Feedback form validation
   8. Mobile navigation
   9. Active navigation highlighting
   ========================================================== */

"use strict";

/* ---------- 1. EVENT DATA ---------- */

const EVENTS = [
  {
    id: "hackiem",
    name: "HackIEM 2026",
    date: "2026-10-26T09:00:00+05:30",
    venue: "AIML Lab, Gurukul Campus",
    category: "technical",
    description:
      "A 24-hour hackathon focused on applied machine learning, innovation, teamwork and real-world problem solving."
  },
  {
    id: "dl-workshop",
    name: "Hands-on Deep Learning with PyTorch",
    date: "2026-11-03T10:00:00+05:30",
    venue: "Lab 4, Ashram Building",
    category: "workshop",
    description:
      "Explore tensors, neural networks, CNNs and practical deep learning through guided coding sessions."
  },
  {
    id: "guest-lecture",
    name: "AI for Indian Languages",
    date: "2026-11-10T14:30:00+05:30",
    venue: "Seminar Hall",
    category: "lecture",
    description:
      "Discover how artificial intelligence and large language models can support Indian languages and local communities."
  },
  {
    id: "cultural-night",
    name: "Sharod Sandhya",
    date: "2026-11-16T17:00:00+05:30",
    venue: "Main Auditorium",
    category: "cultural",
    description:
      "Enjoy an evening of music, dance, drama and creative performances by talented students."
  },
  {
    id: "robotics",
    name: "Robotics Challenge",
    date: "2026-12-07T10:00:00+05:30",
    venue: "IoT Laboratory",
    category: "technical",
    description:
      "Build, test and showcase autonomous robots in a fun competition focused on speed and accuracy."
  },
  {
    id: "innovacion",
    name: "Innovacion 2026",
    date: "2026-12-20T09:00:00+05:30",
    venue: "Gurukul Campus",
    category: "technical",
    description:
      "A technology festival featuring coding competitions, project exhibitions, presentations and gaming."
  }
];

const CATEGORY_LABELS = {
  technical: "Technical",
  workshop: "Workshop",
  cultural: "Cultural",
  lecture: "Lecture"
};

/* ---------- 2. HELPER FUNCTIONS ---------- */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const pad = number => String(number).padStart(2, "0");

function formatDateParts(dateString) {
  const date = new Date(dateString);

  return {
    day: date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit"
    }),

    month: date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "short"
    }),

    full: date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }),

    time: date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  };
}

/* ---------- 3. EVENT RENDERING ---------- */

const eventList = $("#eventList");
const eventEmpty = $("#eventEmpty");
const eventSelect = $("#eventSelect");

function renderEvents() {
  if (!eventList) return;

  const sortedEvents = [...EVENTS].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  eventList.innerHTML = sortedEvents.map(event => {
    const date = formatDateParts(event.date);
    const category =
      CATEGORY_LABELS[event.category] || event.category;

    return `
      <li class="event" data-category="${event.category}">
        <div class="event-date">
          <span class="day">${date.day}</span>
          <span class="month">${date.month}</span>
        </div>

        <div class="event-body">
          <h3>${event.name}</h3>

          <p class="event-venue">
            ${date.full} · ${date.time}<br>
            📍 ${event.venue}
          </p>

          <p class="event-desc">${event.description}</p>

          <button
            type="button"
            class="small-btn register-event"
            data-event="${event.id}">
            Register →
          </button>
        </div>

        <span class="event-tag">${category}</span>
      </li>
    `;
  }).join("");

  if (eventSelect) {
    const previousValue = eventSelect.value;

    eventSelect.innerHTML = `
      <option value="">Choose an event</option>
      ${sortedEvents.map(event => `
        <option value="${event.id}">
          ${event.name} (${formatDateParts(event.date).day}
          ${formatDateParts(event.date).month})
        </option>
      `).join("")}
    `;

    if (sortedEvents.some(event => event.id === previousValue)) {
      eventSelect.value = previousValue;
    }
  }
}

/* ---------- 4. EVENT FILTERS ---------- */

function filterEvents(category) {
  let visibleCount = 0;

  $$(".event").forEach(event => {
    const visible =
      category === "all" ||
      event.dataset.category === category;

    event.classList.toggle("is-hidden", !visible);

    if (visible) visibleCount++;
  });

  if (eventEmpty) {
    eventEmpty.hidden = visibleCount !== 0;
  }
}

const eventFilters = $("#eventFilters");

if (eventFilters) {
  eventFilters.addEventListener("click", event => {
    const button = event.target.closest(".chip");

    if (!button) return;

    $$(".chip", eventFilters).forEach(chip => {
      chip.classList.remove("is-active");
      chip.setAttribute("aria-pressed", "false");
    });

    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");

    filterEvents(button.dataset.filter || "all");
  });
}

/* Support the category buttons in your original HTML too. */

const originalFilters = $$(".filter");

originalFilters.forEach(button => {
  button.addEventListener("click", () => {
    originalFilters.forEach(filter => {
      filter.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category || "all";

    $$(".event-card").forEach(card => {
      const visible =
        category === "all" ||
        card.dataset.category === category;

      card.classList.toggle("is-hidden", !visible);
    });
  });
});

renderEvents();

/* ---------- 5. REGISTRATION SHORTCUT ---------- */

document.addEventListener("click", event => {
  const button = event.target.closest(".register-event");

  if (!button) return;

  const selectedEvent = button.dataset.event;
  const form = $("#regForm") || $("#registrationForm");
  const select = $("#eventSelect");

  if (select && selectedEvent) {
    const matchingOption = [...select.options].find(option =>
      option.value === selectedEvent ||
      option.textContent.trim() === selectedEvent ||
      option.textContent.trim().startsWith(selectedEvent)
    );

    if (matchingOption) {
      select.value = matchingOption.value;
    }
  }

  const registrationSection =
    $("#registration") || form;

  if (registrationSection) {
    registrationSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  setTimeout(() => {
    const nameField = $("#studentName");

    if (nameField) nameField.focus({ preventScroll: true });
  }, 400);
});

/* ---------- 6. COUNTDOWN ---------- */

const countdown = {
  title: $("#cdTitle"),
  meta: $("#cdMeta"),
  days: $("#cdDays"),
  hours: $("#cdHours"),
  mins: $("#cdMins"),
  secs: $("#cdSecs")
};

function getNextEvent() {
  const now = Date.now();

  return EVENTS
    .filter(event => new Date(event.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
}

function updateCountdown() {
  if (
    !countdown.title ||
    !countdown.days ||
    !countdown.hours ||
    !countdown.mins ||
    !countdown.secs
  ) {
    return;
  }

  const nextEvent = getNextEvent();

  if (!nextEvent) {
    countdown.title.textContent = "No upcoming events";
    if (countdown.meta) {
      countdown.meta.textContent = "Check back for future events.";
    }

    countdown.days.textContent = "00";
    countdown.hours.textContent = "00";
    countdown.mins.textContent = "00";
    countdown.secs.textContent = "00";
    return;
  }

  const date = formatDateParts(nextEvent.date);

  countdown.title.textContent = nextEvent.name;

  if (countdown.meta) {
    countdown.meta.textContent =
      `${date.full} · ${date.time} · ${nextEvent.venue}`;
  }

  let difference = Math.max(
    0,
    new Date(nextEvent.date).getTime() - Date.now()
  );

  const days = Math.floor(difference / 86400000);
  difference %= 86400000;

  const hours = Math.floor(difference / 3600000);
  difference %= 3600000;

  const minutes = Math.floor(difference / 60000);
  difference %= 60000;

  const seconds = Math.floor(difference / 1000);

  countdown.days.textContent = pad(days);
  countdown.hours.textContent = pad(hours);
  countdown.mins.textContent = pad(minutes);
  countdown.secs.textContent = pad(seconds);
}

/* ---------- 7. DIGITAL CLOCK: INDIA ---------- */

const clock = $("#clock") || $("#digitalClock");

function updateClock() {
  if (!clock) return;

  clock.textContent = new Date().toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

updateCountdown();
updateClock();

setInterval(() => {
  updateCountdown();
  updateClock();
}, 1000);

/* ---------- 8. DARK / LIGHT MODE ---------- */

const themeToggle = $("#themeToggle") || $("#themeBtn");

function applyTheme(mode) {
  const dark = mode === "dark";

  document.body.classList.toggle("dark", dark);

  if (themeToggle) {
    const icon = $(".theme-icon", themeToggle);

    if (icon) {
      icon.textContent = dark ? "☀" : "☾";
    } else {
      themeToggle.textContent = dark ? "☀️" : "🌙";
    }

    themeToggle.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.setAttribute("aria-pressed", String(dark));
  }

  try {
    localStorage.setItem("iem-theme", mode);
  } catch (error) {
    // The theme still works if browser storage is unavailable.
  }
}

(function initializeTheme() {
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("iem-theme");
  } catch (error) {
    // Continue with the default theme.
  }

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyTheme(prefersDark ? "dark" : "light");
  }
})();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentlyDark =
      document.body.classList.contains("dark");

    applyTheme(currentlyDark ? "light" : "dark");
  });
}

/* ---------- 9. FORM VALIDATION HELPERS ---------- */

const RULES = {
  name: {
    re: /^[A-Za-z][A-Za-z .'-]{1,59}$/,
    msg: "Enter a valid full name."
  },

  roll: {
    re: /^\d{10}$/,
    msg: "Roll number must contain exactly 10 digits."
  },

  email: {
    re: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
    msg: "Enter a valid email address."
  },

  phone: {
    re: /^[6-9]\d{9}$/,
    msg: "Enter a valid 10-digit Indian mobile number."
  }
};

function setError(id, message) {
  const field = document.getElementById(id);
  const errorElement =
    document.getElementById("err-" + id) ||
    document.getElementById(id + "Error");

  if (field) {
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  if (errorElement) {
    errorElement.textContent = message || "";
  }

  return !message;
}

function validateText(id, rule) {
  const field = document.getElementById(id);

  if (!field) return true;

  const value = field.value.trim();

  if (!value) {
    return setError(id, "This field is required.");
  }

  if (rule && !rule.re.test(value)) {
    return setError(id, rule.msg);
  }

  return setError(id, "");
}

function validateSelect(id, message) {
  const field = document.getElementById(id);

  if (!field) return true;

  return setError(id, field.value ? "" : message);
}

function showStatus(element, message, success) {
  if (!element) return;

  element.className = success
    ? "form-status ok form-message success"
    : "form-status bad form-message";

  element.textContent = message;
}

/* ---------- 10. REGISTRATION FORM ---------- */

const regForm = $("#regForm") || $("#registrationForm");
const regStatus = $("#regStatus") || $("#formMessage");

if (regForm) {
  regForm.addEventListener("submit", event => {
    event.preventDefault();

    const checks = [
      validateText("studentName", RULES.name),
      validateText("rollNo", RULES.roll),
      validateSelect("department", "Select your department."),
      validateText("email", RULES.email),
      validateText("phone", RULES.phone)
    ];

    const gender = $(
      'input[name="gender"]:checked',
      regForm
    );

    checks.push(
      setError("gender", gender ? "" : "Select your gender.")
    );

    checks.push(
      validateSelect(
        "eventSelect",
        "Select the event you want to attend."
      )
    );

    if (checks.every(Boolean)) {
      const name = $("#studentName").value.trim();
      const select = $("#eventSelect");
      const eventName =
        select.options[select.selectedIndex].textContent.trim();

      showStatus(
        regStatus,
        `Thank you, ${name}! Your registration for ${eventName} has been recorded in this page.`,
        true
      );

      regForm.reset();

      $$(".is-invalid", regForm).forEach(field => {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
      });
    } else {
      showStatus(
        regStatus,
        "Please correct the highlighted fields and try again.",
        false
      );

      const firstInvalid = $(".is-invalid", regForm);

      if (firstInvalid) firstInvalid.focus();
    }
  });

  regForm.addEventListener("input", event => {
    const id = event.target.id;

    const ruleMap = {
      studentName: RULES.name,
      rollNo: RULES.roll,
      email: RULES.email,
      phone: RULES.phone
    };

    if (!id || !event.target.classList.contains("is-invalid")) {
      return;
    }

    if (ruleMap[id]) {
      validateText(id, ruleMap[id]);
    } else if (event.target.tagName === "SELECT") {
      validateSelect(id, "This field is required.");
    }
  });

  regForm.addEventListener("change", event => {
    if (event.target.name === "gender") {
      setError("gender", "");
    }
  });
}

/* ---------- 11. FEEDBACK FORM ---------- */

const feedbackForm = $("#feedbackForm");
const feedbackStatus = $("#fbStatus") || $("#feedbackMessage");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", event => {
    event.preventDefault();

    const nameField = $("#fbName") || $("#feedbackName");
    const emailField = $("#fbEmail") || $("#feedbackEmail");
    const messageField = $("#fbMessage") || $("#feedback");

    const checks = [];

    if (nameField) {
      checks.push(validateText(nameField.id, RULES.name));
    }

    if (emailField) {
      checks.push(validateText(emailField.id, RULES.email));
    }

    if (messageField) {
      const message = messageField.value.trim();

      if (!message) {
        checks.push(
          setError(messageField.id, "Please enter your feedback.")
        );
      } else if (message.length < 15) {
        checks.push(
          setError(
            messageField.id,
            "Your message must contain at least 15 characters."
          )
        );
      } else {
        checks.push(setError(messageField.id, ""));
      }
    }

    if (checks.every(Boolean)) {
      showStatus(
        feedbackStatus,
        "Thank you for your feedback! It passed validation.",
        true
      );

      feedbackForm.reset();

      $$(".is-invalid", feedbackForm).forEach(field => {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
      });
    } else {
      showStatus(
        feedbackStatus,
        "Please correct the highlighted fields.",
        false
      );

      const firstInvalid = $(".is-invalid", feedbackForm);

      if (firstInvalid) firstInvalid.focus();
    }
  });
}

/* ---------- 12. MOBILE NAVIGATION ---------- */

const navToggle = $("#navToggle") || $("#menuBtn");
const siteNav = $("#siteNav") || $("#navbar");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");

    // Also support the original CSS navigation class.
    siteNav.classList.toggle("show", isOpen);

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    navToggle.textContent = isOpen ? "✕" : "☰";
  });

  $$('a[href^="#"]', siteNav).forEach(link => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open", "show");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      navToggle.textContent = "☰";
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      siteNav.classList.remove("is-open", "show");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      navToggle.textContent = "☰";
    }
  });
}

/* ---------- 13. ACTIVE NAVIGATION ---------- */

const sections = $$("main section[id]");
const navLinks = siteNav
  ? $$('a[href^="#"]', siteNav)
  : [];

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        const active =
          link.getAttribute("href") === "#" + entry.target.id;

        link.classList.toggle("is-current", active);
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  sections.forEach(section => observer.observe(section));
}

/* ---------- 14. CURRENT YEAR ---------- */

$$("[data-current-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});

console.log("IEM Events website JavaScript initialized successfully.");