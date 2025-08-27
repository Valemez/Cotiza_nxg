<?php

require_once('../vendor/autoload.php');
require_once('connect.php');

function generarPDF($data) {
    // Activar el reporte de errores
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    
    try {
        // Crear nueva instancia de TCPDF
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        
        // Configuración básica del PDF
        $pdf->SetCreator('CRS Seguridad Privada');
        $pdf->SetAuthor('CRS');
        $pdf->SetTitle('Cotización de Servicios');
        
        // Configurar fuente
        $pdf->SetFont('helvetica', '', 10);
        
        // Quitar márgenes y headers/footers por defecto
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(0, 0, 0);
        $pdf->SetAutoPageBreak(true, 0);

        // Obtener dimensiones de página
        $ancho = $pdf->getPageWidth();
        $alto = $pdf->getPageHeight();
     
        // Página 1: Portada
        $pdf->AddPage();
        if (file_exists('../resource/img/pag1.jpg')) {
            $pdf->Image('../resource/img/pag1.jpg', 0, 0, $ancho, $alto);
        }
        
        // Páginas 2-11: Contenido estático
        for ($i = 2; $i <= 11; $i++) {
            $pdf->AddPage();
            $imagePath = "../resource/img/pag{$i}.jpg";
            if (file_exists($imagePath)) {
                $pdf->Image($imagePath, 0, 0, $ancho, $alto);
            }

     // Pagina 4
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag4.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina4, true, false, true, false, '');

      // Pagina 5
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag5.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina5, true, false, true, false, '');

      // Pagina 6
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag6.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina6, true, false, true, false, '');

      // Pagina 7
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag7.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina7, true, false, true, false, '');

      // Pagina 8
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag8.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina8, true, false, true, false, '');

      // Pagina 9
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag9.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina9, true, false, true, false, '');

      // Pagina 10
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag10.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina10, true, false, true, false, '');

      // Pagina 11
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag11.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina11, true, false, true, false, '');

