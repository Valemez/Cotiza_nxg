    import { URL } from './env';

    document.getElementById('btn-inicio-sesion').addEventListener('click', function(e) {
        e.preventDefault();
    let data ={};
    data['usuario'] = document.getElementById('exampleInputEmail1').value;
    data['password'] = document.getElementById('exampleInputPassword1').value;
    data['cookie'] = document.cookie;
    console.log(data);
    
    // uso del fetch par la comunicación entre el cliente servidor
    fetch(URL + '/src/php/api.php/login',
        {
            method: "POST", //protocolo http que se utiliza en el formulario
            headers: { "Content-type": "application/json;charset-UTF-8"},
            body: JSON.stringify(data)
        }
    )

        .then(response => response.json())
        .then(selfdata => {
            
            if(selfdata['status'] == 'success'){
                localStorage.setItem('nombre', selfdata['nombre']);
                localStorage.setItem('email', selfdata['email']);
                // window.location.replace( URL +'formulario.html');
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
});

