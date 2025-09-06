import { URL } from './env';

document.getElementById('nextBtn').addEventListener('click', function (e) {
    e.preventDefault();
    let data = {};

    // // Función auxiliar para obtener valores de checkboxes
    // function getCheckedValues(name) {
    //     return Array.from(document.getElementsByName(nae))
    //         .filter(checkbox => checkbox.checked)
    //         .map(checkbox => checkbox.value);
    // }

    //Paso 1
    data['logo'] = document.getElementById('logo').value;
    data['nombre'] = document.getElementById('nombre').value;
    data['destinatario'] = document.getElementById('destinatario').value;
    data['puesto'] = document.getElementById('puesto').value;
    data['asunto'] = document.getElementById('asunto').value;

    // Paso 2
    data['servicios'] = document.getElementById('servicios').value;
    data['archivo_excel'] = document.getElementById('archivo').value;
    data['descripcion_servicio'] = document.getElementById('descripcion_servicio').value;

    //Paso 3
    data['numero_colaboradores'] = document.getElementById('numero_colaboradores').value;
    data['Estado_republica'] = document.getElementById('Estado_republica').value;
    data['Centro_trabajo'] = document.getElementById('Centro_trabajo').value;
    data['Operario_maquinaria'] = document.getElementById('Operario_maquinaria').value;
    data['Operario_limpieza'] = document.getElementById('Operario_limpieza').value;
    data['supervisor'] = document.getElementById('supervisor').value;
    data['ayudante_general'] = document.getElementById('ayudante_general').value;
    data['Turno_trabajo'] = document.getElementById('Turno_trabajo').value;

    //Paso 4
    // Uniforme
    data['uniforme_superior'] = getCheckedValues('uniforme_superior[]');
    data['uniforme_inferior'] = getCheckedValues('uniforme_inferior[]');
    data['Numero_dotaciones_anuales_uniforme'] = document.getElementById('Numero_dotaciones_anuales_uniforme').value;

    // EPP
    data['epp_cabeza'] = getCheckedValues('epp_cabeza[]');
    data['epp_cuerpo'] = getCheckedValues('epp_cuerpo[]');
    data['num_dotaciones_anual_epp'] = document.getElementById('num_dotaciones_anual_epp').value;

    // Maquinaria
    data['maquinaria'] = getCheckedValues('maquinaria[]');
    data['num_dotaciones_anual_maquinaria'] = document.getElementById('num_dotaciones_anual_maquinaria').value;

    // Materiales
    data['Materiales'] = document.getElementById('Materiales').value;
    if (data['Materiales'] === 'con_materiales') {
        data['quimicos'] = getCheckedValues('quimicos[]');
        data['jarcieria'] = getCheckedValues('jarcieria[]');
        data['mobiliario'] = getCheckedValues('mobiliario[]');
        data['Fecha_entrega_jarcieria'] = document.getElementById('Fecha_entrega_jarcieria').value;
        data['Fecha_entrega_mobiliario'] = document.getElementById('Fecha_entrega_mobiliario').value;
    }
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
                localStorage.setItem('logo', response['logo']);
                localStorage.setItem('destinatario', response['destinatario']);
                localStorage.setItem('puesto', response['puesto']);
                localStorage.setItem('asunto', response['asunto']);
                localStorage.setItem('servicios', response['servicios']);
                localStorage.setItem('archivo_excel', response['archivo_excel']);
                localStorage.setItem('descripcion_servicio', response['descripcion_servicio']);
                localStorage.setItem('numero_colaboradores', response['numero_colaboradores']);
                localStorage.setItem('Estado_republica', response['Estado_republica']);
                localStorage.setItem('Centro_trabajo', response['Centro_trabajo']);
                localStorage.setItem('Operario_maquinaria', response['Operario_maquinaria']);
                localStorage.setItem('Operario_limpieza', response['Operario_limpieza']);
                localStorage.setItem('supervisor', response['supervisor']);
                localStorage.setItem('ayudante_general', response['ayudante_general']);
                localStorage.setItem('Turno_trabajo', response['Turno_trabajo']);

                // Paso 4
                localStorage.setItem('uniforme_superior', JSON.stringify(response['uniforme_superior']));
                localStorage.setItem('uniforme_inferior', JSON.stringify(response['uniforme_inferior']));
                localStorage.setItem('num_dotaciones_anual_uniforme', response['num_dotaciones_anual_uniforme']);

                localStorage.setItem('epp_cabeza', JSON.stringify(response['epp_cabeza']));
                localStorage.setItem('epp_cuerpo', JSON.stringify(response['epp_cuerpo']));
                localStorage.setItem('num_dotaciones_anual_epp', response['num_dotaciones_anual_epp']);

                localStorage.setItem('maquinaria', JSON.stringify(response['maquinaria']));
                localStorage.setItem('num_dotaciones_anual_maquinaria', response['num_dotaciones_anual_maquinaria']);

                localStorage.setItem('Materiales', response['Materiales']);
                if (response['Materiales'] === 'con_materiales') {
                    localStorage.setItem('quimicos', JSON.stringify(response['quimicos']));
                    localStorage.setItem('jarcieria', JSON.stringify(response['jarcieria']));
                    localStorage.setItem('mobiliario', JSON.stringify(response['mobiliario']));
                    localStorage.setItem('fecha_entrega_jarcieria', response['fecha_entrega_jarcieria']);
                    localStorage.setItem('fecha_entrega_mobiliario', response['fecha_entrega_mobiliario']);
                }

                Swal.fire({
                    title: "¡Datos guardados!",
                    text: "La información se ha guardado correctamente",
                    icon: "success",
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace(URL + '/formulario.html');
                    }
                });
            } else {
                swal.fire({
                    icon: 'error',
                    title: 'Datos no guardados',
                    text: 'Tus datos no se guardaron, correctamente, por favor infresarlos nuevamente',
                });
            }
            console.log(response);
        });
    
});