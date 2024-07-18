$(document).ready(function() {   
    $('#FormLogin').validate({
        rules: {
            FormUsu: {
                required: true,
                minlength: 5,
            },
            FormContra: {
                required: true,
            }
        },
        messages: {
            FormUsu: {
                required: "Por favor ingrese Usuario",
                minlength: "El mínimo de caracteres es 5",
            },
            FormContra: {
                required: "Por favor ingrese contraseña",
            }
        },
        submitHandler: function(form) {
            var usuario = $("#FormUsu").val();
            var contrasena = $("#FormContra").val();

            // Datos para enviar por AJAX

            $.ajax({
                url: 'http://127.0.0.1:8000/api/login/', 
                type: 'POST',
                data: {
                    username: usuario,
                    password: contrasena
                },
                success: function(response) {
                    alert('Inicio de sesión exitoso');
                    redi();
                },
                error: function(xhr, status, error) {
                    alert('Error: ' + xhr.responseText);
                }
            });
        }
    });
});

function redi(){
    window.location.href = "admin.html";
}