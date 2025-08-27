<?php

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require_once('../vendor/autoload.php');
// header('Content-Type: application/json');
// $response = ['success' => false, 'message' => 'success'];

$correo = $_POST['correo'];

echo "Correo recibido: $correo";

// traer otra funcion del archivo correo.php que se va a enviar a Marco
