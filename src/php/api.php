<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require_once('./model/loginModel.php');
require_once('./model/UsuarioModel.php');


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
                # code...
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