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
        }

        // Página 12: Información del cliente
        $pdf->AddPage();
        
        // Ajustar márgenes para el contenido HTML
        $pdf->SetMargins(20, 20, 20);
        
        $html_cliente = "
        <div style='font-family:helvetica; color:#001550;'>
            <div style='background:#001550; color:#fff; padding:24px 20px 16px 20px; border-radius:8px 8px 0 0;'>
                <h1 style='margin:0; font-size:24px; letter-spacing:2px;'>Cotización de Servicios</h1>
                <p style='margin:0; font-size:16px; color:#b3c6e0;'>CRS Seguridad Privada</p>
            </div>
            <div style='background:#fff; border:2px solid #001550; border-top:0; border-radius:0 0 8px 8px; padding:32px 24px;'>
                <h2 style='color:#001550; border-bottom:2px solid #b3c6e0; padding-bottom:8px; margin-bottom:18px;'>Información del cliente</h2>
                <table cellpadding='6' cellspacing='0' border='0' style='width:100%; font-size:12px; color:#222;'>
                    <tr>
                        <td style='width:28%; font-weight:bold;'>Nombre:</td>
                        <td style='width:72%;'>" . htmlspecialchars($data['Nombre']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>Empresa:</td>
                        <td>" . htmlspecialchars($data['Empresa']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>Contacto:</td>
                        <td>" . htmlspecialchars($data['Email']) . " | " . htmlspecialchars($data['Telefono']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>Dirección:</td>
                        <td>" . htmlspecialchars($data['direccion_Empresa']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>Cargo:</td>
                        <td>" . htmlspecialchars($data['Cargo_Ocupacional']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>WhatsApp:</td>
                        <td>" . htmlspecialchars($data['whatsapp']) . "</td>
                    </tr>
                    <tr>
                        <td style='font-weight:bold;'>Descripción:</td>
                        <td>" . nl2br(htmlspecialchars($data['descripcion_Empresa'])) . "</td>
                    </tr>
                </table>

                <hr style='border:0; border-top:2px solid #3c7bd3; margin:28px 0 18px 0;'>
                
                <h2 style='color:#001550; margin-bottom:10px;'>Tipo de turno</h2>
                <p style='margin:0 0 18px 0; font-size:12px;'>" . htmlspecialchars($data['SelectTurno']) . "</p>
                
                <h2 style='color:#001550; margin-bottom:10px;'>Número de guardias</h2>
                <p style='margin:0 0 18px 0; font-size:12px;'>" . htmlspecialchars($data['num_guardias']) . "</p>";

        // Agregar servicios si existen
        $html_cliente .= "<h2 style='color:#001550; margin-bottom:10px;'>Servicios solicitados</h2><ul style='margin-left:22px; margin-bottom:18px; font-size:12px; color:#001550;'>";
        if (!empty($data['servicios']) && is_array($data['servicios'])) {
            foreach ($data['servicios'] as $servicio) {
                $html_cliente .= "<li>" . htmlspecialchars($servicio) . "</li>";
            }
        } else {
            $html_cliente .= "<li>No se especificaron servicios</li>";
        }
        $html_cliente .= "</ul>";

        // Agregar equipamiento si existe
        $html_cliente .= "<h2 style='color:#001550; margin-bottom:10px;'>Equipamiento requerido</h2><ul style='margin-left:22px; margin-bottom:18px; font-size:12px; color:#001550;'>";
        if (!empty($data['equipamiento']) && is_array($data['equipamiento'])) {
            foreach ($data['equipamiento'] as $equipo) {
                $html_cliente .= "<li>" . htmlspecialchars($equipo) . "</li>";
            }
        } else {
            $html_cliente .= "<li>No se especificó equipamiento</li>";
        }
        $html_cliente .= "</ul>";

        // Agregar comentarios si existen
        $html_cliente .= "
                <h2 style='color:#001550; margin-bottom:10px;'>Comentarios adicionales</h2>
                <p style='margin:0 0 18px 0; font-size:12px;'>" . 
                    (empty($data['comentarios']) ? 'Sin comentarios adicionales' : nl2br(htmlspecialchars($data['comentarios']))) . 
                "</p>
                
                <div style='margin-top:30px; padding:18px; background-color:#f5f8fa; border-radius:6px; border-left:6px solid #001550;'>
                    <p style='font-size:12px; color:#001550; margin-bottom:8px;'>
                        <strong>Nota importante:</strong> Esta cotización es válida por 30 días a partir de su emisión. Los precios pueden variar según los servicios específicos y equipamiento requerido.
                    </p>
                </div>
            </div>
        </div>";

        // Escribir el contenido HTML
        $pdf->writeHTML($html_cliente, true, false, true, false, '');

        // Páginas finales
        $pdf->SetMargins(0, 0, 0);
        for ($i = 28; $i <= 30; $i++) {
            $pdf->AddPage();
            $imagePath = "../resource/img/pag{$i}.jpg";
            if (file_exists($imagePath)) {
                $pdf->Image($imagePath, 0, 0, $ancho, $alto);
            }
        }

        // Preparar directorio para el PDF
        $pdfDir = __DIR__ . '/pdf';
        if (!is_dir($pdfDir) && !mkdir($pdfDir, 0777, true)) {
            throw new Exception("No se pudo crear el directorio para PDFs");
        }

        // Generar nombre único para el archivo
        $filename = $pdfDir . '/cotizacion_' . time() . '.pdf';
        
        // Guardar el PDF
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
