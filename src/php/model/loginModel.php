<?php
require_once('connect.php');

class LoginModel{
    private $conn;
    private $nombre;
    private $email;

    public function __construct(){
        $this->conn = Conexion::getInstance();
    }

    public function login($correo, $password){
        // echo json_encode($user);
        
        if ($this->validateEmail($correo)) {
            $stmt = $this->conn->prepare("SELECT id_usuario, password FROM usuarios WHERE email = :email");
            $stmt->bindParam(':email', $correo);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($user && password_verify($password, $user['password'])) {
                $value = $this->calculateToken($correo . $user['id_usuario']);
                $_SESSION['token'] = $value;
                // $this->getInformacion($correo); # en siguientes versiones mejorarlo, y agregarlo
                return [
                    'status' => 'success',
                    'cookie' => setcookie("token", $value, time() + 3600, '/', 'localhost'),
                    'nombre' => $this->nombre,
                    'email' => $this->email,
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Credenciales incorrectos'
                ];
            }
        }else{
            return [
                'status' => 'error',
                'message' => 'Datos no encontrados'
            ];
        }

    }

    public function validateEmail($correo){
        $stmt = $this->conn->prepare("SELECT * FROM usuarios WHERE email = :email and status_user = 1");
        $stmt->bindParam(':email', $correo);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            // return $stmt->fetch(PDO::FETCH_ASSOC);
            return true;
        } else {
            return false;
        }
    }

    public function calculateToken($param){
        $token = hash('sha256', "Prosmacrs" . $param);
        return $token;
    }

    public function sessionExists($token){
        if($_SESSION['token'] === $token){
            return true;
        }else{
            return false;
        }
    }

    public function getInformacion($correo){
        $stmt = $this->conn->prepare("SELECT nombre FROM nxgcommx_cotizaciones_prosman.usuarios WHERE email = :email");
        $stmt->bindParam(':email', $correo);

        if($stmt->execute()){
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->nombre = $user['nombre'];
            $this->email = $user['email'];
        }else{
            throw new Exception("Error al obtener la información del usuario");
        }
    }

    public function validarStatus($correo){
        $stmt = $this->conn->prepare("SELECT status_user FROM usuarios WHERE email = :email");
        $stmt->bindParam(':email', $correo);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
        // if($stmt->rowCount() > 0){
        //     $user = $stmt->fetch(PDO::FETCH_ASSOC);
        //     if($user['status_user'] == 1){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // } else {
        //     return false;
        // }
    }
}

?>