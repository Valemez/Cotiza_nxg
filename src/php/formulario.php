<?php
file_put_contents('debug_post.txt', print_r($_POST, true));

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
// header("Location: https://intranetipm.ddns.net/cotiza_nxg/");


require_once('connect.php');
require_once('cotizacionPDF.php');
require_once('correo.php');

$db_connection = Conexion::getInstance();


//SANITIZACION
$nombre = isset($_POST['Nombre']) ? htmlspecialchars(trim($_POST['Nombre']), ENT_QUOTES, 'UTF-8') : ''; 
$empresa = isset($_POST['Empresa']) ? htmlspecialchars(trim($_POST['Empresa']), ENT_QUOTES, 'UTF-8') : ''; 
$email = isset($_POST['Email']) ? htmlspecialchars(trim($_POST['Email']), ENT_QUOTES, 'UTF-8') : '';
$telefono = isset($_POST['Telefono']) ? htmlspecialchars(trim($_POST['Telefono']), ENT_QUOTES, 'UTF-8'): '';
$descripcion_empresa = isset($_POST['descripcion_Empresa']) ? htmlspecialchars(trim($_POST['descripcion_Empresa']), ENT_QUOTES, 'UTF-8') : '';
$direccion = isset($_POST['direccion_Empresa']) ? htmlspecialchars(trim($_POST['direccion_Empresa']), ENT_QUOTES, 'UTF-8') : '' ;
$cargo_ocupacional = isset($_POST['Cargo_Ocupacional']) ? htmlspecialchars(trim($_POST['Cargo_Ocupacional']), ENT_QUOTES, 'UTF-8') : '';
$whatsapp = isset($_POST['whatsapp']) ? htmlspecialchars(trim($_POST['whatsapp']), ENT_QUOTES, 'UTF-8'): '';
$selectTurno = isset($_POST['SelectTurno']) ? htmlspecialchars(trim($_POST['SelectTurno']), ENT_QUOTES, 'UTF-8') : '';
$comentarios = isset($_POST['comentarios']) ? htmlspecialchars(trim($_POST['comentarios']), ENT_QUOTES, 'UTF-8') : '';
$num_guardias = isset($_POST['num_guardias']) ? (int)$_POST['num_guardias'] : 0;

$tipo_servicio = $_POST['servicios'] ?? [];
$tipo_servicio = [];
if (isset($_POST['servicios']) && is_array($_POST['servicios'])) {
    $tipo_servicio = array_map(function($item) {
        return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
    }, $_POST['servicios']);
}

$tipo_guardia = $_POST['equipamiento'] ?? [];

$tipo_guardia = [];
if (isset($_POST['equipamiento']) && is_array($_POST['equipamiento'])) {
    $tipo_guardia = array_map(function($item) {
        return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
    }, $_POST['equipamiento']);
}



$tipo_servicio_json = json_encode($tipo_servicio, JSON_UNESCAPED_UNICODE);
$tipo_guardias_json = json_encode($tipo_guardia, JSON_UNESCAPED_UNICODE);


$sql = "INSERT INTO datos_personales (Nombre, Empresa, Email, Telefono, descripcion_Empresa, direccion_empresa, cargo_ocupacional, whatsapp, tipo_servicio) VALUES (?, ?, ? , ?, ?, ?, ?, ?, ?)";

try {
    // hacer una transaccion
    $db_connection->beginTransaction();

    $stmt = $db_connection->prepare($sql);

    $stmt->execute([
        $nombre,
        $empresa,
        $email,
        $telefono,
        $descripcion_empresa,
        $direccion,
        $cargo_ocupacional,
        $whatsapp,
        $tipo_servicio_json
    ]);

    $fila1 = $stmt->rowCount();

    //obtener el id del cliente 
    $idCliente = $db_connection->lastInsertId();

    //segunda tabla donde se hace la inserción
    $sql2 = "INSERT INTO cotizacion(num_Guardias, tipo_Guardia, tipo_Turno, comentarios_adicionales, idCliente) VALUES (?, ?, ?, ?, ?)";

    $stmt2 = $db_connection->prepare($sql2);
    $stmt2->execute([
        $num_guardias,
        $tipo_guardias_json,
        $selectTurno,
        $comentarios ,
        $idCliente
    ]);

    $fila2 = $stmt2->rowCount();

    // confirmar la transaccion
    $db_connection->commit();
   
    //filas afectadas > 0 si se ensertto y si si se genera el pdf
    if($fila1 > 0 && $fila2 > 0){
        $datos = [
            'Nombre' => $nombre,
            'Empresa' => $empresa,
            'Email' => $email,
            'Telefono' => $telefono,
            'direccion_Empresa' => $direccion,
            'Cargo_Ocupacional' => $cargo_ocupacional,
            'whatsapp' => $whatsapp,
            'descripcion_Empresa' => $descripcion_empresa,
            'SelectTurno' => $selectTurno,
            'num_guardias' => $num_guardias,
            'servicios' => $tipo_servicio,
            'equipamiento' => $tipo_guardia,
            'comentarios' => $comentarios
        ];
        try {
            $rutaPDF = generarPDF($datos);
            $correoEnviado = sendEmailPDF($nombre, $email, $rutaPDF);
            echo json_encode(['success' => true, 'message' => 'Datos insertados y PDF generado correctamente']);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error al generar PDF: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al insertar datos en la base de datos']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al insertar datos: ' . $e->getMessage()]);
}

session_start();
exit;

?>