<?php
header('Content-Type: application/json; charset=utf-8');

/**
 * FIXME: set the real destination inbox before going live.
 */
$recipient = 'your-email@yourdomain.com';

$subjects = [
  '1' => 'Managed IT Services',
  '2' => 'Cloud Computing',
  '3' => 'Cybersecurity Solutions',
  '4' => 'IT Consulting & Strategy',
  '5' => 'Software Development',
  '6' => 'Network Infrastructure',
];

function clean_field($value) {
  $value = trim($value ?? '');
  // Strip line breaks so a field can never inject extra mail headers.
  $value = str_replace(["\r", "\n"], '', $value);
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$name = clean_field($_POST['cfName'] ?? '');
$email = trim($_POST['cfEmail'] ?? '');
$phone = clean_field($_POST['cfPhone'] ?? '');
$subject = $subjects[$_POST['cfSubject'] ?? ''] ?? 'General Inquiry';
$message = clean_field($_POST['cfMessage'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields with a valid email address.']);
  exit;
}

$emailSubject = "New contact form message: $subject";

$body = "You have a new message from the website contact form\n";
$body .= "=====================================================\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Phone: $phone\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$message\n";

// The From header stays on our own domain; the visitor's email only goes in
// Reply-To, so a malicious value can't be used to spoof or inject headers.
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$headers = "From: no-reply@$host\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

if (mail($recipient, $emailSubject, $body, $headers)) {
  echo json_encode(['status' => 'success', 'message' => 'Thanks! Your message has been sent.']);
} else {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Something went wrong sending your message. Please try again later.']);
}
