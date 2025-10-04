document.addEventListener('DOMContentLoaded', function () {
    // Acordeón
    document.querySelectorAll('.accordion').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
            let panel = this.nextElementSibling;
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
    });

    
    // Flujo de colaboradores
    let iniciarBtn = document.getElementById('btn-iniciar');
    let colaboradoresInput = document.getElementById('num-colaboradores');
    let seccionColaboradores = document.getElementById('seccion-colaboradores');
    let contadorSpan = document.getElementById('contador-colaboradores');
    let registrarBtn = document.getElementById('btn-registrar');
    let enviarBtn = document.getElementById('btn-enviar');
    let colaboradoresRestantes = 0;
    let colaboradoresData = [];

    iniciarBtn.addEventListener('click', function () {
        colaboradoresRestantes = parseInt(colaboradoresInput.value, 10);
        colaboradoresInput.setAttribute('readonly', true);
        contadorSpan.textContent = colaboradoresRestantes;
        seccionColaboradores.classList.remove('hidden');
        iniciarBtn.disabled = true;
    });

    registrarBtn.addEventListener('click', function () {
        // Validaciones básicas
        let turno = document.getElementById('tipo-turno').value;
        let tipo = document.getElementById('tipo-colaborador').value;
        if (!turno || !tipo) {
            alert('Seleccione tipo de turno y colaborador');
            return;
        }
        // Recopila datos del colaborador (simplificado)
        let colaborador = {
            turno,
            tipo,
            // Recoge los checkboxes seleccionados de cada panel
            uniforme: Array.from(document.querySelectorAll('.panel')[0].querySelectorAll('input[type=checkbox]:checked')).map(e => e.value),
            epp: Array.from(document.querySelectorAll('.panel')[1].querySelectorAll('input[type=checkbox]:checked')).map(e => e.value),
            maquinaria: Array.from(document.querySelectorAll('.panel')[2].querySelectorAll('input[type=checkbox]:checked')).map(e => e.value),
            materiales: Array.from(document.querySelectorAll('.panel')[3].querySelectorAll('input[type=checkbox]:checked')).map(e => e.value)
        };
        colaboradoresData.push(colaborador);
        colaboradoresRestantes--;
        contadorSpan.textContent = colaboradoresRestantes;
        // Limpia los campos del colaborador
        document.getElementById('tipo-turno').value = '';
        document.getElementById('tipo-colaborador').value = '';
        document.querySelectorAll('.panel input[type=checkbox]').forEach(cb => cb.checked = false);
        if (colaboradoresRestantes <= 0) {
            registrarBtn.disabled = true;
            enviarBtn.classList.remove('hidden');
        }
    });

    // Envío AJAX
    enviarBtn.addEventListener('click', function (e) {
        e.preventDefault();
        let centroTrabajo = document.getElementById('centro-trabajo').value;
        let lat = document.getElementById('pin-lat').value;
        let lng = document.getElementById('pin-lng').value;
        let data = {
            centroTrabajo,
            lat,
            lng,
            colaboradores: colaboradoresData
        };
        fetch('public/PHP/guardar_cotizacion.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert('Cotización enviada correctamente');
                location.reload();
            } else {
                alert('Error al enviar');
            }
        });
    });


});

// Mostrar/ocultar materiales según selección
document.getElementById('Materiales').addEventListener('change', function () {
    const materialesContainer = document.getElementById('materiales-container');
    materialesContainer.style.display = this.value === 'con_materiales' ? 'block' : 'none';
});
