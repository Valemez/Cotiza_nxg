<?php
header("Content-Type: application/json");
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

                // $nombre = isset($_POST['nombre']) ? htmlspecialchars(trim($_POST['nombre']), ENT_QUOTES, 'UTF-8') : '';
                // $destinatario = isset($_POST['destinatario']) ? htmlspecialchars(trim($_POST['destinatario']), ENT_QUOTES, 'UTF-8') : '';
                // $puesto = isset($_POST['puesto']) ? htmlspecialchars(trim($_POST['puesto']), ENT_QUOTES, 'UTF-8') : '';
                // $asunto = isset($_POST['asunto']) ? htmlspecialchars(trim($_POST['asunto']), ENT_QUOTES, 'UTF-8') : '';
                
                $clientData = [];

                $textFields = ['nombre', 'destinatario', 'puesto', 'asunto'];

                foreach($textFields as $field){
                    $clientData[$field] = $_POST[$field] ? htmlspecialchars(trim($_POST[$field]), ENT_QUOTES, 'UTF-8') : null;
                }

                $clientData['logo'] = null;

                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    $logo_path = $_FILES['logo']['tmp_name'];
                    $logo_blob = file_get_contents($logo_path);

                    $clientData['logo'] =  $logo_blob;
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