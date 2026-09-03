<?php
header('Content-Type: application/json; charset=utf-8');

/**
 * FIXME: set the real destination inbox before going live.
 */
$recipient = 'your-email@yourdomain.com';

$subjects = [
  '1' => 'Desarrollo Web',
  '2' => 'Tiendas Online',
  '3' => 'SEO Técnico',
  '4' => 'Campañas de Ads',
  '5' => 'Automatización de Leads',
  '6' => 'Cierre de Ventas Automatizado',
];

function clean_field($value) {
  $value = trim($value ?? '');
  // Strip line breaks so a field can never inject extra mail headers.
  $value = str_replace(["\r", "\n"], '', $value);
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

// The homepage's mini contact form uses a "2"-suffixed field naming
// convention; accept either so both forms share this one handler.
function field($primary, $fallback) {
  return $_POST[$primary] ?? $_POST[$fallback] ?? '';
}

$name = clean_field(field('cfName', 'cfName2'));
$email = trim(field('cfEmail', 'cfEmail2'));
$phone = clean_field(field('cfPhone', 'cfPhone2'));
$subject = $subjects[field('cfSubject', 'cfSubject2')] ?? 'Consulta General';
$message = clean_field(field('cfMessage', 'cfMessage2'));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Completá todos los campos obligatorios con un email válido.']);
  exit;
}

$emailSubject = "Nuevo mensaje del sitio web: $subject";

$body = "Tenés un nuevo mensaje desde el formulario de contacto del sitio\n";
$body .= "=====================================================\n\n";
$body .= "Nombre: $name\n";
$body .= "Email: $email\n";
$body .= "Teléfono: $phone\n";
$body .= "Servicio de interés: $subject\n\n";
$body .= "Mensaje:\n$message\n";

// The From header stays on our own domain; the visitor's email only goes in
// Reply-To, so a malicious value can't be used to spoof or inject headers.
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$headers = "From: no-reply@$host\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

if (mail($recipient, $emailSubject, $body, $headers)) {
  echo json_encode(['status' => 'success', 'message' => '¡Gracias! Tu mensaje fue enviado.']);
} else {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Hubo un problema al enviar tu mensaje. Probá de nuevo más tarde.']);
}
