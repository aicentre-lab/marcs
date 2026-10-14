/*
 * MARCS support page: contact configuration.
 *
 * This is the only file to edit before deployment. Replace BOTH values below
 * with the real, monitored support contacts.
 *
 *   SUPPORT_EMAIL  e.g. an address on your organisation's domain
 *   SUPPORT_PHONE  international format: "+", country code, then the number
 *                  (spaces, hyphens and brackets are fine; they are shown as
 *                  typed and stripped from the tel: link)
 *
 * While either value is still a placeholder or malformed, the page shows a red
 * "Not ready to publish" banner and no contact links, and
 * `python3 support-page/preflight.py` fails. Do not publish until it passes.
 */
window.MARCS_SUPPORT_CONFIG = {
  SUPPORT_EMAIL: "marcs@srhu.edu.in",
  SUPPORT_PHONE: "+91 9897729772",
};
