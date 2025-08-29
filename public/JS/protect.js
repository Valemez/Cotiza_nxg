$(document).ready(function () {
    fetch(URL + "/src/api.php/getColaborador/" + localStorage.getItem("email"))
      .then((response) => response.json())
      .then((data) => {
        let status_activo = data.status;

        switch(status_activo){
          case "0":
            // statusContractHide(status_contract);
            break;
          case "1": //inactivo: que lo saque
            window.location.replace(URL);
            break;
          default:
            window.location.replace(URL);
            break;
        }

      });
  });
/*
  //reconocimiento de vehículos
  reconocimiento facia l
  factores en tiempos de respuesta
  boton de panico
  sistema de alerta
  casetas enfoque a vehículos

  *Lluvia de ideas 
  investigación eprsonal 
  aplicaciones de seguimiento

  */