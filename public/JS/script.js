//iniciar el tour introductorio
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

// Datos de centros de trabajo por estado
const centrosTrabajo = {
    Aguascalientes: ["Aguascalientes Centro", "Aguascalientes Norte", "Aguascalientes Sur"],
    Baja_California: ["Tijuana", "Mexicali", "Ensenada"],
    Baja_California_Sur: ["La Paz", "Cabo San Lucas", "San José del Cabo"],
    Campeche: ["Campeche Centro", "Ciudad del Carmen", "Champotón"],
    Ciudad_de_México: ["Alcaldía Cuauhtémoc", "Alcaldía Benito Juárez", "Alcaldía Miguel Hidalgo"],
    Coahuila: ["Saltillo", "Torreón", "Monclova"],
    Colima: ["Colima", "Manzanillo", "Tecomán"],
    Chiapas: ["Tuxtla Gutiérrez", "Tapachula", "San Cristóbal de las Casas"],
    Chihuahua: ["Chihuahua", "Juárez", "Cuauhtémoc"],
    Durango: ["Durango", "Gómez Palacio", "Lerdo"],
    Estado_de_México: ["Toluca", "Ecatepec", "Nezahualcóyotl"],
    Guanajuato: ["León", "Irapuato", "Celaya"],
    Guerrero: ["Acapulco", "Chilpancingo", "Iguala"],
    Hidalgo: ["Pachuca", "Tulancingo", "Tizayuca"],
    Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque"],
    Michoacán: ["Morelia", "Uruapan", "Zamora"],
    Morelos: ["Cuernavaca", "Jiutepec", "Cuautla"],
    Nayarit: ["Tepic", "Xalisco", "Santiago Ixcuintla"],
    Nuevo_León: ["Monterrey", "San Pedro Garza García", "Guadalupe"],
    Oaxaca: ["Oaxaca", "Salina Cruz", "Juchitán"],
    Puebla: ["Puebla", "Tehuacán", "San Martín Texmelucan"],
    Querétaro: ["Querétaro", "San Juan del Río", "Corregidora"],
    Quintana_Roo: ["Cancún", "Chetumal", "Playa del Carmen"],
    San_Luis_Potosí: ["San Luis Potosí", "Soledad", "Ciudad Valles"],
    Sinaloa: ["Culiacán", "Mazatlán", "Los Mochis"],
    Sonora: ["Hermosillo", "Ciudad Obregón", "Nogales"],
    Tabasco: ["Villahermosa", "Cárdenas", "Comalcalco"],
    Tamaulipas: ["Reynosa", "Matamoros", "Nuevo Laredo"],
    Tlaxcala: ["Tlaxcala", "Apizaco", "Chiautempan"],
    Veracruz: ["Veracruz", "Xalapa", "Coatzacoalcos"],
    Yucatán: ["Mérida", "Valladolid", "Progreso"],
    Zacatecas: ["Zacatecas", "Fresnillo", "Guadalupe"]
};

// Función para mostrar los centros de trabajo según el estado seleccionado
function mostrarEstados() {
    const estadoSelect = document.getElementById('Estado_republica');
    const centroSelect = document.getElementById('Centro_trabajo');
    const estado = estadoSelect.value.replace(/ /g, '_'); // Reemplazar espacios por guiones bajos

    // Limpiar opciones actuales
    centroSelect.innerHTML = '<option value="">--- Seleccione centro de trabajo ---</option>';

    // Agregar nuevas opciones según el estado seleccionado
    if (estado && centrosTrabajo[estado]) {
        centrosTrabajo[estado].forEach(centro => {
            const option = document.createElement('option');
            option.value = centro;
            option.textContent = centro;
            centroSelect.appendChild(option);
        });
    }
}

// Mostrar/ocultar materiales según selección
document.getElementById('Materiales').addEventListener('change', function () {
    const materialesContainer = document.getElementById('materiales-container');
    materialesContainer.style.display = this.value === 'con_materiales' ? 'block' : 'none';
});

// Agregar event listener para el cambio de estado
document.getElementById('Estado_republica')?.addEventListener('change', mostrarEstados);

document.addEventListener('DOMContentLoaded', function () {
    // elementos
    const stepMenus = [
        document.querySelector('.crs-step-menu1'),
        document.querySelector('.crs-step-menu2'),
        document.querySelector('.crs-step-menu3'),
        document.querySelector('.crs-step-menu4'),
        document.querySelector('.crs-step-menu5')
    ];

    const steps = [
        document.querySelector('.crs-form-step-1'),
        document.querySelector('.crs-form-step-2'),
        document.querySelector('.crs-form-step-3'),
        document.querySelector('.crs-form-step-4'),
        document.querySelector('.crs-form-step-5')
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
            if (currentStep === 4) {
                updateSummary();
            }

            if (currentStep < 4) {
                currentStep++;
                updateStepDisplay();
            } else {
                form.submit();
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

        if (currentStep === 4) {
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
        const numColaboradores = formData.get('numero_colaboradores');
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
    function validateStep(step) {
        let isValid = true;

        if (step === 0) {
            // Validacion de los campos del formulario
            const requiredFields = ['logo', 'nombre', 'destinatario', 'puesto', 'asunto'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                } else {
                    field.style.borderColor = '#DDE3EC';
                }
            });

            if (!isValid) {
                Swal.fire({
                    title: 'Datos incompletos',
                    text: 'Por favor, complete todos los campos obligatorios.',
                    icon: 'warning',
                    iconColor: '#001550',
                    confirmButtonText: 'Entendido'
                });
            }
        }

        return isValid;
    }
});