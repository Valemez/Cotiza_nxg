<?php
require_once('connect.php');

class UsurioModel{
    private $conn;
    private $nombre;
    private $email;

    public function __construct(){
        $this->conn = Conexion::getInstance();
    }

    public function verificacionUsuario(){
        echo json_encode(['status' => 'success', 'message' => 'Solicitud GET recibida']);

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