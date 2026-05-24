/* global document */
(function () {
  "use strict";

  function showAlert(msg, type) {
    var alertDiv = document.getElementById("formAlert");
    if (!alertDiv) return;
    alertDiv.style.display = "block";
    alertDiv.innerHTML = '<div class="alert alert-' + type + '">' + msg + "</div>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var message = document.getElementById("message").value.trim();

      if (!name || !phone || !message) {
        showAlert("Please fill all fields", "danger");
        return;
      }

      showAlert(
        "Thank you! Your message has been received. We will contact you shortly.",
        "success"
      );
      form.reset();
    });
  });
})();

