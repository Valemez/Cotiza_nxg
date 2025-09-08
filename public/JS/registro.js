import { URL } from './env';

document.getElementById('btn-registrar').addEventListener('click', function (e) {
    e.preventDefault();
    let data = {};
    data['nombre'] = document.getElementById('registro-nombre').value;
    data['email'] = document.getElementById('registro-email').value;
    data['password'] = document.getElementById('registro-password').value;
    console.log(data);

    // uso del fetch par la comunicación entre el cliente servidor
    fetch(URL + '/src/php/api.php/registro',
        {
            method: "POST", //protocolo http que se utiliza en el formulario
            // headers: { "Content-type": "application/json;charset-UTF-8"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(selfdata => {

            if (selfdata['status'] == 'success') {
                //   console.log('ingreso correcto');
                //     console.log(selfdata);
                localStorage.setItem('nombre', selfdata['nombre']);
                localStorage.setItem('email', selfdata['email']);
                localStorage.setItem('password', selfdata['password']);
                    Swal.fire({
                        title: "¡Registro exitoso!",
                        icon: "success",
                        draggable: true,
                        showConfirmButton: false
                    });
                setTimeout(() => {
                    window.location.replace(URL + '/index.html');
                }, 
            );
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Datos incorrectos',
                    text: 'Tus datos de acceso son incorrectos, por favor verifica',
                });
            }
            // console.log(selfdata);
        });
});
