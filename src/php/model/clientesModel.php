<?php
require_once('connect.php');

class clienteModel{
    private $conn;
    // private $nombre;
    // private $email;

    public function __construct(){
        $this->conn = Conexion::getInstance();
    }

    public function addClient(array $data){

        // Extrae los valores del array de forma segura.
        $logo_path = $data['logo'] ?? null;
        $nombre = $data['nombre'] ?? '';
        $destinatario = $data['destinatario'] ?? '';
        $puesto = $data['puesto'] ?? '';
        $asunto = $data['asunto'] ?? '';

        
        echo json_encode(['status' => 'success', 'message' => 'Comunicacion con el modelo']);
    }

}

?>