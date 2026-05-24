/* global window, document, fetch */
(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function currentPage() {
    var p = (window.location.pathname || "").split("/").pop();
    return p || "index.html";
  }

  function linkList(items, activeHref) {
    return items
      .map(function (l) {
        var active = l.href === activeHref ? " active" : "";
        return (
          '<li class="nav-item">' +
          '<a class="nav-link' +
          active +
          '" href="' +
          escapeHtml(l.href) +
          '">' +
          escapeHtml(l.label) +
          "</a>" +
          "</li>"
        );
      })
      .join("");
  }

  function renderNav(data) {
    var host = document.getElementById("site-nav");
    if (!host) return;

    var active = currentPage();
    host.innerHTML =
      '<nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow">' +
      '<div class="container">' +
      '<a class="navbar-brand fw-bold" href="index.html">' +
      '<img src="' +
      escapeHtml(data.brand.logo) +
      '" width="50" height="50" class="rounded-circle" alt="' +
      escapeHtml(data.brand.name) +
      ' logo">' +
      " " +
      escapeHtml(data.brand.name) +
      "</a>" +
      '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">' +
      '<span class="navbar-toggler-icon"></span>' +
      "</button>" +
      '<div class="collapse navbar-collapse" id="navbarNav">' +
      '<ul class="navbar-nav ms-auto">' +
      linkList(data.nav, active) +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</nav>";
  }

  function renderFooter(data) {
    var host = document.getElementById("site-footer");
    if (!host) return;

    var year = new Date().getFullYear();
    var addr = (data.contact.addressLines || []).map(escapeHtml).join("<br>");
    var email = data.contact.email ? String(data.contact.email).trim() : "";
    var quickLinks = (data.footer.quickLinks || [])
      .map(function (l) {
        return (
          '<li><a href="' +
          escapeHtml(l.href) +
          '" class="text-decoration-none">' +
          escapeHtml(l.label) +
          "</a></li>"
        );
      })
      .join("");

    host.innerHTML =
      '<footer class="pt-5 pb-3">' +
      '<div class="container">' +
      '<div class="row">' +
      '<div class="col-md-4">' +
      "<h4>" +
      escapeHtml(data.brand.name) +
      "</h4>" +
      "<p>" +
      escapeHtml(data.footer.aboutText || "") +
      "</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<h4>Quick Links</h4>" +
      '<ul class="list-unstyled">' +
      quickLinks +
      "</ul>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<h4>Contact Info</h4>" +
      '<p><i class="bi bi-geo-alt-fill"></i> ' +
      addr +
      "</p>" +
      '<p><i class="bi bi-telephone-fill"></i> <a href="tel:' +
      escapeHtml(data.contact.phoneE164 || "") +
      '" class="text-decoration-none">' +
      escapeHtml(data.contact.phoneDisplay || "") +
      "</a></p>" +
      (email
        ? '<p><i class="bi bi-envelope-fill"></i> <a href="mailto:' +
          escapeHtml(email) +
          '" class="text-decoration-none">' +
          escapeHtml(email) +
          "</a></p>"
        : "") +
      '<p><i class="bi bi-clock-fill"></i> ' +
      escapeHtml((data.contact.hours && data.contact.hours[0] && data.contact.hours[0].label) || "Mon-Sat") +
      ": " +
      escapeHtml((data.contact.hours && data.contact.hours[0] && data.contact.hours[0].value) || "") +
      "</p>" +
      "</div>" +
      "</div>" +
      "<hr>" +
      '<div class="text-center">' +
      '<p class="mb-0">&copy; ' +
      year +
      " " +
      escapeHtml(data.brand.name) +
      ". All Rights Reserved.</p>" +
      "</div>" +
      "</div>" +
      "</footer>";
  }

  function renderServicesTable(data) {
    var tbody = document.getElementById("services-table-body");
    if (!tbody) return;

    tbody.innerHTML = (data.services || [])
      .map(function (s, idx) {
        return (
          "<tr>" +
          "<td>" +
          (idx + 1) +
          "</td>" +
          "<td>" +
          escapeHtml(s.name) +
          "</td>" +
          "<td>&#8377;" +
          escapeHtml(s.priceInr) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function renderHighlights(data) {
    var host = document.getElementById("service-highlights");
    if (!host) return;

    var limit = host.dataset && host.dataset.limit ? Number(host.dataset.limit) : null;
    var items = data.serviceHighlights || [];
    if (limit && Number.isFinite(limit)) items = items.slice(0, limit);

    host.innerHTML = items
      .map(function (h) {
        return (
          '<div class="col-md-4">' +
          '<div class="service-card p-4 text-center">' +
          "<h4>" +
          escapeHtml(h.title) +
          "</h4>" +
          "<p>" +
          escapeHtml(h.description) +
          "</p>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderGallery(data) {
    var host = document.getElementById("gallery-grid");
    if (!host) return;

    var limit = host.dataset && host.dataset.limit ? Number(host.dataset.limit) : null;
    var showTitles = !(host.dataset && host.dataset.titles === "0");
    var items = data.gallery || [];
    if (limit && Number.isFinite(limit)) items = items.slice(0, limit);

    host.innerHTML = items
      .map(function (g) {
        var titleHtml = showTitles
          ? '<h5 class="mt-2">' + escapeHtml(g.title) + "</h5>"
          : "";
        return (
          '<div class="col-md-4">' +
          '<div class="gallery">' +
          '<img src="' +
          escapeHtml(g.image) +
          '" class="img-fluid rounded" alt="' +
          escapeHtml(g.title) +
          '">' +
          titleHtml +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderContactInfo(data) {
    var host = document.getElementById("contact-info");
    if (!host) return;

    var addr = (data.contact.addressLines || []).map(escapeHtml).join("<br>");
    var email = data.contact.email ? String(data.contact.email).trim() : "";
    host.innerHTML =
      "<h3>Visit Us</h3>" +
      '<p><i class="bi bi-geo-alt-fill"></i> ' +
      addr +
      "</p>" +
      '<p><i class="bi bi-telephone-fill"></i> <a href="tel:' +
      escapeHtml(data.contact.phoneE164 || "") +
      '" class="text-decoration-none">' +
      escapeHtml(data.contact.phoneDisplay || "") +
      "</a></p>" +
      (email
        ? '<p><i class="bi bi-envelope-fill"></i> <a href="mailto:' +
          escapeHtml(email) +
          '" class="text-decoration-none">' +
          escapeHtml(email) +
          "</a></p>"
        : "") +
      '<p><i class="bi bi-clock-fill"></i> ' +
      escapeHtml((data.contact.hours && data.contact.hours[0] && data.contact.hours[0].label) || "Mon-Sat") +
      ": " +
      escapeHtml((data.contact.hours && data.contact.hours[0] && data.contact.hours[0].value) || "") +
      "</p>" +
      '<div class="mt-3">' +
      '<iframe src="' +
      escapeHtml(data.contact.mapEmbedUrl || "") +
      '" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
      "</div>";
  }

  function showLocalFileWarningIfNeeded() {
    // If opened via file://, fetching JSON is blocked in many browsers.
    if (window.location.protocol === "file:") {
      var host = document.getElementById("site-data-warning");
      if (host) host.style.display = "block";
    }
  }

  function loadJson(path) {
    return fetch(path, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("Failed to load " + path + " (" + r.status + ")");
      return r.json();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    showLocalFileWarningIfNeeded();

    loadJson("assets/data/site.json")
      .then(function (data) {
        renderNav(data);
        renderFooter(data);
        renderServicesTable(data);
        renderHighlights(data);
        renderGallery(data);
        renderContactInfo(data);
      })
      .catch(function (err) {
        // Keep the page usable even if JSON can't be loaded.
        // eslint-disable-next-line no-console
        console.warn(err);
      });
  });
})();
