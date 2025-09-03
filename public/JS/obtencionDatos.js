import {URL} from './env';

document.getElementById ('nextBtn').addEventListener ('click', function (e) {
    e.preventDefault ();
    let data = {};
    //Paso 1
    data['logo'] = document.getElementsByTagName ('logo').value;
    data['nombre'] = document.getElementsByTagName ('nombre').value;
    data['destinatario'] = document.getElementsByTagName ('destinatario').value;
    data['puesto'] = document.getElementsByTagName ('puesto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    // Paso 2
    data['servicios'] = document.getElementsByTagName ('servicios').value;
    data['archivo_excel'] = document.getElementsByTagName ('archivo_excel').value;
    data['descripcion_servicio'] = document.getElementsByTagName ('descripcion_servicio').value;
    //Paso 3
    data['numero_colaboradores'] = document.getElementsByTagName ('numero_colaboradores').value;
    data['Estado_republica'] = document.getElementsByTagName ('Estado_republica').value;
    data['Centro_trabajo'] = document.getElementsByTagName ('Centro_trabajo').value;
    data['Operario_maquinaria'] = document.getElementsByTagName ('Operario_maquinaria').value;
    data['Operario_limpieza'] = document.getElementsByTagName ('Operario_limpieza').value;
    data['supervisor'] = document.getElementsByTagName ('supervisor').value;
    data['ayudante_general'] = document.getElementsByTagName ('ayudante_general').value;
    data['Turno_trabajo'] = document.getElementsByTagName ('Turno_trabajo').value;
    //Paso 4
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    data['asunto'] = document.getElementsByTagName ('asunto').value;
    console.log(data);

    // uso del fetch par la comunicación entre el cliente servidor
    fetch(URL + '/src/php/api.php/formulario',
        {
            method: "POST", //protocolo http que se utiliza en el formulario
            // headers: { "Content-type": "application/json;charset-UTF-8"},
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {

            if (response['status'] == 'success') {
                //     console.log(response);
                localStorage.setItem('nombre', response['nombre']);
                localstorage.setItem('logo',response['logo']);
                localstorage.setItem('destinatario',response['destinatario']);
                localstorage.setItem('puesto',response['puesto']);
                localstorage.setItem('asunto',response['asunto']);
                localstorage.setItem('servicios',response['servicios']);
                localstorage.setItem('archivo_excel',response['archivo_excel']);
                localstorage.setItem('descripcion_servicio',response['descripcion_servicio']);
                localstorage.setItem('numero_colaboradores',response['numero_colaboradores']);
                localstorage.setItem('Estado_republica',response['Estado_republica']);
                localstorage.setItem('Centro_trabajo',response['Centro_trabajo']);
                localstorage.setItem('Operario_maquinaria',response['Operario_maquinaria']);
                localstorage.setItem('Operario_limpieza',response['Operario_limpieza']);
                localstorage.setItem('supervisor',response['supervisor']);
                localstorage.setItem('ayudante_general',response['ayudante_general']);
                localstorage.setItem('Turno_trabajo',response['Turno_trabajo']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                // localstorage.setItem('',response['']);
                    // Swal.fire({
                    //     title: "¡Bienvenido!",
                    //     icon: "success",
                    //     draggable: true,
                    //     showConfirmButton: false
                    // });
                setTimeout(() => {
                    window.location.replace(URL + '/formulario.html');
                }, 
            );
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Datos no guardados',
                    text: 'Tus datos no se guardaron, correctamente, por favor infresarlos nuevamente',
                });
            }
            console.log(response);
        });

    
    
