(function ($) {
  "use strict";

  var $form = $("#contact-form");
  var $messages = $("#form-messages");

  if (!$form.length) return;

  $form.on("submit", function (e) {
    e.preventDefault();

    var $button = $form.find('button[type="submit"]');
    $button.prop("disabled", true);
    $messages.text("");

    $.ajax({
      url: "assets/mail/contact-form.php",
      type: "POST",
      dataType: "json",
      data: $form.serialize(),
    })
      .done(function (response) {
        $messages
          .text(response.message)
          .css("color", response.status === "success" ? "green" : "red");
        if (response.status === "success") {
          $form[0].reset();
        }
      })
      .fail(function () {
        $messages
          .text("Something went wrong sending your message. Please try again later.")
          .css("color", "red");
      })
      .always(function () {
        $button.prop("disabled", false);
      });
  });
})(jQuery);
