<?php
require_once('connect.php');

class UsuarioModel{
    private $conn;
    private $nombre;
    private $email;

    public function __construct(){
        $this->conn = Conexion::getInstance();
    }

    public function verificacionUsuario($email){
        $stmt = $this->conn->prepare("SELECT email, status_user FROM usuarios WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user;
    }

}

?>