<?php
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

                $textFields = ['nombre', 'destinatario', 'puesto', 'asunto', 'servicios', 'descripcion_servicio', 'numero_colaboradores', 'Estado_republica', 'Centro_trabajo', 'Operario_maquinaria', 'Turno_trabajo',  'num_dotaciones_anual_epp', 'num_dotaciones_anual_maquinaria', 'Operario_limpieza', 'ayudante_general', 'supervisor', 'Numero_dotaciones_anuales_uniforme', 'Materiales', 'Fecha_entrega_jarseria', 'num_dotaciones_anual_jarcieria', 'Fecha_entrega_jarcieria', 'Fecha_entrega_mobilario', 'num_dotaciones_anual_mobiliario'];

                $textFieldJson = ['uniforme_superior', 'uniforme_inferior', 'epp_cabeza', 'epp_cuerpo', 'maquinaria', 'quimicos', 'jarcieria', 'mobiliario'];

                foreach($textFields as $field){
                    // $clientData[$field] = $_POST[$field] ? htmlspecialchars(trim($_POST[$field]), ENT_QUOTES, 'UTF-8') : null;
                    $clientData[$field] = isset($_POST[$field]) ? htmlspecialchars(trim($_POST[$field]), ENT_QUOTES, 'UTF-8') : null;
                }


                foreach($textFieldJson as $fieldJson){
                    // code ...
                    if (isset($_POST[$fieldJson]) && is_array($_POST[$fieldJson])) {
                        $clientData[$fieldJson] = array_map(function($item){
                            $item = is_scalar($item) ? (string) $item : '';
                            return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
                        }, $_POST[$fieldJson]);
                    }else{
                        $clientData[$fieldJson] = [];
                    }
                }

                # es para recibir la imagen
                if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
                    $clientData['logo_tmp'] = $_FILES['logo']['tmp_name'];
                    $clientData['logo_name'] = $_FILES['logo']['name'];
                    // Debug: verificar que el archivo temporal existe
                    // error_log("Archivo temporal: " . $clientData['logo_tmp']);
                    // error_log("Existe archivo temporal: " . (file_exists($clientData['logo_tmp']) ? 'SI' : 'NO'));
                }else{
                    $clientData['logo_tmp'] = null;
                    $clientData['logo_name'] = 'logo';
                    error_log("No se subió archivo o error en upload");
                }
                # es para recibir el archivo
                $clientData['archivo_excel_tmp'] = [];
                $clientData['archivo_excel_name'] = [];

                if(isset($_FILES['archivo_excel'])){ //&& $_FILES['archivo_excel'] === UPLOAD_ERR_OK

                    $fileCount = count($_FILES['archivo_excel']['name']);

                    for ($i=0; $i < $fileCount; $i++) { 
                        # code...
                        if ($_FILES['archivo_excel']['error'][$i] === UPLOAD_ERR_OK) {
                            # code...
                            $clientData['archivo_excel_tmp'][] = $_FILES['archivo_excel']['tmp_name'][$i];
                            $clientData['archivo_excel_name'][] = $_FILES['archivo_excel']['name'];

                            error_log("Archivo[".$i."] temporal: " . $_FILES['archivo_excel']['tmp_name'][$i]);
                        }else{
                            error_log("Error al subir el archivo [".$i."]: " . $_FILES['archivo_excel']['name'][$i]);
                        }
                    }


                    error_log("Archivo temporal: " . $clientData['archivo_excel_tmp']);
                    error_log("Existe archivo temporal: " . (file_exists($clientData['archivo_excel_tmp']) ? 'SI' : 'NO'));
                }else{
                    $clientData['archivo_excel_tmp'] = null;
                    $clientData['archivo_excel_name'] = 'archivo_excel';
                    error_log("No se subió archivo o error en upload Excel");
                }

                $resultado = $model->addClient($clientData);
                echo json_encode($resultado) ;

                // echo json_encode([$clientData]) ;

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