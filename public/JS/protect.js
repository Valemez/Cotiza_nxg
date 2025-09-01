import { URL } from "./env.js";
document.addEventListener("DOMContentLoaded", function() {
  fetch(URL + "/src/php/api.php/getUser/" + localStorage.getItem("email")) 
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        let status_user = data.status_user;

        switch(status_user){
          case 0:
            window.location.replace(URL);
            break;
          case 1: //activo
            // window.location.replace(URL + "/public/HTML/home.html");
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