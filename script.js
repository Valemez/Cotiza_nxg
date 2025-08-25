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
    const serviceCheckboxes = document.querySelectorAll('input[name="servicios[]"]');
    const equipmentList = document.getElementById('equipment-list');
    const summaryDetails = document.getElementById('summary-details');

    let currentStep = 0;

    // Opciones de equipamiento
    const equipmentOptions = {
        'Guardias Seguridad': ['Raso', 'Ejecutivo','Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Protección personal': ['Raso', 'Ejecutivo','Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Seguridad patrimonial': ['Tactico', 'Jefe de servicio', 'Jefe de turno','Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Custodia mercancia': ['Tactico', 'Ejecutivo', 'Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
    };

    // Inicia formulario
    updateStepDisplay();

    // funcion del botón siguiente
    nextBtn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
            if (currentStep === 1) {
                updateEquipmentList();
            } else if (currentStep === 2) {
                updateSummary();
            }

            if (currentStep < 4) {
                currentStep++;
                updateStepDisplay();
            } else {
                // Reemplazar el submit por la nueva funcion
                submitForm();
            }
        }
        //Obtener el email del input
        getEmailInput();
    });

    // función del boton de atrás
    backBtn.addEventListener('click', function () {
        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });

    // cambio de servicios
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const atLeastOneChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);
            nextBtn.disabled = !atLeastOneChecked;
        });
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
            nextBtn.disabled = currentStep === 1 && !Array.from(serviceCheckboxes).some(cb => cb.checked);
        }

        // Scroll
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // función de los servicios
    function updateEquipmentList() {
        const selectedServices = Array.from(serviceCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let equipmentHTML = '';
        const uniqueEquipment = new Set();

        selectedServices.forEach(service => {
            if (equipmentOptions[service]) {
                equipmentOptions[service].forEach(item => uniqueEquipment.add(item));
            }
        });

        if (uniqueEquipment.size > 0) {
            uniqueEquipment.forEach(item => {
                equipmentHTML += `
                            <div class="crs-checkbox-group">
                                <label class="crs-checkbox-label">
                                    <input type="checkbox" name="equipamiento[]" value="${item}" class="crs-checkbox-input"> ${item}
                                </label>
                            </div>
                        `;
            });
        } else {
            equipmentHTML = '<p>No se requieren equipamientos especiales para los servicios seleccionados</p>';
        }

        equipmentList.innerHTML = equipmentHTML;
    }

    // Resumen de la información
    function updateSummary() {
        const formData = new FormData(form);
        let summaryHTML = `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #001550; margin-bottom: 10px;">Información del cliente</h4>
                        <p><strong>Nombre:</strong> ${formData.get('Nombre')}</p>
                        <p><strong>Empresa:</strong> ${formData.get('Empresa')}</p>
                        <p><strong>Contacto:</strong> ${formData.get('Email')} | ${formData.get('Telefono')}</p>
                        <p><strong>Dirección:</strong> ${formData.get('direccion_Empresa')}</p>
                        <p><strong>Cargo:</strong> ${formData.get('Cargo_Ocupacional')}</p>
                        <p><strong>WhatsApp:</strong> ${formData.get('whatsapp')}</p>   
                        <p><strong>Descripción de la empresa:</strong> ${formData.get('descripcion_Empresa')}</p>
                    </div>
                `;

        // Resumen de tipo de servicio
        const SelectTurno = formData.get('SelectTurno');
        if (SelectTurno) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Tipo de turno</h4>
                            <p>${SelectTurno}</p>
                        </div>
                    `;
        }

        // Resumen de numero de guardias
        const numGuardia = formData.get('num_guardias');
        if (numGuardia) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Numero de guardias</h4>
                            <p>${numGuardia}</p>
                        </div>
                    `;
        }

        // resumen de servicios
        const services = formData.getAll('servicios[]');
        if (services.length > 0) {
            summaryHTML += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #001550; margin-bottom: 10px;">Servicios solicitados</h4>
                            <ul style="padding-left: 20px;">
                                ${services.map(service => `<li>${service}</li>`).join('')}
                            </ul>
                        </div>
                    `;
        }

        // resumen de equipamiento
        const equipment = formData.getAll('equipamiento[]');
        if (equipment.length > 0) {
            summaryHTML += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #001550; margin-bottom: 10px;">Equipamiento requerido</h4>
                            <ul style="padding-left: 20px;">
                                ${equipment.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `;
        }

        // comentarios adicionales
        const comments = formData.get('comentarios');
        if (comments) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Comentarios adicionales</h4>
                            <p>${comments}</p>
                        </div>
                    `;
        }

        summaryDetails.innerHTML = summaryHTML;
    }


    document.getElementById('visita-btn')?.addEventListener('click', function () {
        alert('Solicitud de visita enviada. Nos pondremos en contacto para coordinar la visita.');
        // form.submit();
    });

    document.getElementById('meet-btn')?.addEventListener('click', function () {
        alert('Solicitud de reunión virtual enviada. Recibirá un enlace para la reunión por correo electrónico.');
        // form.submit();
    });

    document.getElementById('cita-btn')?.addEventListener('click', function () {
        alert('Solicitud de cita enviada. Nos pondremos en contacto para confirmar la fecha y hora.');
        // form.submit();
    });

    // Validación del formulario
    function validateStep(step) {
        let isValid = true;

        if (step === 0) {
            // Validacion de los campos del formulario
            const requiredFields = ['Nombre', 'Empresa', 'Email', 'Telefono', 
    'direccion_Empresa', 'Cargo_Ocupacional', 'whatsapp'];
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
                alert('Por favor complete todos los campos requeridos');
            }
        }

        return isValid;
    }
    //se van agregar más datos al localStorage
    function getEmailInput(){
        let input = document.querySelector('#Email');

        // Guardar en localStorage cuando el usuario termine de escribir
        input.addEventListener('blur', function () {
            localStorage.setItem('emailUsuario', input.value);
            // console.log('Email guardado en localStorage:', input.value);
        });
    }

    //función para mostrar los modales
    function submitForm() {
        Swal.fire({
            title: 'Enviando su solicitud...',
            text: 'Por favor, espere un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' 
            }
        })
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                throw new TypeError("No se recibió una respuesta JSON válida del servidor.");
            }
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso! ✅',
                    text: data.message,
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = 'http://localhost/nxg_cotizacion/menu.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error ❌',
                    text: data.message || 'Hubo un problema al enviar el registro. Inténtelo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión 🌐',
                text: 'No se pudo conectar con el servidor. Por favor, revise su conexión a internet.',
                confirmButtonText: 'Aceptar'
            });
        });
    }
    
});