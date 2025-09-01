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
        $logo_tmp = $data['logo_tmp'] ?? null;
        $logo_name = $data['logo_name'] ?? 'logo';
        $nombre = $data['nombre'] ?? '';
        $destinatario = $data['destinatario'] ?? '';
        $puesto = $data['puesto'] ?? '';
        $asunto = $data['asunto'] ?? '';

        try {
            $sql = "INSERT INTO clientes(nombre, destinatario, puesto, asunto)
            VALUES(:nombre, :destinatario, :puesto, :asunto)";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(':nombre', $nombre);
            $stmt->bindValue(':destinatario', $destinatario);
            $stmt->bindValue(':puesto', $puesto);
            $stmt->bindValue(':asunto', $asunto);

            if ($stmt->execute()) {
                $idCliente = $this->conn->lastInsertId();
                $path ="../logoCliente/id/" . $idCliente;
                if ($logo_tmp !== null && file_exists($logo_tmp)) {
                    if (!file_exists($path)) {
                        mkdir($path, 0777, true);
                    }
                    $destino = $path . '/' . $logo_name;
                    // move_uploaded_file($logo_tmp, $destino);
                    // Mover el archivo
                    if (move_uploaded_file($logo_tmp, $destino)) {
                        // Archivo movido exitosamente
                        // Verificar si el archivo existe en el destino
                        if (file_exists($destino)) {
                            error_log("Archivo confirmado en destino: " . $destino);
                        } else {
                            error_log("ERROR: Archivo no encontrado en destino: " . $destino);
                            // Verificar permisos de directorio
                            if (!is_writable($path)) {
                                error_log("ERROR: Directorio sin permisos de escritura: " . $path);
                            }
                        }
                    } else {
                        // Error al mover el archivo
                        error_log("Error moviendo archivo: " . $logo_tmp . " a " . $destino);
                    }
                }
                // return ['status' => 'success', 'message' => 'Cliente guardado correctamente.', 'id' => $this->conn->lastInsertId()];
                return [
                    'status' => 'success', 
                    'message' => 'Cliente guardado correctamente.', 
                    'id' => $idCliente
                ];
            } else {
                // return ['status' => 'error', 'message' => 'No se pudo guardar el cliente.'];
                return [
                    'status' => 'error', 
                    'message' => 'No se pudo guardar el cliente.'
                ];
            }



        } catch (PDOException $e) {
            //throw $th;
            return [
                'status' => 'error', 
                'message' => 'Error de base de datos: ' . $e->getMessage()
            ];
        }
        // echo json_encode(['status' => 'success', 'message' => $nombre]);
    }

}

?>