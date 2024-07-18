$(document).ready(function(){
    // Validacion del formulario de contacto
    $('#contactform').validate({
        rules:{
            formMotivo: {
                required: true,
                minlength: 10,
                maxlength: 100
            },
            formNombre:{
                required: true,
                minlength: 5,
                maxlength: 80
            },
            formEmail:{
                required: true,
                email: true,
                minlength: 5,
                maxlength: 50
            },
            formTelefono:{
                required: true,
                number: true,
                minlength: 9,
                maxlength: 9
            },
            formTextarea:{
                required: true,
                minlength: 10
            }
        },
        messages: {
            formMotivo: {
                required: 'Por favor ingrese un motivo',
                minlength: 'El motivo debe tener al menos 10 caracteres',
                maxlength: 'El motivo debe tener como máximo 100 caracteres'
            },
            formNombre:{
                required: 'Por favor ingrese su nombre',
                minlength: 'El nombre debe tener al menos 2 caracteres',
                maxlength: 'El nombre debe tener como máximo 50 caracteres'
            },
            formEmail:{
                required: 'Por favor ingrese su email',
                email: 'Por favor ingrese un email válido',
                minlength: 'El email debe tener al menos 5 caracteres',
                maxlength: 'El email debe tener como máximo 50 caracteres'
            },
            formTelefono:{
                required: 'Por favor ingrese su teléfono',
                minlength: 'El teléfono debe tener al menos 9 caracteres',
                maxlength: 'El teléfono debe tener como máximo 9 caracteres',
                number: 'Por favor ingrese un teléfono válido (CHILE)'
            },
            formTextarea:{
                required: 'Por favor ingrese un mensaje',
                minlength: 'El mensaje debe tener al menos 10 caracteres'
            }
        },
        submitHandler: function(form) {

            //API EMAILJS
             
            var boton = $('#buttonenvi');

            const nombre = $('#formNombre').val();
            const motivo = $('#formMotivo').val();
            const email = $('#formEmail').val();
            const telefono = $('#formTelefono').val();
            const textarea = $('#formTextarea').val();
            
            boton.val("ENVIANDO...")

            console.log(boton)

            var data = {
                nombrec: nombre,
                motivo: motivo,
                telefono: telefono,
                email: email,
                mensaje: textarea
            };

            emailjs.send('service_jthig8r', 'template_4iqdewa', data).then(
                (response) => {
                    boton.val("ENVIAR")
                    alert('ENVIADO CORRECTAMENTE!');               
                    addcontacto();
                    console.log('SUCCESS!', response.status, response.text);

                    $.ajax({
                        url: "http://localhost:8000/api/contacto/",
                        type: "POST",
                        data: JSON.stringify(data), 
                        contentType: "application/json",
                        success: function(response) {
                            boton.val("ENVIAR");
                            console.log('SUCCESS!', response);
                            form.reset();
                        },
                        error: function(error) {
                            boton.val("ENVIAR");
                            alert('No se pudo enviar el formulario!');
                            console.log('FAILED...', error);
                        }
                    });
                    form.reset();
                },
                (error) => {
                    boton.val("ENVIAR")
                    alert('No se pudo enviar el formulario!');
                    console.log('FAILED...', error);
                }
            );  
            return false; // Previene la recarga de la pagina
        }
    });
});

function addcontacto(){
    var nombre = $('#formNombre').val();
    var motivo = $('#formMotivo').val();
    var email = $('#formEmail').val();
    var telefono = $('#formTelefono').val();
    var textarea = $('#formTextarea').val();
    var contacto = { nombre,motivo,email,telefono,textarea}

    guardarLocalStorages(contacto);
}
function guardarLocalStorages(contacto){
    var contactos = localStorage.getItem('contactos') ? JSON.parse(localStorage.getItem('contactos')) : [];
    contactos.push(contacto);
    localStorage.setItem('contactos', JSON.stringify(contactos));
}