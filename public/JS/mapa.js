document.addEventListener('DOMContentLoaded', function () {
    const addPinBtn = document.getElementById('add-pin-btn');
    const pinFormModal = document.getElementById('pin-form-modal');
    const pinForm = document.getElementById('pin-form');
    const cancelPinBtn = document.getElementById('cancel-pin');
    const adicionalPinBtn = document.getElementById('adicional-pin');
    const locationsList = document.getElementById('locations-list');
    
    let map = null;
    let addPinMode = false;
    let markers = [];
    let currentMarker = null;
    let markerCount = 0;
    
    // Inicializa el mapa inmediatamente
    initMap();

    // Configurar el mapa para ocupar toda la ventana disponible
    window.addEventListener('resize', function() {
        if (map) {
            map.invalidateSize();
        }
    });

    // Agregar pin
    addPinBtn.addEventListener('click', function() {
        addPinMode = !addPinMode;
        
        if (addPinMode) {
            addPinBtn.style.backgroundColor = '#25ebc0ff';
            addPinBtn.style.color = 'white';
            if (map) map.getContainer().style.cursor = 'crosshair';
        } else {
            addPinBtn.style.backgroundColor = 'white';
            addPinBtn.style.color = 'inherit';
            if (map) map.getContainer().style.cursor = '';
        }
    });

    // Cancelar formulario
    cancelPinBtn.addEventListener('click', function() {
        pinFormModal.style.display = 'none';
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }
    });

    // Enviar formulario
    pinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const Centro_trabajo = document.getElementById('Centro_trabajo').value;
        const Turno_trabajo = document.getElementById('Turno_trabajo').value;
        const operario_maquinaria = document.getElementById('operario_maquinaria').value;
        const operario_limpieza = document.getElementById('operario_limpieza').value;
        const supervisor = document.getElementById('supervisor').value;
        const ayudante_general = document.getElementById('ayudante_general').value;
        
        const lat = document.getElementById('pin-lat').value;
        const lng = document.getElementById('pin-lng').value;
        
        // Guardar la ubicación en el mapa
        saveLocation({
            Centro_trabajo,
            Turno_trabajo,
            operario_maquinaria,
            operario_limpieza,
            supervisor,
            ayudante_general,
            lat,
            lng
        });
        
        // Cerrar el formulario
        pinFormModal.style.display = 'none';
        pinForm.reset();
    });

    // Función para inicializar el mapa
    function initMap() {
        // Coordenadas de ejemplo (prosman)
        const defaultCoords = [19.03814309636677, -98.19428949527715]; // Prosman, Puebla

        // Crear el mapa
        map = L.map('mapa').setView(defaultCoords, 13);

        // Añadir capa de tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Evento para agregar pin al hacer clic en el mapa
        map.on('click', function(e) {
            if (addPinMode) {
                // Colocar un marcador temporal
                if (currentMarker) {
                    map.removeLayer(currentMarker);
                }
                
                // Crear marcador arrastrable
                currentMarker = L.marker(e.latlng, {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: (markerCount + 1).toString(),
                        iconSize: [30, 30]
                    }),
                    draggable: true,
                    autoPan: true
                }).addTo(map);
                
                // Configurar eventos para el marcador
                currentMarker.on('dragend', function() {
                    const position = currentMarker.getLatLng();
                    document.getElementById('pin-lat').value = position.lat;
                    document.getElementById('pin-lng').value = position.lng;
                });
                
                // Mostrar formulario
                document.getElementById('pin-lat').value = e.latlng.lat;
                document.getElementById('pin-lng').value = e.latlng.lng;
                pinFormModal.style.display = 'flex';
                
                // Desactivar modo de agregar pin
                addPinMode = false;
                addPinBtn.style.backgroundColor = 'white';
                addPinBtn.style.color = 'inherit';
                map.getContainer().style.cursor = '';
            }
        });
    }

    // Desactivar modo de agregar pin
    function disableAddPinMode() {
        addPinMode = false;
        addPinBtn.style.backgroundColor = 'white';
        addPinBtn.style.color = 'inherit';
        if (map) {
            map.getContainer().style.cursor = '';
        }
    }

    // Guardar ubicación
    function saveLocation(locationData) {
        markerCount++;
        
        // Eliminar el marcador temporal si existe
        if (currentMarker) {
            map.removeLayer(currentMarker);
            currentMarker = null;
        }
        
        // Crear marcador permanente y arrastrable
        const marker = L.marker([locationData.lat, locationData.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: markerCount.toString(),
                iconSize: [30, 30]
            }),
            draggable: true,
            autoPan: true
        }).addTo(map);
        
        // Popup con información
        marker.bindPopup(`
            <strong>${locationData.name}</strong><br>
            ${locationData.description || 'Sin descripción'}<br>
            <small>${parseFloat(locationData.lat).toFixed(6)}, ${parseFloat(locationData.lng).toFixed(6)}</small>
            <div><small>Arrastra el marcador para ajustar su posición</small></div>
        `);
        
        // Actualizar coordenadas cuando se arrastra el marcador
        marker.on('dragend', function() {
            const position = marker.getLatLng();
            // Actualizar coordenadas en la tabla
            const rows = document.querySelectorAll('.location-row');
            rows.forEach(row => {
                if (row.getAttribute('data-id') == marker._leaflet_id) {
                    const coordsCell = row.querySelector('td:nth-child(2)');
                    coordsCell.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                }
            });
        });
        
        // Guardar referencia
        markers.push(marker);
        
        // Agregar a la tabla
        const row = document.createElement('tr');
        row.className = 'location-row';
        row.setAttribute('data-id', marker._leaflet_id);
        row.innerHTML = `
            <td>${locationData.name}</td>
            <td>${parseFloat(locationData.lat).toFixed(6)}, ${parseFloat(locationData.lng).toFixed(6)}</td>
            <td>
                <button class="delete-btn" data-id="${marker._leaflet_id}">×</button>
            </td>
        `;
        
        locationsList.appendChild(row);
        
        // Evento para eliminar ubicación
        row.querySelector('.delete-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se active el evento de la fila
            const id = this.getAttribute('data-id');
            const markerToRemove = markers.find(m => m._leaflet_id == id);
            if (markerToRemove) {
                map.removeLayer(markerToRemove);
                // Eliminar de la lista de marcadores
                markers = markers.filter(m => m._leaflet_id != id);
            }
            row.remove();
        });
        
        // Evento para centrar en la ubicación
        row.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const markerToFocus = markers.find(m => m._leaflet_id == id);
            if (markerToFocus) {
                const position = markerToFocus.getLatLng();
                map.setView([position.lat, position.lng], 15);
                markerToFocus.openPopup();
            }
        });
        
        // Centrar el mapa en el nuevo marcador
        map.setView([locationData.lat, locationData.lng], 15);
        marker.openPopup();
    }
});