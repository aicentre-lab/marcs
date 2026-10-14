/*
 * MARCS support page behaviour.
 *
 * Renders the email and phone links from config.js, and refuses to look
 * finished while either contact is still a placeholder: the page then shows
 * the "Not ready to publish" banner instead of contact links.
 * No analytics, storage, cookies or network requests.
 */
(function () {
  "use strict";

  var config = window.MARCS_SUPPORT_CONFIG || {};

  // Kept in step with preflight.py, which applies the same rules offline.
  var EMAIL_PATTERN = /^[^\s@<>"?&,;:\/\\]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;
  var RESERVED_DOMAIN = /@(.+\.)?(example\.(com|net|org)|example|test|invalid|localhost)$/i;

  var MAIL_SUBJECT = "MARCS support request";
  var MAIL_BODY = [
    "Role (student or teacher):",
    "What happened:",
    "Approximate date and time:",
    "iPhone model and iOS version:",
    "MARCS app version (optional):",
    "",
    "Please do not include passwords, one-time codes or photos of your face.",
  ].join("\n");

  function clean(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function isPlaceholder(value) {
    return value === "" || /REPLACE_WITH/i.test(value);
  }

  function isValidEmail(value) {
    return !isPlaceholder(value) && EMAIL_PATTERN.test(value) && !RESERVED_DOMAIN.test(value);
  }

  // The tel: form of a phone number ("+" and digits only), or "" if unusable.
  function telNumber(value) {
    if (isPlaceholder(value) || !/^\+?[\d\s().-]+$/.test(value)) return "";
    var digits = value.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) return "";
    return (value.charAt(0) === "+" ? "+" : "") + digits;
  }

  function contactLink(href, text) {
    var a = document.createElement("a");
    a.className = "contact-card__link";
    a.href = href;
    a.textContent = text;
    return a;
  }

  function missingNotice(text) {
    var span = document.createElement("span");
    span.className = "contact-card__missing";
    span.textContent = text;
    return span;
  }

  function fill(selector, node) {
    var slot = document.querySelector(selector);
    if (!slot) return;
    slot.textContent = "";
    slot.appendChild(node);
  }

  var email = clean(config.SUPPORT_EMAIL);
  var phone = clean(config.SUPPORT_PHONE);
  var emailReady = isValidEmail(email);
  var tel = telNumber(phone);

  fill(
    '[data-contact="email"]',
    emailReady
      ? contactLink(
          "mailto:" + email +
            "?subject=" + encodeURIComponent(MAIL_SUBJECT) +
            "&body=" + encodeURIComponent(MAIL_BODY),
          email
        )
      : missingNotice("Email address not configured")
  );

  fill(
    '[data-contact="phone"]',
    tel ? contactLink("tel:" + tel, phone) : missingNotice("Phone number not configured")
  );

  if (!emailReady || !tel) {
    document.documentElement.classList.add("is-unconfigured");
    var banner = document.getElementById("setup-banner");
    if (banner) banner.hidden = false;
    document.title = "[NOT CONFIGURED] " + document.title;

    var robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    if (window.console) {
      console.error("MARCS support page: set SUPPORT_EMAIL and SUPPORT_PHONE in config.js before publishing.");
    }
  }

  var year = String(new Date().getFullYear());
  Array.prototype.forEach.call(document.querySelectorAll("[data-current-year]"), function (el) {
    el.textContent = year;
  });
})();
