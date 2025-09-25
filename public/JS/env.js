// export const URL = "http://localhost/cotiza_nxg" //192.168.2.138 --- misael 
export const URL = "http://localhost:8080/cotiza_nxg" //192.168.2.138 --- misael 
// export const URL = "http://intranetipm.ddns.net:5000/cotiza_nxg" //192.168.2.138 --- misael  

export const getData = async (endpoint) =>{
    try {
        const res = await fetch(endpoint);
        if(!res.ok) throw new Error("Error HTTP: " + res.status);
        const data = await res.json();
        return data;
        // const text = await res.text();
        // console.log("Respuesta cruda: " , text);
    } catch (error) {
        console.error("Error en getData:", error);
        return error
    }
}

