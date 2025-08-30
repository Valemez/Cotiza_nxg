<?php
require_once('connect.php');

class UsuarioModel{
    private $conn;
    private $nombre;
    private $email;

    public function __construct(){
        $this->conn = Conexion::getInstance();
    }

    public function addClient($email){
        // Lógica para agregar un cliente a la base de datos    
        // echo json_encode(['status' => 'success', 'message' => 'Cliente agregado']);
    }

}

?>