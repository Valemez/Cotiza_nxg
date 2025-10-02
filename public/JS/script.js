//iniciar el tour introductorio
import { URL } from "./env.js";
introJs.tour().onbeforeexit(function () {
    Swal.fire({
                    title: '¡IMPORTANTE!',
                    text: "ANTES DE CERRAR DEBES TERMINAR EL RECORRIDO GUIADO, ¿DESEAS CONTINUAR?",
                    icon: 'warning',
                    iconColor: '#001550',
                    confirmButtonText: 'Entendido'
                });
    //return confirm("ANTES DE CERRAR DEBES TERMINAR EL RECORRIDO GUIADO, ¿DESEAS CONTINUAR?");
}).start()


// Mostrar/ocultar materiales según selección
// document.getElementById('Materiales').addEventListener('change', function () {
//     const materialesContainer = document.getElementById('materiales-container');
//     materialesContainer.style.display = this.value === 'con_materiales' ? 'block' : 'none';
// });

document.addEventListener('DOMContentLoaded', function () {
    // elementos
    const stepMenus = [
        document.querySelector('.crs-step-menu1'),
        document.querySelector('.crs-step-menu2'),
        document.querySelector('.crs-step-menu3'),
        document.querySelector('.crs-step-menu4')
    ];

    const steps = [
        document.querySelector('.crs-form-step-1'),
        document.querySelector('.crs-form-step-2'),
        document.querySelector('.crs-form-step-3'),
        document.querySelector('.crs-form-step-4')
    ];

    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const form = document.querySelector('form');
    const summaryDetails = document.getElementById('summary-details');

    let currentStep = 0;

    // Inicia formulario
    updateStepDisplay();

    // funcion del botón siguiente
    nextBtn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
            if (currentStep === 2) {
                updateSummary();
            }

            if (currentStep < 3) {
                currentStep++;
                updateStepDisplay();
            } else {
                sendForm();
            }
        }
    });

    // función del boton de atrás
    backBtn.addEventListener('click', function () {
        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });

    // Función para mandar el formulario de tipo fetch
    async function sendForm() {
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                // alert(data.message);
                Swal.fire({
                    title: "Datos insertados con éxito!",
                    icon: "success",
                    draggable: true,
                    button: false
                });
                setTimeout(() => {
                    // window.location.href = URL + '/formulario.html';
                    console.log('Hi world!');
                }, 1000);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo un error, por favor, llena todos los campos!", //+ data.message,
                });
                // alert('Error: ' + data.message);
            }
        } catch (error) {
            // console.log('Error 45: '+ error);
            Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo un error: " + error, //+ data.message,
                });
        }
    }

    // Actualizar la vista del formulario
    function updateStepDisplay() {
        // actualiza los menus
        stepMenus.forEach((menu, index) => {
            if (index === currentStep) {
                menu.classList.add('active');
            } else {
                menu.classList.remove('active');
            }
        });

        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // funcion del boton
        backBtn.style.display = currentStep > 0 ? 'block' : 'none';

        if (currentStep === 3) {
            nextBtn.textContent = 'Enviar';
        } else {
            nextBtn.textContent = 'Siguiente';
        }

        // Scroll
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Resumen de la información
    function updateSummary() {
        const formData = new FormData(form);
        let summaryHTML = `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #001550; margin-bottom: 10px;">Información de la empresa</h4>
                            <p><strong>Empresa:</strong> ${formData.get('nombre')}</p>
                            <p><strong>Destinatario:</strong> ${formData.get('destinatario')}</p>
                            <p><strong>Puesto:</strong> ${formData.get('puesto')}</p>
                            <p><strong>Asunto:</strong> ${formData.get('asunto')}</p>
                        </div>
                    `;

        // Resumen de servicios
        const servicio = formData.get('servicios');
        if (servicio) {
            summaryHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #001550; margin-bottom: 10px;">Servicio solicitado</h4>
                                <p>${servicio}</p>
                            </div>
                        `;
        }

        // Resumen de descripción del servicio
        const descripcion = formData.get('descripcion_servicio');
        if (descripcion) {
            summaryHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #001550; margin-bottom: 10px;">Descripción del servicio</h4>
                                <p>${descripcion}</p>
                            </div>
                        `;
        }

        // Resumen de colaboradores
        const numColaboradores = formData.get('numero_colaborador'); //numero_colaboradores
        if (numColaboradores) {
            summaryHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #001550; margin-bottom: 10px;">Personal requerido</h4>
                                <p><strong>Número de colaboradores:</strong> ${numColaboradores}</p>
                                <p><strong>Supervisores:</strong> ${formData.get('supervisor') || 0}</p>
                                <p><strong>Operarios de limpieza:</strong> ${formData.get('operario_limpieza') || 0}</p>
                                <p><strong>Ayudantes generales:</strong> ${formData.get('Ayudante_general') || 0}</p>
                                <p><strong>Operarios de maquinaria:</strong> ${formData.get('Operario_maquinaria') || 0}</p>
                                <p><strong>Turno de trabajo:</strong> ${formData.get('Turno_trabajo')} horas</p>
                            </div>
                        `;
        }

        // Resumen de ubicación
        const estado = formData.get('Estado_republica');
        const centro = formData.get('Centro_trabajo');
        if (estado && centro) {
            summaryHTML += `
                            <div style="margin-bottom: 20px;">
                                <h4 style="color: #001550; margin-bottom: 10px;">Ubicación</h4>
                                <p><strong>Estado:</strong> ${estado}</p>
                                <p><strong>Centro de trabajo:</strong> ${centro}</p>
                            </div>
                        `;
        }

        summaryDetails.innerHTML = summaryHTML;
    }

    // Validación del formulario
    // function validateStep(step) {
    //     let isValid = true;

    //     if (step === 0) {
    //         // Validacion de los campos del formulario
    //         const requiredFields = ['logo', 'nombre', 'destinatario', 'puesto', 'asunto'];
    //         requiredFields.forEach(fieldId => {
    //             const field = document.getElementById(fieldId);
    //             if (!field.value.trim()) {
    //                 field.style.borderColor = 'red';
    //                 isValid = false;
    //             } else {
    //                 field.style.borderColor = '#DDE3EC';
    //             }
    //         });

    //         // Mostrar términos y condiciones en el último paso
    //         if (step === 4) {
    //             Swal.fire({
    //                 title: 'Términos y Condiciones',
    //                 html: `<div style="text-align:left;max-height:250px;overflow-y:auto;">
    //                 <p>Al enviar este formulario, aceptas los términos y condiciones de uso del servicio. Por favor, lee cuidadosamente antes de continuar.</p>
    //                 <p>1. La información proporcionada será utilizada únicamente para fines de cotización.</p>
    //                 <p>2. Nos comprometemos a proteger tus datos personales conforme a la ley.</p>
    //                 <p>3. El envío del formulario no garantiza la prestación del servicio.</p>
    //                 <br>
    //                 <label>
    //                     <input type="checkbox" id="acepto_terminos_sw" />
    //                     Acepto los términos y condiciones
    //                 </label>
    //             </div>`,
    //                 icon: 'info',
    //                 iconColor: '#001550',
    //                 confirmButtonText: 'Continuar',
    //                 preConfirm: () => {
    //                     const checkbox = Swal.getPopup().querySelector('#acepto_terminos_sw');
    //                     if (!checkbox.checked) {
    //                         Swal.showValidationMessage('Debes aceptar los términos y condiciones para continuar.');
    //                         return false;
    //                     }
    //                     return true;
    //                 }
    //             }).then((result) => {
    //                 if (!result.isConfirmed) {
    //                     isValid = false;
    //                 }
    //             });
    //         }

    //         return isValid;

    //         if (!isValid) {
    //             Swal.fire({
    //                 title: 'Datos incompletos',
    //                 text: 'Por favor, complete todos los campos obligatorios.',
    //                 icon: 'warning',
    //                 iconColor: '#001550',
    //                 confirmButtonText: 'Entendido'
    //             });
    //         }
    //     }

    //     return isValid;
    // }

    // función de validación en un solo lugar
function validateStep(step) {
    let isValid = true;
    let requiredFields = [];

    switch (step) {
        case 0:
            requiredFields = ['nombre', 'destinatario', 'puesto', 'asunto'];
            // Nota: La validación de 'logo' (archivo) es más compleja, pero por ahora validamos los de texto.
            break;

        case 1: // Validación del Paso 2: Detalles del servicio
            requiredFields = ['servicios', 'descripcion_servicio'];
            break;

        case 2: // Validación del Paso 3: Detalles de colaboradores (¡AQUÍ ESTÁ!)
            // requiredFields = ['numero_colaborador', 'Estado_republica', 'Centro_trabajo', 'Turno_trabajo'];
            break;
            
        case 3: // Validación del Paso 4: Equipos y materiales
            // Agrega aquí los campos obligatorios del paso 4 si los tienes
            // requiredFields = ['algun_campo_del_paso_4'];
            break;

        case 4: // Último paso: Mostrar términos y condiciones antes de enviar
            // No hay campos que validar, pero podrías tener lógica aquí
            break;
    }

    // --- Lógica de validación ---
    if (requiredFields.length > 0) {
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) { // Comprueba si el campo existe y tiene valor
                if (field) {
                    field.style.borderColor = 'red'; // Marca el campo vacío en rojo
                }
                isValid = false;
            } else {
                if (field) {
                    field.style.borderColor = '#DDE3EC'; // Restaura el borde si está lleno
                }
            }
        });
    }

    // --- Mostrar alerta de error  ---
    if (!isValid) {
        Swal.fire({
            title: 'Datos incompletos',
            text: 'Por favor, completa todos los campos marcados en rojo.',
            icon: 'warning',
            iconColor: '#001550',
            confirmButtonText: 'Entendido'
        });
    }

    return isValid;
}
});

// Inicializar tooltips
document.querySelectorAll('.help-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.querySelector('.tooltip').style.visibility = 'visible';
        this.querySelector('.tooltip').style.opacity = '1';
    });

    icon.addEventListener('mouseleave', function () {
        this.querySelector('.tooltip').style.visibility = 'hidden';
        this.querySelector('.tooltip').style.opacity = '0';
    });
});

function verFoto(tipo) {
    const fotos = {
        'bata_casaca': './public/Assets/logos/347_detras.jpg',
        'playera_polo_manga_larga': './public/Assets/fotos/playera_polo_manga_larga.png',
        // Agrega las rutas de las fotos para cada ítem
        // ...
    };
    document.getElementById('foto-modal-img').src = fotos[tipo] || '';
    document.getElementById('foto-modal').style.display = 'flex';
}

window.verFoto = verFoto;

document.getElementById('archivo').addEventListener('change', function (e) {
    if (this.files.length > 5) {
        Swal.fire({
            icon: 'warning',
            title: 'Límite de archivos',
            text: 'Solo puedes subir hasta 5 archivos.'
        });
        this.value = ''; // Limpia la selección
    }
});