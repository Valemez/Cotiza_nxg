<?php
require_once('connect.php');
require_once('wordModel.php');

class clienteModel{
    private $conn;
    private $generateDocumet;
    private $tableClientes = "clientes";

    public function __construct(?wordModel $generateDocumet = null){
        $this->conn = Conexion::getInstance();
        $this->generateDocumet = $generateDocumet;
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

                // $this->generateDocumet->generateDocument($idCliente, $data);
                if ($this->generateDocumet) {
                    $this->generateDocumet->generateDocument($idCliente, $data);
                }

                // --- Si todo fue exitoso, confirma la transacción ---
                if($this->conn->commit()){
                    $response['success'] = true;
                    $response['message'] = 'Datos insertados correctamente.';
                }else{
                    $response['success'] = false;
                    $response['message'] = 'Datos no se insertaron';
                }
                return $response;
            }

        } catch (PDOException $e) {
            // --- Si ocurre un error en la BD, revierte todos los cambios ---
            $this->conn->rollBack();

            $response['success'] = false;
            $response['message'] = 'Error de base de datos: ' . $e->getMessage();
            return $response;
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
        move_uploaded_file($logo_tmp, $destino);
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
    private function manyFiles(array $file_tmp, array $file_name, int $idCliente){
        # code ...
            if (empty($file_tmp)) {
                return;
            }

        foreach($file_tmp as $i =>$tmp_path){
            //obtener el nomnre
            $original_name = $file_name[$i];

            #código temporal, despues borrar
            // if (is_array($original_name)) {
            //     # code...
            //     error_log("Error: Se esperaba un string como nombre de archivo en el índice $i, pero se recibió un array.");
            //     continue;
            // }

            $path ="../filesCliente/id/" . $idCliente;
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
    
            # limpiar el nombre
            $clean_name = preg_replace("/[^a-zA-Z0-9._-]/", "", basename($original_name));
            $destino = $path . '/' . $clean_name;
            
            if (move_uploaded_file($tmp_path, $destino)) {
                // Archivo movido exitosamente
                // Verificar si el archivo existe en el destino
                if (file_exists($destino)) {
                    error_log("Archivo confirmado en destino: " . $destino);
                } else {
                    error_log("ERROR: Archivo no encontrado en destino: " . $destino);
                    // Verificar permisos de directorio
                    // if (!is_writable($path)) {
                    //     error_log("ERROR: Directorio sin permisos de escritura: " . $path);
                    // }
                }
            } else {
                // Error al mover el archivo
                error_log("Error moviendo archivo: " . $tmp_path . " a " . $destino);
            }
        }


    }

    public function getInfoClient(){
        try {
            $sql = "SELECT id_cliente, nombre, asunto, created_at FROM  $this->tableClientes order by id_cliente desc";
            $stm = $this->conn->prepare($sql);
            $stm->execute();
            return json_encode($stm->fetchAll(PDO::FETCH_OBJ));
        } catch (PDOException $e) {
            $response['success'] = false;
            $response['message'] = 'Error de base de datos: ' . $e->getMessage();
            return $response;
        }
    }

}

?>