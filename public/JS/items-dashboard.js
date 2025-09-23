import { URL, getData } from "./env.js";

const info = await getData(URL + "/src/php/api.php/informacion");

// console.log(info);

const cuerpoTabla = document.querySelector("#cuerpo-tabla");


//paginación
let limite = 5;
let desde = 0;
let paginas = info.length / limite;
let paginaActiva = 1;

let arreglo = info.slice(desde, limite);

console.log(arreglo);

const cargarCliente = () => {
  cuerpoTabla.innerHTML = "";
  arreglo.map((cliente) => {
    const fila = document.createElement("tr");
    fila.setAttribute("key", cliente.id_cliente);

    // Usamos un ID único para la etiqueta para asociarla con el input oculto
        const inputId = `archivo_editable_pdf_${cliente.id_cliente}`;

    const contenido = `
            <td scope="row">${cliente.id_cliente}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.asunto}</td>
            <td>${cliente.created_at}</td>
            <td>
            <div class="w-75 d-flex justify-content-around">
                <button type="button" class="btn  btn-outline-info btn-sm word" onclick="descargarWord(${cliente.id_cliente})">
                    <i class="fa-solid fa-file-word"></i>
                </button>
                <button type="button" class="btn  btn-outline-danger btn-sm pdf" onclick="descargarPDF(${cliente.id_cliente})">
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
                <div >
                    <label for="${inputId}" class="btn-custom">Subir PDF</label>
                    <input type="file" id="${inputId}" class="archivo_editable_pdf" name="editable_pdf" accept=".pdf" hidden>
                </div>
            </div>
            </td>
        `;
        fila.innerHTML = contenido;
        cuerpoTabla.append(fila);

        // Encuentra el input recién creado y adjúntale un "change" listener
        const fileInput = document.getElementById(inputId);
        if (fileInput) {
            fileInput.addEventListener('change', async () => {
                await uploadPDF(cliente.id_cliente, fileInput);
            });
        }
  });
  cargarItemPaginacion();
};


const cargarItemPaginacion = () =>{
    const itemsContainer = document.querySelector("#items");
    itemsContainer.innerHTML = "";

    const maxVisible = 5; //paginas visibles
    const totalPages = Math.ceil(info.length / limite);

    let start = Math.max(1, paginaActiva - 2);
    let end = Math.min(totalPages, paginaActiva + 2);

    // Ajustar cuando estamos cerca del inicio
    if(paginaActiva <= 3){
        start = 1;
        end = Math.min(totalPages, maxVisible);
    }

    if(paginaActiva >= totalPages - 2){
        start = Math.max(1, totalPages - (maxVisible - 1));
        end = totalPages;
    }

    //pagina 1 siempre visible
    if(start > 1){
        addPageButton(1);
        if(start > 2 ) addDots(); //puntos ...
    }


    for (let index = start; index <= end; index++) {
        addPageButton(index, index === paginaActiva);
    }

    //Ultima siempre visible
    if(end < totalPages){
        if(end < totalPages - 1) addDots();
        addPageButton(totalPages);
    }
}


function addPageButton(page, isActive = false){
    const item = document.createElement("li");
    item.classList = `page-item ${paginaActiva ==page ? "active": ''}`;
    const enlace = `<button class="page-link" onclick="pasarPagina(${page - 1})">${page}</button>`;
    item.innerHTML = enlace;
    document.querySelector("#items").append(item);

}

function addDots(){
    const item = document.createElement("li");
    item.classList = "page-item disabled";
    item.innerHTML = `<span class="page-link">...</span>`;
    document.querySelector("#items").append(item);
}

const modifyArrayClient = () =>{
    arreglo = info.slice(desde, limite * paginaActiva) //pagina 2 -> (5, 10)
    cargarCliente();
}

window.pasarPagina = (pagina) =>{
    paginaActiva = pagina + 1; // de la actual página + 1
    desde = limite * pagina; //desde = 0 -> limite = 5 -> pagina = 1 -> desde = 5 * 1, posicion 5 del array
    if(desde <= info.length){
        modifyArrayClient();
    }
}

window.nextPage = () =>{
    //code ..
    if(paginaActiva < paginas){
        desde += 5; //siempre nos vamos a ir de 5 en 5 -> 5, 10, 15, 20
        paginaActiva++; // 1,2,3,4
        modifyArrayClient();
    }
}

window.previusPage= () =>{
    if (desde > 0) {
        paginaActiva --;
        desde -=5;
        modifyArrayClient();
    }
}

window.descargarWord = (id_cliente) =>{
    let fileURL = `./src/word/${id_cliente}/mgc_${id_cliente}.docx`;
    console.log(fileURL);
    window.location.href = fileURL;
}

window.descargarPDF = async (id_cliente) => {
    console.log('descargando PDF ' + id_cliente);

    let fileURL = `./src/word/${id_cliente}/mgc_${id_cliente}.pdf`;

    try {
        let response = await fetch(fileURL, { method: 'HEAD' });
        if (response.ok) {
            // El archivo existe → descargar
            window.location.href = fileURL;
        } else {
            alert('El PDF no existe, vuelve a generarlo.');
        }
    } catch (error) {
        alert('Error al verificar el archivo.');
        console.error(error);
    }
};


window.uploadPDF = async (id_cliente, fileInput) => {
    try {
        if (!fileInput.files.length) {
            alert('No has seleccionado ningún archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('editable_pdf', fileInput.files[0]);
        formData.append('id_cliente', id_cliente); //mandar el id_cliente

        const res = await fetch(URL + '/src/php/api.php/pdf_upload', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const result = await res.json();
            alert('Archivo subido con éxito: ' + result.message);
            console.log(result);
            // Opcional: limpiar el input de archivo después de una subida exitosa
            fileInput.value = '';
        } else {
            // Nota: 'response' no estaba definido, así que usamos 'res.status'
            alert('Error al subir el archivo. Estado: ' + res.status);
        }
    } catch (error) {
        alert('Error de red al intentar subir el archivo.');
        console.error(error);
    }
};



cargarCliente();