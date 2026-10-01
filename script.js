/* Angelo Bronosa Portfolio interactions */
"use strict";

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const currentYear = document.querySelector("#current-year");

/*
 * To enable the contact form, replace this value with an email address you use.
 * The form uses mailto:, so it opens the visitor's email app instead of storing messages.
 */
const CONTACT_EMAIL = "angelobronosa1732@gmai.com";

if (currentYear) currentYear.textContent = new Date().getFullYear();

// Theme toggle with saved preference when localStorage is available.
const savedTheme = (() => {
  try { return localStorage.getItem("angelo-portfolio-theme"); }
  catch { return null; }
})();
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme === "light" ? "light" : "";
}
function updateThemeButton() {
  const lightMode = root.dataset.theme === "light";
  themeToggle?.setAttribute("aria-label", lightMode ? "Switch to dark theme" : "Switch to light theme");
  themeToggle?.setAttribute("title", lightMode ? "Switch to dark theme" : "Switch to light theme");
}
updateThemeButton();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  if (nextTheme === "light") root.dataset.theme = "light";
  else root.removeAttribute("data-theme");
  try { localStorage.setItem("angelo-portfolio-theme", nextTheme); } catch { /* Preference saving is optional. */ }
  updateThemeButton();
});

// Mobile navigation.
menuToggle?.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  });
});

// Highlight the navigation item for the section currently in view.
const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Contact form: prepare a message in the visitor's email client.
// No message is uploaded or saved by this static website.
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    formNote.textContent = "Please complete all fields before preparing your message.";
    return;
  }
  if (CONTACT_EMAIL === "angelobronosa1732@gmai.com") {
    formNote.textContent = "The form is ready, but the site owner needs to add a real email address in script.js before it can open a message.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
  formNote.textContent = "Opening your email app with the message details…";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
