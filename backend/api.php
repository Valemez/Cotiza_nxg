<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");


print_r($_SERVER);

$method=$_SERVER["REQUEST_METHOD"];
echo $method;

// require('consultaModel.php');

// session_start();




// $requestUri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
// $apiIndex = array_search('formulario.php', $requestUri);    

// $resource = isset($requestUri[$apiIndex + 1]) ? $requestUri[$apiIndex + 1] : null;
// $id = isset($requestUri[$apiIndex + 2]) ? $requestUri[$apiIndex + 2] : null;    
// $method = strtoupper($_SERVER['REQUEST_METHOD']);
// echo $resource;
// switch ($method) {
//     case 'POST':
//         switch ($resource) {
//             case 'prospecto':
//                 $nombre = $_POST['Nombre'] ?? '';
//                 $Empresa = $_POST['Empresa'] ?? '';
//                 $Email = $_POST['Email'] ?? '';
//                 $Telefono = $_POST['Telefono'] ?? '';
//                 $descripcion_empresa = $_POST['descripcion_empresa'] ?? '';
//                 $model = new consultas();
//                 $result = $model->insertarDatos($nombre, $Empresa, $Email, $Telefono, $descripcion_empresa);   
//                 if ($result) {
//                     echo json_encode(['status' => 'success', 'data' => $result]);
//                 }   else {      
//                     echo json_encode(['status' => 'error', 'message' => 'Error al insertar datos']);
//                 }
//                 break;
//             default:
//                 echo json_encode(['status' => 'error', 'message' => 'Recurso no encontrado']);      
//                 break;
//             }
//             break;
//     default:
//         echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
//         break;
// }   


?>