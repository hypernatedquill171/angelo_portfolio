/* Angelo Bronosa Portfolio interactions */

"use strict";

// ========================================
// ANGELO BRONOSA — PORTFOLIO JAVASCRIPT
// ========================================

// Main elements
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const currentYear = document.querySelector("#current-year");

// ========================================
// CONTACT EMAIL
// ========================================

// IMPORTANT:
// Verify that this is your real, working email address.
// Correct the spelling if necessary before publishing.
const CONTACT_EMAIL = "angelobronosa1732@gmail.com";

// Update the copyright year automatically.
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ========================================
// DARK / LIGHT THEME
// ========================================

function getSavedTheme() {
  try {
    return localStorage.getItem("angelo-portfolio-theme");
  } catch {
    return null;
  }
}

const savedTheme = getSavedTheme();

if (savedTheme === "light") {
  root.dataset.theme = "light";
} else {
  root.removeAttribute("data-theme");
}

function updateThemeButton() {
  if (!themeToggle) return;

  const lightMode = root.dataset.theme === "light";

  themeToggle.setAttribute(
    "aria-label",
    lightMode ? "Switch to dark theme" : "Switch to light theme"
  );

  themeToggle.setAttribute(
    "title",
    lightMode ? "Switch to dark theme" : "Switch to light theme"
  );
}

function saveTheme(theme) {
  try {
    localStorage.setItem("angelo-portfolio-theme", theme);
  } catch {
    // Theme saving is optional.
  }
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  const lightMode = root.dataset.theme !== "light";

  if (lightMode) {
    root.dataset.theme = "light";
    saveTheme("light");
  } else {
    root.removeAttribute("data-theme");
    saveTheme("dark");
  }

  updateThemeButton();
});

// ========================================
// MOBILE NAVIGATION
// ========================================

menuToggle?.addEventListener("click", () => {
  if (!primaryNav) return;

  const isOpen = primaryNav.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav?.classList.remove("is-open");

    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

// ========================================
// ACTIVE NAVIGATION SECTION
// ========================================

const sections = [
  ...document.querySelectorAll("main section[id]")
];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// ========================================
// CONTACT FORM
// ========================================

// This form opens the visitor's email application.
// It does not send or store messages directly.

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm) return;

  const data = new FormData(contactForm);

  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  // Check that all fields are completed.
  if (!name || !email || !message) {
    if (formNote) {
      formNote.textContent =
        "Please complete all fields before preparing your message.";
    }

    return;
  }

  // Check the visitor's email format.
  const visitorEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!visitorEmailPattern.test(email)) {
    if (formNote) {
      formNote.textContent =
        "Please enter a valid email address so you can receive a reply.";
    }

    return;
  }

  // Check the portfolio owner's email configuration.
  const ownerEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !CONTACT_EMAIL ||
    CONTACT_EMAIL === "ADD_YOUR_EMAIL@example.com" ||
    !ownerEmailPattern.test(CONTACT_EMAIL)
  ) {
    if (formNote) {
      formNote.textContent =
        "The site owner needs to add a valid email address in script.js.";
    }

    return;
  }

  // Prepare the email.
  const subject = encodeURIComponent(
    `Portfolio contact from ${name}`
  );

  const body = encodeURIComponent(
    `${message}\n\nFrom: ${name}\nReply to: ${email}`
  );

  const mailtoLink =
    `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  if (formNote) {
    formNote.textContent =
      "Opening your email application. Please send the prepared message there.";
  }

  // Open the visitor's default email application.
  window.location.href = mailtoLink;
});