//PAGINA 12
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag12.jpg', 0, 0, $ancho, $alto);
    
    // Aquí se puede agregar el contenido de la página 12
    
    $html_pagina12 = "
    <div style='font-family:Montserrat,Arial,sans-serif; color:#001550;'>
        <div style='background:#001550; color:#fff; padding:24px 20px 16px 20px; border-radius:8px 8px 0 0;'>
            <h1 style='margin:0; font-size:2rem; letter-spacing:2px;'>Cotización de Servicios</h1>
            <p style='margin:0; font-size:1.1rem; color:#b3c6e0;'>CRS Seguridad Privada</p>
        </div>
        <div style='background:#fff; border:2px solid #001550; border-top:0; border-radius:0 0 8px 8px; padding:32px 24px 24px 24px;'>
            <h2 style='color:#001550; border-bottom:2px solid #b3c6e0; padding-bottom:8px; margin-bottom:18px;'>Información del cliente</h2>
            <table cellpadding='6' cellspacing='0' border='0' style='width:100%; font-size:14px; color:#222;'>
                <tr>
                    <td style='width:28%; font-weight:600;'>Nombre:</td>
                    <td style='width:72%;'>" . htmlspecialchars($data['Nombre']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>Empresa:</td>
                    <td>" . htmlspecialchars($data['Empresa']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>Contacto:</td>
                    <td>" . htmlspecialchars($data['Email']) . " | " . htmlspecialchars($data['Telefono']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>Dirección:</td>
                    <td>" . htmlspecialchars($data['direccion_Empresa']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>Cargo:</td>
                    <td>" . htmlspecialchars($data['Cargo_Ocupacional']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>WhatsApp:</td>
                    <td>" . htmlspecialchars($data['whatsapp']) . "</td>
                </tr>
                <tr>
                    <td style='font-weight:600;'>Descripción de la empresa:</td>
                    <td>" . nl2br(htmlspecialchars($data['descripcion_Empresa'])) . "</td>
                </tr>
            </table>
            <hr style='border:0; border-top:2px solid #3c7bd3ff; margin:28px 0 18px 0;'>
            <h2 style='color:#001550; margin-bottom:10px;'>Tipo de turno</h2>
            <p style='margin:0 0 18px 0; font-size:13px;'>" . (!empty($data['SelectTurno']) ? htmlspecialchars($data['SelectTurno']) : '-') . "</p>
            <h2 style='color:#001550; margin-bottom:10px;'>Número de guardias</h2>
            <p style='margin:0 0 18px 0; font-size:13px;'>" . (!empty($data['num_guardias']) ? htmlspecialchars($data['num_guardias']) : '-') . "</p>
            <h2 style='color:#001550; margin-bottom:10px;'>Servicios solicitados</h2>
            <ul style='margin-left:22px; margin-bottom:18px; font-size:13px; color:#001550;'>" . (
                !empty($data['servicios']) && is_array($data['servicios']) ?
                implode('', array_map(fn($s) => "<li>" . htmlspecialchars($s) . "</li>", $data['servicios'])) : "<li>-</li>"
            ) . "</ul>
            <h2 style='color:#001550; margin-bottom:10px;'>Equipamiento requerido</h2>
            <ul style='margin-left:22px; margin-bottom:18px; font-size:13px; color:#001550;'>" . (
                !empty($data['equipamiento']) && is_array($data['equipamiento']) ?
                implode('', array_map(fn($e) => "<li>" . htmlspecialchars($e) . "</li>", $data['equipamiento'])) : "<li>-</li>"
            ) . "</ul>
            <h2 style='color:#001550; margin-bottom:10px;'>Comentarios adicionales</h2>
            <p style='margin:0 0 18px 0; font-size:13px;'>" . (!empty($data['comentarios']) ? nl2br(htmlspecialchars($data['comentarios'])) : '-') . "</p>
            <div style='margin-top:30px; padding:18px; background-color:#f5f8fa; border-radius:6px; border-left:6px solid #001550;'>
                <p style='font-size:14px; color:#001550; margin-bottom:8px;'>
                    Gracias por su interés en obtener los servicios de <b>CRS Seguridad Privada</b>. La presente cotización detalla los servicios solicitados. En el apartado de <b>Equipamiento Requerido</b> (auto patrulla, camioneta con batea, motocicleta, ambulancia, celular, caninos y papelería), el costo mensual varía según lo que acuerde con uno de nuestros asesores. Cada guardia de seguridad incluye: sueldo geográfico, uniforme, equipamiento adicional, capacitaciones y acceso a la aplicación móvil <b>CRS APP</b>.
                </p>
                <p style='font-size:14px; color:#001550; margin-bottom:8px;'>
                    Si tiene alguna duda o requiere aclaraciones, no dude en comunicarse. Estamos disponibles para resolver cualquier inquietud sobre la cotización.
                </p>
                <p style='font-size:14px; font-weight:bold; color:#001550; margin:0;'>
                    ¡Quedamos atentos a su respuesta!
                </p>
            </div>
        </div>
    </div>";

      $pdf->writeHTML($html_pagina12, true, false, true, false, '');

      // Pagina 13
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag28.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina13, true, false, true, false, '');

    // Pagina 14
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag29.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina14, true, false, true, false, '');

    // Pagina 15
    $pdf->AddPage();
    $pdf->Image('../resource/img/pag30.jpg', 0, 0, $ancho, $alto);
    $pdf->writeHTML($html_pagina15, true, false, true, false, '');

            // Generar nombre de archivo único
        $pdfDir = __DIR__ . '/pdf';
        if (!is_dir($pdfDir)) {
            if (!mkdir($pdfDir, 0777, true)) {
                throw new Exception("No se pudo crear el directorio para PDFs");
            }
        }

        $filename = $pdfDir . '/cotizacion_' . time() . '.pdf';
        
        // Guardar el PDF en el servidor
        $pdf->Output($filename, 'F');
        
        if (!file_exists($filename)) {
            throw new Exception("No se pudo guardar el archivo PDF");
        }
        
        return $filename;
        
    } catch (Exception $e) {
        error_log("Error en generarPDF: " . $e->getMessage());
        throw $e;
    }
}

