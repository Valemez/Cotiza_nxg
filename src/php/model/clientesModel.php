<?php
require_once('connect.php');

class clienteModel{
    private $conn;

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
        $files_tmp = $data['archivo_excel_tmp'] ?? null;
        $files_name = $data['archivo_excel_name'] ?? 'file';

        // --- Inicia la transacción ---
        $this->conn->beginTransaction();

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

                $this->uploadFile($logo_tmp, $logo_name, $idCliente);

                # Aquí van a estar las demás inserciones
                $idPropuesta = $this->addEconomicProposal($idCliente, $data);

                $this->manyFiles($files_tmp, $files_name, $idCliente);

                $this->addServices($idPropuesta, $data);

                // --- Si todo fue exitoso, confirma la transacción ---
                $this->conn->commit();

                return [
                    'status' => 'success', 
                    'message' => 'Cliente guardado correctamente.', 
                    'id' => $idCliente
                ];
            } else {
                return [
                    'status' => 'error', 
                    'message' => 'No se pudo guardar el cliente.'
                ];
            }

        } catch (PDOException $e) {
            // --- Si ocurre un error en la BD, revierte todos los cambios ---
            $this->conn->rollBack();
            return [
                'status' => 'error', 
                'message' => 'Error de base de datos: ' . $e->getMessage()
            ];
        }
    }

    // función para hacer la inserción a la tabla propuesta_economica
    private function addEconomicProposal(int $idCliente, array $data){
        $servicios = $data['servicios'] ?? '';
        $descripcionServicio = $data['descripcion_servicio'] ?? '';

        $sql ='INSERT INTO propuesta_economica(id_cliente, servicio, descripcion_servicio) VALUES (:id_cliente, :servicio, :descripcion_servicio)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id_cliente', $idCliente);
        $stmt->bindValue(':servicio', $servicios);
        $stmt->bindValue(':descripcion_servicio', $descripcionServicio);
        $stmt->execute();

        $id_propuesta = $this->conn->lastInsertId();
        return $id_propuesta;
    }

    //método para agregar los servicios
    private function addServices(int $id_propuesta, array $data){
        # code ...
        $num_colaborador = $data['numero_colaboradores'];
        $estado_republica = $data['Estado_republica'];
        $centro_trabajo = $data['Centro_trabajo'];
        // $supervisor = $data['supervisor'];
        // $operario_limpieza = $data['operario_limpieza'];
        // $ayudante_general = $data['Ayudante_general'];
        $operario_maquinaria = $data['Operario_maquinaria'];
        $turno_trabajo = $data['Turno_trabajo'];

        $sql = 'INSERT INTO servicios(id_proupesta, numero_colaborador, estado_republica, centro_trabajo, supervisor, operario_limpieza, ayudante_general, operario_maquinaria, turno_trabajo) VALUES(:id_proupesta, :numero_colaborador, :estado_republica, :centro_trabajo, :supervisor, :operario_limpieza, :ayudante_general, :operario_maquinaria, :turno_trabajo)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam('id_proupesta', $id_propuesta);
        $stmt->bindParam('numero_colaborador', $num_colaborador);
        $stmt->bindParam('estado_republica', $estado_republica);
        $stmt->bindParam('centro_trabajo', $centro_trabajo);
        $stmt->bindParam('supervisor', $supervisor);
        $stmt->bindParam('operario_limpieza', $operario_limpieza);
        $stmt->bindParam('ayudante_general', $ayudante_general);
        $stmt->bindParam('operario_maquinaria', $operario_maquinaria);
        $stmt->bindParam('turno_trabajo', $turno_trabajo);
        $stmt->execute();

        $id_servicio = $this->conn->lastInsertId();
        return $id_servicio;

    }

    // funcion para subir el logo
    private function uploadFile(?string $logo_tmp, string $logo_name, int $idCliente): void{
        if ($logo_tmp === null || !file_exists($logo_tmp)) {
            return;
        }
        $path ="../logoCliente/id/" . $idCliente;
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        $destino = $path . '/' . $logo_name;
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

    // método para subir varios archivos
    private function manyFiles(?string $file_tmp, string $file_name, int $idCliente){
        # code ...
            if ($file_tmp === null || !file_exists($file_tmp)) {
            return;
        }

        $path ="../filesCliente/id/" . $idCliente;

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $destino = $path . '/' . $file_name;

        if (move_uploaded_file($file_tmp, $destino)) {
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
            error_log("Error moviendo archivo: " . $file_tmp . " a " . $destino);
        }
    }

}

?>