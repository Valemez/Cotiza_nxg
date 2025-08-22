<?php

require_once('connect.php');

class consultas extends Conexion {

    private $db;

    public function __construct() {
         $this->db = Conexion::getIntance();
    }

    public function insertarDatos($nombre, $Empresa, $Email, $Telefono, $descripcion_empresa) {
        try {
            /*$sql = $this->db->prepare ("SELECT 
            datos_personales (Nombre, Empresa, Email, Telefono, descripcion_Empresa) 
            VALUES (:Nombre, :Empresa, :Email, :Telefono, :descripcion_Empresa)";
            $stmt = $this->db->prepare($sql);

            $stmt->bindParam(':Nombre', $nombre);
            $stmt->bindParam(':Empresa', $empresa);
            $stmt->bindParam(':Email', $email);
            $stmt->bindParam(':Telefono', $telefono);
            $stmt->bindParam(':descripcion_Empresa', $descripcion_empresa);

            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            echo 'Error al insertar datos: ' . $e->getMessage();
            return false;
        }*/
    }
}


?>