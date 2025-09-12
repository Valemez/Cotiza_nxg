<?php
/*
TO-DO
* Para que me de el documento correcto hacer un fetch, en el localStorage ya recupero un dato, en este caso se considera el id del cliente, 
  Buscar la forma de recuperar este dato para mandar la cotizaciòn correcta, ya sea que esto sea una funcion y desde el mismo php donde se 
  insertan recuperar el id y hacer el recorrido
 */

// require_once "../../../vendor/autoload.php";
require_once('../../vendor/autoload.php');
// require_once('connect.php');

use PhpOffice\PhpWord\Style\Language;


class wordModel
{
    private $conn;

    public function __construct() {
        // $this->conn = Conexion::getInstance();
    }

    public function generateDocument(){
        // 
        $documento = new \PhpOffice\PhpWord\PhpWord();
        $propiedades = $documento->getDocInfo();
        $propiedades->setCreator("Parzibyte");
        $propiedades->setCompany("Texto");
        # Agregar texto...
        $seccion = $documento->addSection();
        # Simple texto
        $seccion->addText("Hola, esto es algo de texto");
        # Con fuentes personalizadas
        $fuente = [
            "name" => "Arial",
            "size" => 12,
            "color" => "8bc34a",
            "italic" => true,
            "bold" => true,
        ];
        $seccion->addText("Hola, esto es algo de texto Misael Gomez", $fuente);
        # Hipervínculo
        $fuenteHipervinculo = [
            "name" => "Arial",
            "size" => 12,
            "color" => "ff0000",
            "italic" => true,
        ];
        $seccion->addLink("https://parzibyte.me/blog/", "Mi blog", $fuenteHipervinculo);
        
        # Títulos. Solo modificando depth (el número)
        $fuenteTitulo = [
            "name" => "Verdana",
            "size" => 20,
            "color" => "000000",
        ];
        
        $documento->addTitleStyle(1, $fuenteTitulo);
        $seccion->addTitle("Soy un título", 1);
        # Texto bajo el título
        $seccion->addText("Hola");
        # Ahora un subtítulo con profundidad de 2
        $fuenteSubtitulo = [
            "name" => "Verdana",
            "size" => 18,
            "color" => "000000",
        ];
        $documento->addTitleStyle(2, $fuenteSubtitulo);
        $seccion->addTitle("Soy un subtítulo", 2);
        
        # Para que no diga que se abre en modo de compatibilidad
        $documento->getCompatibility()->setOoxmlVersion(15);
        # Idioma español de México
        $documento->getSettings()->setThemeFontLang(new Language("ES-MX"));
        
        # Guardarlo
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($documento, "Word2007");
        
        $objWriter->save("3-texto.docx");
        // $db = Conexion::getInstance();
    }
}

