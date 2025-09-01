  --  CREATE DATABASE nxgcommx_cotizaciones_conglomerado;
  
  USE nxgcommx_cotizaciones_conglomerado;
    
    /*----------clientes--------------*/
CREATE TABLE clientes (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    logo BLOB NOT NULL,
    nombre varchar(100) NOT NULL,
    destinatario varchar(100) not null,
    puesto varchar(100) not null,
    asunto varchar(100) not null,
    created_at TIMESTAMP
);

/*----------propuesta economica--------------*/
CREATE TABLE propuesta_economica (
	id_propuesta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    servicio VARCHAR(100) NOT NULL,
    descripcion_servicio TEXT,
	archivo_excel BLOB,
    created_at TIMESTAMP
);

/*----------servicios--------------*/
CREATE TABLE servicios (
	id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    id_proupesta INT NOT NULL,
    numero_colaborador INT NOT NULL,
    estado_republica json NOT NULL,
    centro_trabajo JSON NOT NULL,
    supervisor INT ,
    operario_limpieza INT,
    ayudante_general INT,
    operario_maquinaria INT,
    turno_trabajo INT,
    created_at TIMESTAMP
);
/*----------items--------------*/
CREATE TABLE items (
	id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_servicio INT NOT NULL,
    uniforme_superior JSON,
    uniforme_inferior JSON,
    num_dotaciones_anual_uniforme INT,
    epp_cabeza JSON,
    epp_cuerpo JSON,
    num_dotaciones_anual_epp INT,
    maquinaria JSON,
    num_dotaciones_anual_maquinaria INT,
    Sin_materiales BOOLEAN default 0,
    con_materiales JSON,
    quimicos JSON,
    jarseria JSON,
    cantidad_jarseria INT,
    fecha_entrega_jarseria VARCHAR(100),
    mobiliario JSON,
    fecha_entrega_mobiliario varchar(100),
    cantidad_mobiliario int,
    created_at TIMESTAMP
);

/*---------- login --------------*/
CREATE TABLE usuarios (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    correo varchar(100) NOT NULL,
    password varchar(100) not null,
    nombre varchar(100) not null,
    created_at TIMESTAMP
);
