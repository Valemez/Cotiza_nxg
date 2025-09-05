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

                $idServicio = $this->addServices($idPropuesta, $data);

                $this->addItem($idServicio, $data);

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
        $supervisor = $data['supervisor'];
        // $operario_limpieza = $data['operario_limpieza'];
        $ayudante_general = $data['ayudante_general'];
        $operario_limpieza = $data['Operario_limpieza'];
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

    //metodo para insertar los items
        private function addItem(int $idServicio, array $data){
            # code ...
            $numero_dotaciones_anuales_uniforme = $data['Numero_dotaciones_anuales_uniforme'];
             $uniforme_superior_json = json_encode($data['uniforme_superior'] ?? [], JSON_UNESCAPED_UNICODE);
             $uniforme_inferior_json = json_encode($data['uniforme_inferior'] ?? [], JSON_UNESCAPED_UNICODE);
             $epp_cabeza = json_encode($data['epp_cabeza'] ?? [], JSON_UNESCAPED_UNICODE);
             $epp_cuerpo = json_encode($data['epp_cuerpo'] ?? [], JSON_UNESCAPED_UNICODE);
             $maquinaria = json_encode($data['maquinaria'] ?? [], JSON_UNESCAPED_UNICODE);
             $quimicos = json_encode($data['quimicos'] ?? [], JSON_UNESCAPED_UNICODE);
             $jarcieria = json_encode($data['jarcieria'] ?? [], JSON_UNESCAPED_UNICODE);
             $mobiliario = json_encode($data['mobiliario'] ?? [], JSON_UNESCAPED_UNICODE);
             $num_dotaciones_anual_jarcieria =$data['num_dotaciones_anual_jarcieria'];
            $num_dotaciones_anual_epp = $data['num_dotaciones_anual_epp'];
            $num_dotaciones_anual_maquinaria = $data['num_dotaciones_anual_maquinaria'];
            $materiales = $data['Materiales'];
            $fecha_entrega_jarcieria = $data['Fecha_entrega_jarcieria'];
            $fecha_entrega_mobilario = $data['Fecha_entrega_mobilario'];
            $num_dotaciones_anual_mobiliario = $data['num_dotaciones_anual_mobiliario'];

            $sql = 'INSERT INTO items(id_servicio, uniforme_superior, uniforme_inferior, num_dotaciones_anual_uniforme, epp_cabeza, epp_cuerpo, num_dotaciones_anual_epp, maquinaria, num_dotaciones_anual_maquinaria, Sin_materiales, quimicos, jarseria, cantidad_jarseria, fecha_entrega_jarseria, mobiliario, fecha_entrega_mobiliario, cantidad_mobiliario) VALUES(:id_servicio, :uniforme_superior, :uniforme_inferior, :num_dotaciones_anual_uniforme, :epp_cabeza, :epp_cuerpo, :num_dotaciones_anual_epp, :maquinaria, :num_dotaciones_anual_maquinaria, :Sin_materiales, :quimicos, :jarseria, :cantidad_jarseria, :fecha_entrega_jarseria, :mobiliario, :fecha_entrega_mobiliario, :cantidad_mobiliario)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam('id_servicio', $idServicio);
            $stmt->bindParam('uniforme_superior', $uniforme_superior_json);
            $stmt->bindParam('uniforme_inferior', $uniforme_inferior_json);
            $stmt->bindParam('num_dotaciones_anual_uniforme', $numero_dotaciones_anuales_uniforme);
            $stmt->bindParam('epp_cabeza', $epp_cabeza);
            $stmt->bindParam('epp_cuerpo', $epp_cuerpo);
            $stmt->bindParam('num_dotaciones_anual_epp', $num_dotaciones_anual_epp);
            $stmt->bindParam('maquinaria', $maquinaria);
            $stmt->bindParam('num_dotaciones_anual_maquinaria', $num_dotaciones_anual_maquinaria);
            $stmt->bindParam('Sin_materiales', $materiales);
            $stmt->bindParam('quimicos', $quimicos);
            $stmt->bindParam('jarseria', $jarcieria);
            $stmt->bindParam('cantidad_jarseria', $num_dotaciones_anual_jarcieria);
            $stmt->bindParam('fecha_entrega_jarseria', $fecha_entrega_jarcieria);
            $stmt->bindParam('mobiliario', $mobiliario);
            $stmt->bindParam('fecha_entrega_mobiliario', $fecha_entrega_mobilario);
            $stmt->bindParam('cantidad_mobiliario', $num_dotaciones_anual_mobiliario);

            // $stmt->bindParam('fecha_entrega_jarseria', $fecha_entrega_jarseria);
            return $stmt->execute();
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