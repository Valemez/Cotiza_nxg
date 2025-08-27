<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('../vendor/autoload.php');
header('Content-Type: application/json');
$response = ['success' => false, 'message' => 'success'];

function sendEmailPDF($email, $path_file)
{
    #code

    $mail = new PHPMailer(true);

    try {
        // Configurar SMTP
       $mail->isSMTP();
       $mail->Host       = 'mail.crsseguridad.com.mx'; //mail.prosman.com.mx
       $mail->SMTPAuth   = true;
       $mail->Username   = 'noreply@crsseguridad.com.mx'; //noreaply@prosman.com.mx
       $mail->Password   = 'Iufkk6%qMs{M'; // noreaply_prosman=2025
       $mail->SMTPSecure = 'ssl'; // Seguridad
       $mail->Port       = 465;


        // Remitente y destinatario
       $mail->setFrom('noreply@crsseguridad.com.mx', 'CRS Seguridad'); // noreaply
       $mail->addAddress($email, 'Destinatario'); //$correo, $nombre
        // $mail->addBCC('sistemas@prosman.com.mx', 'copia seguridad'); // correo: sistemas@prosman.com.mx

        // Contenido del correo
       $mail->isHTML(true);
       $mail->Subject = 'Asunto del Correo';
      $mail->Body = '
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
            

            <div style="padding: 20px;">
                <h1 style="color: #333333; text-align: center;">Cotización CRS Seguridad Privada</h1>
                <p style="color: #555555; line-height: 1.6;">Estimado/a cliente,</p>
                <p style="color: #555555; line-height: 1.6;">Agradecemos su visita a nuestro stand durante la reciente exposición en el Centro de Exposiciones de Puebla.</p>
                <p style="color: #555555; line-height: 1.6;">Adjuntamos a este correo la cotización que solicitó. Para ver los detalles completos, por favor, abra el archivo adjunto.</p>
                

                <p style="color: #555555; line-height: 1.6; margin-top: 30px;">Quedamos a su disposición para cualquier aclaración o consulta que necesite.</p>
                <br>
                <p>Correo: info@crsseguridad.com.mx</p>
                <p>Telefono: 55 8569 3741</p>
                <p style="color: #555555; line-height: 1.6;">Atentamente,</p>
                <p style="color: #555555; font-weight: bold;">El equipo de CRS Seguridad Privada</p>
            </div>

            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e0e0e0;">
                <p>&copy; 2025 CRS Seguridad Privada. Todos los derechos reservados.</p>
            </div>
        </div>
    </div>';

    $mail->AltBody = 'Estimado/a cliente, aquí está su cotización digital para el evento en el Centro de Exposiciones de Puebla. Por favor, abra el archivo adjunto para ver los detalles. Atentamente, El equipo de [Nombre de tu empresa].';
        //mandar pdf
        $mail->addAttachment($path_file);
        // falta generar pero para los finiquitos, pienso en otro archivo igual pero para los finiquitos

        // $directorio = __DIR__ . '/contratos/' . $correo;
        // Enviar correo
        $mail->send();
        return true;
        // $response['success'] = true;
        // $response['message'] = 'Correo enviado correctamente';
    } catch (Exception $e) {
        $response['message'] = 'Error al enviar el correo' . $e->getMessage();
        // error_log("Error enviando correo: " . $mail->ErrorInfo);
        return false;
    }
};
