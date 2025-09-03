<?php
header("Content-Type: application/json;charset-UTF-8");
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
// header("Content-Type: application/json;charset-UTF-8");
// header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header("Content-Type: application/json;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");


require_once('./model/loginModel.php');
require_once('./model/UsuarioModel.php');
require_once('./model/clientesModel.php');


$method=$_SERVER["REQUEST_METHOD"];

$requestUri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$apiIndex = array_search('api.php', $requestUri);
$resource = isset($requestUri[$apiIndex + 1]) ? $requestUri[$apiIndex + 1] : null;

// require('consultaModel.php');

session_start();

switch($method){
    case 'POST':
        switch($resource){
            case 'login':
                // echo json_encode(['status' => 'success', 'message' => 'Login exitoso']);
                $model = new LoginModel();
                $data = json_decode(file_get_contents('php://input'), true);
                $email = $data['usuario'] ?? null;
                $password = $data['password'] ?? null;
                echo json_encode($model->login($email, $password));
            break;
            case 'register':
                echo json_encode(['status' => 'success', 'message' => 'Registro exitoso']);
            break;
            case 'logout':
                //Destruir la sesión
                session_unset();
                session_destroy();
                echo json_encode(['status' => 'success', 'message' => 'Logout exitoso']);
            break;
            case 'formulario':
                $model = new clienteModel();

                $clientData = [];

                $textFields = ['nombre', 'destinatario', 'puesto', 'asunto'];

                foreach($textFields as $field){
                    $clientData[$field] = $_POST[$field] ? htmlspecialchars(trim($_POST[$field]), ENT_QUOTES, 'UTF-8') : null;
                }

                // $clientData['logo'] = null;

                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    // $logo_path = $_FILES['logo']['tmp_name'];
                    // $logo_blob = file_get_contents($logo_path);
                    $clientData['logo_tmp'] = $_FILES['logo']['tmp_name'];
                    $clientData['logo_name'] = $_FILES['logo']['name'];
                    // Debug: verificar que el archivo temporal existe
                    error_log("Archivo temporal: " . $clientData['logo_tmp']);
                    error_log("Existe archivo temporal: " . (file_exists($clientData['logo_tmp']) ? 'SI' : 'NO'));
                }else{
                    $clientData['logo_tmp'] = null;
                    $clientData['logo_name'] = 'logo';
                    error_log("No se subió archivo o error en upload");
                }

                $resultado = $model->addClient($clientData);

                echo json_encode([$resultado]) ;

            default:
                return http_response_code(404);
        }
    break;
    case 'GET':
        switch ($resource) {
            case 'getUser':
                # code ...
                $model = new UsuarioModel();
                echo json_encode($user = $model->verificacionUsuario($requestUri[5]));
                break;
            
            default:
                echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
                break;
        }
    break;
    case 'PUT':
        // code...
    break;
    case 'DELETE':
        // code...
    break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
    break;
}



?>