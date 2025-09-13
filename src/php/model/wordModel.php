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

    private function sanitize(string $text):string{
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    public function generateDocument(int $idCliente, array $data){
        // probar y quitarlo al final cuando ya este listo el mètodo
        $documento = new \PhpOffice\PhpWord\PhpWord();
        $propiedades = $documento->getDocInfo();
        $propiedades->setCreator("Parzibyte");
        $propiedades->setCompany("Texto");

        $imagenPortada = __DIR__ . '/../../assets/Portada_prosman.png';
        $imagenIntroducción = __DIR__ . '/../../assets/Introduccion.png';
        $imagenFondo1 = __DIR__ . '/../../assets/fondo-1.png';
        $imagenFondo2 = __DIR__ . '/../../assets/fondo-2.png';
        $imagenFondo3 = __DIR__ . '/../../assets/fondo-3.png';
        $imagenFondoFinal = __DIR__ . '/../../assets/fondo-final.png';

        $this->addImageToSection($documento, $imagenPortada, 16, 25);
        $this->addImageToSection($documento, $imagenIntroducción, 16, 22.7);
        $this->addImageToSection($documento, $imagenFondo1, 16, 22.7);
        $this->addImageToSection($documento, $imagenFondo2, 16, 22.7);
        $this->addImageToSection($documento, $imagenFondo3, 16, 22.7);
        $this->addImageToSection($documento, $imagenFondoFinal, 16, 22.7);

        # Agregar texto...
        $seccion = $documento->addSection();

        $nombre = $data['nombre'] ?? '';
        $destinatario = $data['destinatario'] ?? '';
        # Simple texto
        // $seccion->addText("Hola, esto es algo de texto " . htmlspecialchars($idCliente) . " " . htmlspecialchars($nombre) . " -------" );
        $texto = "Hola $nombre, tu id es: $idCliente";
        $seccion->addText(htmlspecialchars($texto, ENT_QUOTES, 'UTF-8'));

        # Con fuentes personalizadas
        $fuente = [
            "name" => "Arial",
            "size" => 12,
            "color" => "8bc34a",
            "italic" => true,
            "bold" => true,
        ];
        $seccion->addText("Hola, esto es algo de texto Misael Gomez", $fuente);
        $texto2 = "hola" . $this->sanitize($nombre) . "esto es una prueba con mi nuevo método de sanitización";
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
    }

    private function addImageToSection(\PhpOffice\PhpWord\PhpWord $documento, string $imagen, float $ancho, float $alto){
        // code ...
        // $documento = new \PhpOffice\PhpWord\PhpWord();
        $propiedades = $documento->getDocInfo();
        $propiedades->setCreator("Parzibyte");
        $propiedades->setCompany("Texto");
        
         $seccion = $documento->addSection([
            'marginTop' => 0,
            'marginBottom' => 0,
            'marginLeft' => 0,
            'marginRight' => 0,
        ]);

        $ImagenSeccion = $imagen; //parametro de la ruta para la nueva función

        $seccion->addImage(
            $ImagenSeccion,
            [
            'width'         => \PhpOffice\PhpWord\Shared\Converter::cmToPixel($ancho),   // ancho A4
            'height'        => \PhpOffice\PhpWord\Shared\Converter::cmToPixel($alto),// alto A4
            'positioning'   => \PhpOffice\PhpWord\Style\Image::POSITION_ABSOLUTE,
            'posHorizontal' => \PhpOffice\PhpWord\Style\Image::POSITION_HORIZONTAL_LEFT,
            'posVertical'   => \PhpOffice\PhpWord\Style\Image::POSITION_VERTICAL_TOP,
            'marginTop'     => 0,
            'marginLeft'    => 0,
            'marginRight'    => 0,
            ]
        );


    }
}

