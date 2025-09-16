<?php

class Conexion extends PDO {

    private $host = 'localhost'; // 127.0.0.0  26.165.234.2 // 26.165.234.2  // 26.165.234.2 localhost
    private $db = 'nxgcommx_cotizaciones_prosman';
    private $user = 'root'; //root valeria // valeria
    private $pass = 'Misael_12'; //svr_ti2025$  Kastellanos56  Kastellanos56  // Kastellanos56
    private static $instance = null;
    private $conexion;

    public function __construct() {
        try {
            //crea una conexión a la base de datos usando PDO
            $this->conexion = new PDO("mysql:host={$this->host};dbname={$this->db};", $this->user, $this->pass);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo 'Conexión exitosa a la base de datos';
        } catch (PDOException $e) {
            // echo 'Error de conexión: ' . $e->getMessage(). "\n";
            die();
        }
    }
    // Método para obtener la instancia de la conexión
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Conexion();
        }
        return self::$instance->conexion;
    }
}

?>
