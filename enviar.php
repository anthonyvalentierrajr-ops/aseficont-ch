<?php
/**
 * ===========================================================
 * ASEFICONT CH — Procesador del formulario de contacto
 * ===========================================================
 * Este archivo recibe los datos del formulario de la página
 * principal (index.html) y envía un correo electrónico con
 * la solicitud del cliente.
 *
 * IMPORTANTE: Sube este archivo en la MISMA carpeta donde están
 * index.html, style.css, script.js, etc. (la raíz pública del
 * dominio, normalmente public_html).
 * ===========================================================
 */

// ---------------------------------------------------------
// CONFIGURACIÓN — AJUSTA SOLO ESTA SECCIÓN
// ---------------------------------------------------------
$correoDestino   = "contacto@aseficontch.com";   // A dónde llegan las solicitudes
$correoRemitente = "contacto@aseficontch.com";   // Debe ser un correo de TU dominio en Hostinger
$nombreSitio     = "ASEFICONT CH";

// ---------------------------------------------------------
// Solo permitir peticiones POST (las que envía el formulario)
// ---------------------------------------------------------
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método no permitido."]);
    exit;
}

// ---------------------------------------------------------
// Protección anti-spam (honeypot) — campo oculto invisible
// para humanos pero que los bots suelen rellenar
// ---------------------------------------------------------
if (!empty($_POST["sitio_web"] ?? "")) {
    // Si el honeypot viene lleno, simulamos éxito pero no enviamos nada
    echo json_encode(["status" => "success"]);
    exit;
}

// ---------------------------------------------------------
// Recolectar y limpiar los datos del formulario
// ---------------------------------------------------------
function limpiar($valor) {
    $valor = trim($valor ?? "");
    $valor = stripslashes($valor);
    return htmlspecialchars($valor, ENT_QUOTES, "UTF-8");
}

$nombre   = limpiar($_POST["nombre"] ?? "");
$correo   = limpiar($_POST["correo"] ?? "");
$telefono = limpiar($_POST["telefono"] ?? "");
$empresa  = limpiar($_POST["empresa"] ?? "");
$mensaje  = limpiar($_POST["mensaje"] ?? "");

// ---------------------------------------------------------
// Validaciones básicas del lado del servidor
// ---------------------------------------------------------
$errores = [];

if (strlen($nombre) < 2) {
    $errores[] = "El nombre es obligatorio.";
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El correo electrónico no es válido.";
}
if (strlen($telefono) < 7) {
    $errores[] = "El teléfono es obligatorio.";
}
if (strlen($mensaje) < 5) {
    $errores[] = "El mensaje es obligatorio.";
}

if (!empty($errores)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => implode(" ", $errores)]);
    exit;
}

// ---------------------------------------------------------
// Construir el correo
// ---------------------------------------------------------
$asunto = "Nueva solicitud de evaluación — $nombreSitio";

$cuerpoHtml = "
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
    <div style='max-width: 600px; margin: 0 auto; padding: 30px; background: #f4f6f9;'>
        <div style='background: #0a192f; padding: 20px 30px; border-radius: 10px 10px 0 0;'>
            <h2 style='color: #ffffff; margin: 0;'>Nueva Solicitud — $nombreSitio</h2>
        </div>
        <div style='background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;'>
            <p><strong>Nombre completo:</strong> $nombre</p>
            <p><strong>Correo electrónico:</strong> $correo</p>
            <p><strong>Teléfono / WhatsApp:</strong> $telefono</p>
            <p><strong>Empresa:</strong> " . (!empty($empresa) ? $empresa : "No especificada") . "</p>
            <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
            <p><strong>Mensaje:</strong></p>
            <p style='background: #f4f6f9; padding: 15px; border-radius: 8px;'>$mensaje</p>
        </div>
        <p style='text-align: center; color: #999; font-size: 12px; margin-top: 20px;'>
            Este correo fue generado automáticamente desde el formulario de contacto de tu sitio web.
        </p>
    </div>
</body>
</html>
";

// ---------------------------------------------------------
// Encabezados del correo (HTML + remitente correcto)
// ---------------------------------------------------------
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: $nombreSitio <$correoRemitente>" . "\r\n";
$headers .= "Reply-To: $correo" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ---------------------------------------------------------
// Enviar el correo
// ---------------------------------------------------------
$enviado = mail($correoDestino, $asunto, $cuerpoHtml, $headers);

header("Content-Type: application/json");

if ($enviado) {
    echo json_encode([
        "status"  => "success",
        "message" => "Tu solicitud fue enviada correctamente. Te contactaremos pronto."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "No se pudo enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp."
    ]);
}