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
    const contenido = `
            <td scope="row">${cliente.id_cliente}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.asunto}</td>
            <td>${cliente.created_at}</td>
            <td>
                <button type="button" class="btn  btn-outline-info btn-sm word">
                    <i class="fa-solid fa-file-word"></i>
                </button>
                <button type="button" class="btn  btn-outline-danger btn-sm pdf">
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
            </td>
        `;
        fila.innerHTML = contenido;
        cuerpoTabla.append(fila);
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

cargarCliente();