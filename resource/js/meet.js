document.addEventListener('DOMContentLoaded', function () {
    const URL = 'http://localhost/nxg_cotizacion';
    // Si quieres que se recargue con el valor guardado al entrar
    const emailGuardado = localStorage.getItem('emailUsuario');
    console.log('Email guardado al cargar:', emailGuardado);


    document.getElementById('inicio')?.addEventListener('click', function () {
        // Redirigir al inicio
        window.location.href = URL;
    })

    //funcion para enviar el correo
    document.getElementById('meet-btn')?.addEventListener('click', function () {
        fetch(URL + '/backend/correo-meet.php', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `correo=${encodeURIComponent(emailGuardado)}`
        })
        .then(response => response.text())
    });


    
});

/*
 - Ya tengo el correo
 - Ahora tengo que mandar el correo al php para ver si si existe en la base de datos
 - Si existe, que se mande un correo a Marco 
 */