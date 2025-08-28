document.getElementById('btn-inicio-sesion').addEventListener('click', function () { // Cuando el btn-inicio-sesion 
    let data = {};

    function getData() {
        try {
            data['usuario'] = document.getElementById('exampleInputEmail1').value;
            data['password'] = document.getElementById('exampleInputPassword1').value;
            data['cookie'] = document.cookie;
        } catch (error) {
            console.log(error);
        }
    }

    function sendData() {
        // uso del fetch par la comunicación entre el cliente servidor
        getData();
        try {
            fetch(URL + '/src/php/api.php',
                {
                    method: "POST", //protocolo http que se utiliza en el formulario
                    headers: { "Content-type": "application/json;charset-UTF-8" },
                    body: JSON.stringify(data)
                }
            )

                .then(response => response.json())
                .then(selfdata => {

                    if (selfdata['status'] == 'success') {
                        localStorage.setItem('nombre', selfdata['nombre']);
                        localStorage.setItem('email', selfdata['email']);
                        window.location.replace(URL + '/formulario.html');
                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Datos incorrectos',
                            text: 'Tus datos de acceso son incorrectos, por favor verifica',
                        });
                    }
                    console.log(selfdata);
                }
                );
        } catch (error) {
            console.log(error);
        }

    }

    sendData();

});