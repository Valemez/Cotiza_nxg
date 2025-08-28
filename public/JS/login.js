import { URL } from './env.js';

document.getElementById('btn-inicio-sesion').addEventListener('click', function () { // se agrega un evento al boton btn-inicio-sesion y se ejecuta una función al hacer clic
    let data = {};   // se crea un objeto vacio (variable global) para almacenar los datos del formulario
    data['usuario'] = document.getElementById('exampleInputEmail1').value; // se obtiene el valor del input exampleInputEmail1  
    data['password'] = document.getElementById('exampleInputPassword1').value;  // se obtiene el valor del input exampleInputPassword1
    data['cookie'] = document.cookie;   // se obtiene el valor de la cookie
    console.log(data);  // se muestra en consola los datos del formulario

    // uso del fetch par la comunicación entre el cliente servidor
    fetch(URL + '/src/php/api.php/login',
        {
            method: "POST", //protocolo http que se utiliza en el formulario
            headers: { "Content-type": "application/json;charset-UTF-8" }, // tipo de datos que se envian
            body: JSON.stringify(data)  // datos que se envian al servidor en formato json
        }
    )

        .then(response => response.json())  // respuesta del servidor en formato json
        .then(selfdata => { // datos que se reciben del servidor

            if (selfdata['status'] == 'success') { // si el estado es success se redirecciona al formulario
                localStorage.setItem('nombre', selfdata['nombre']);
                localStorage.setItem('email', selfdata['email']);
                window.location.replace(URL + '/formulario.html');
            } else {    // si el estado es error se muestra un mensaje de error
                swal.fire({
                    icon: 'error',
                    title: 'Datos incorrectos',
                    text: 'Tus datos de acceso son incorrectos, por favor verifica',
                });
            }
            console.log(selfdata);  // se muestra en consola los datos recibidos del servidor
        }
        );
});

