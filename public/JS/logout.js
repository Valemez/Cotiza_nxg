import { URL } from './env';

// fetch para salir
document.getElementById('crs-btn-exit').addEventListener('click', function (e) {
    e.preventDefault();
    fetch(URL + '/src/php/api.php/logout',
        {
            method: 'POST'
        })
        .then(reponse => reponse.json())
        .then(response => {
            if (response['status'] == 'success') {
                // Limpiar localStorage
                localStorage.clear();
                 console.log('localStorage limpiado');

                // Limpiar todas las cookies
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c.replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    console.log(c);
                });
    
                setTimeout(() => {
                    window.location.replace(URL + '/index.html')
                }, 10000);

            }
        });
});
