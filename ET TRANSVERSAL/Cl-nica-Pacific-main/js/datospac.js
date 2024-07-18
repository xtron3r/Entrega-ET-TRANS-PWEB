$(document).ready(function() {
    function validarRut(rut) {

        rut = rut.replace(/\./g, '').replace(/\-/g, '');

        var dv = rut.slice(-1);

        var rutSinDV = rut.slice(0, -1);

        if (/^\d+$/.test(rutSinDV) === false) return false;
        var suma = 0;
        var multiplo = 2;

        for (var i = rutSinDV.length - 1; i >= 0; i--) {
            suma += parseInt(rutSinDV.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        
        var dvEsperado = 11 - (suma % 11);
        dvEsperado = (dvEsperado === 11) ? 0 : ((dvEsperado === 10) ? 'K' : dvEsperado);
        if (dvEsperado != dv.toUpperCase()) return false;
        return true;
    }

    var rutInput = $("#rutinput");
    var nombreInput = $("#nombrecom");
    var previsionSelect = $("#prevision");
    var aceptarBtn = $("#aceptarBtn");

    var rutError = $("#rutError");
    var nombreError = $("#nombreError");
    var previsionError = $("#previsionError");

    function actualizarBoton() {
        if (rutInput.val().trim() !== "" && nombreInput.val().trim() !== "" && previsionSelect.val() !== "Seleccione su prevision" && validarRut(rutInput.val().trim())) {
            aceptarBtn.prop("disabled", false);
            rutError.text("");
            nombreError.text("");
            previsionError.text("");
        } else {
            aceptarBtn.prop("disabled", true);
            if (rutInput.val().trim() === "" || !validarRut(rutInput.val().trim())) {
                rutError.text("RUT inválido");
            } else {
                rutError.text("");
            }
            if (nombreInput.val().trim() === "") {
                nombreError.text("El nombre no puede estar vacío");
            } else {
                nombreError.text("");
            }
            if (previsionSelect.val().trim() === "") {
                previsionError.text("Debe seleccionar una prevision");
            } else {
                previsionError.text("");
            }
        }
    }

    rutInput.on("input", actualizarBoton);
    nombreInput.on("input", actualizarBoton);
    previsionSelect.on("change", actualizarBoton);

    aceptarBtn.on("click", function() {
        if (!validarRut(rutInput.val().trim())) {
            alert("El RUT ingresado no es válido.");
        } else {
            // Guarda en el localStorage
            localStorage.setItem("rut", rutInput.val().trim());
            localStorage.setItem("nombre", nombreInput.val().trim());
            localStorage.setItem("prevision", previsionSelect.val().trim());
            window.location.href = "seleccion_hora.html";
        }
    });
});