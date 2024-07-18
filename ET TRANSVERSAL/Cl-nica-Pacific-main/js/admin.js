$(document).ready(function() {

    // Variable para saber si ya han sido cargados y evitar duplicado 
    var contactosCargados = false;
    var medicosCargados = false;
    var pacientesCargados = false;

    

    // VISTAS DEl ADMINISTRADOR
    $('#contacto').hide();
    $('#pacientes').hide();
    $('#medicos').hide();
    $('#AgregMedico').hide();

    $('#btn-limpiar').click(function() {
        $('#pacientes').hide();
        $('#contacto').hide();
        $('#medicos').hide();
        $('#AgregMedico').hide();
    });

    $('#btn-agregarM').click(function() {
        $('#AgregMedico').show();
        $('#contacto').hide();
        $('#pacientes').hide();
        $('#medicos').hide();
    });

    $('#btn-cancelarM').click(function() {
        $('#medicos').show();
        $('#pacientes').hide();
        $('#contacto').hide();
        $('#AgregMedico').hide();
    });

    // CONTACTO

    $('#btn-contacto').click(function() {
        $('#contacto').show();
        $('#pacientes').hide();
        $('#medicos').hide();
        $('#AgregMedico').hide();
        
        if (!contactosCargados) {
            cargarContactos();
            contactosCargados = true; // Marcar los contactos como cargados
        }
        
        //localStorage.clear();
    });
    $('#actualizarPag').click(function() {
        cargarContactos();
    });


    //MEDICO

    $('#btn-guardarM').click(function(){
        $('#formMedico').validate({
            rules:{
                rutinput:{
                    required: true,
                    number: true,
                    minlength: 9,
                    maxlength:9
                },
                nombreMedico:{
                    required: true,
                    minlength: 5,
                    maxlength: 80
                },
                nombreEspecialidad:{
                    required:true
                }            
            },
            messages:{
                rutinput:{
                    required: "Por Favor ingrese rut ",
                    number: "Por favor ingrese solo numeros",
                    minlength: "El minimo de caracteres es 9",
                    maxlength: "El maximo de caracteres es 9"
                },
                nombreMedico:{
                    required: "Por Favor ingrese nombre del medico ",
                    minlength: "El minimo de caracteres es 5",
                    maxlength: "El maximo de caracteres es 80"
                },
                nombreEspecialidad:{
                    required: "Porfavor ingrese especialidad"
                }

            },
            submitHandler: function(form) {

                var data = {
                    rut_medico : $('#rutinput').val(),
                    nombrem : $('#nombreMedico').val(),
                    especialidad : $('#nombreEspecialidad').val(),
                    disponibilidad : $('#Disponibilidad').val(),
                };

                $.ajax({
                    url: "http://localhost:8000/api/medico/",
                    type: "POST",
                    data: JSON.stringify(data), 
                    contentType: "application/json",
                    success: function(response) {
                        console.log('SUCCESS!', response);
                        alert('Medico agregado correctamente')
                        form.reset();
                    },
                    error: function(error) {
                        alert('No se pudo agregar el medico!');
                        console.log('FAILED...', error);
                    }
                });
                
                addmedico();
                form.reset();
                return false; // Previene la recarga de la pagina
            }
        }); 
    });

    $('#btn-medico').click(function() {
        $('#medicos').show();
        $('#contacto').hide();
        $('#pacientes').hide();
        $('#AgregMedico').hide();

        if (!medicosCargados) {
            cargarMedicos();
            medicosCargados = true; // Marcar los medicos como cargados
        }
    });
    
    $('#buscarRut').click(function() {
        var rut = $('#dondevarut').val(); // Obtener el valor del campo de entrada
        if (rut.trim() === '') {
            cargarMedicos(); // Si el campo está vacío, cargar todos los médicos
        } else {
            buscarMedicoPorRut(rut);
        }
    });

    $('#actualizarMed').click(function() {
        cargarMedicos();
    });


    //PACIENTE

    $('#btn-paciente').click(function() {
        $('#pacientes').show();
        $('#contacto').hide();
        $('#medicos').hide();
        $('#AgregMedico').hide();

        if (!pacientesCargados) {
            cargarPacientes();
            pacientesCargados = true; 
        }
    });

    $('#btnvalida').click(function() {
        var rut = $('#txt_rut').val(); 
        if (rut.trim() === '') {
            cargarPacientes(); 
        } else {
            buscarPacientePorRut(rut);
        }
    });

    $('#actualizarPa').click(function() {
        cargarPacientes();
    });

});



//-----------------------------------------------------------------------------
// CONTACTOS

// CARGA LOS CONTACTOS DEL LOCAL STORAGE
function cargarContactos() {
    $('#tablaContacto tbody').empty();

    $.ajax({
        url: 'http://localhost:8000/api/contacto/', // URL de tu API para obtener médicos
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            response.forEach(function(contacto) {
                mostrarTabla(contacto.id,contacto.nombrec,contacto.motivo,contacto.email,contacto.telefono,contacto.mensaje)
            });
        },
        error: function(error) {
            console.error('Error al cargar contactos:', error);
        }
    });
    
} 

// MUESTRA EN LA TABLA DEL LOCAL STORAGE DEL CONTACTO
function mostrarTabla(id,nombre,motivo,email,telefono,textarea) {
    console.log(localStorage)

    $('#tablaContacto tbody').append(`
        <tr class="text-center">
            <td>${id}</td>
            <td>${motivo}</td>
            <td>${nombre}</td>
            <td>${email}</td>
            <td>${telefono}</td>
            <td>${textarea}</td>
            <td>
                <button class="btn btn-danger " onclick="eliminarContacto(this)">Eliminar</button>
            </td>
        </tr>
    `);
}


// ELIMINA DE LA TABLA DE CONTACTO
function eliminarContacto(boton) {
    var row = $(boton).closest('tr');
    var id = row.find('td:first').text();
    $.ajax({
        url: `http://localhost:8000/api/contacto/${id}/`, // URL DELETE con ID específico
        type: 'DELETE',
        dataType: 'json',
        success: function() {
            alert('CONTACTO ELIMINADO');
            row.remove(); // Eliminar la fila de la tabla después de eliminar el contacto en el servidor
        },
        error: function(error) {
            console.error('Error al eliminar contacto:', error);
            alert('Error al eliminar el contacto. Consulta la consola para más detalles.');
        }
    });
}




//-----------------------------------------------------------------------------------------------------------------------------
// MEDICOS

function cargarMedicos() {
    $('#tablaMedico tbody').empty();

    $.ajax({
        url: 'http://localhost:8000/api/medico/', // URL de tu API para obtener médicos
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            // Filtrar médicos por especialidad seleccionada
            response.forEach(function(medico) {
                mostrarTablaMedico(medico.nombrem, medico.rut_medico, medico.especialidad,medico.disponibilidad);
            });
        },
        error: function(error) {
            console.error('Error al cargar médicos:', error);
        }
    });
    
} 

function buscarMedicoPorRut(rut) {
    $('#tablaMedico tbody').empty(); 
    $('#mensajeError').hide(); 

    $.ajax({
        url: `http://localhost:8000/api/medico/${rut}/`,
        type: 'GET',
        dataType: 'json',
        success: function(medico) {
            mostrarTablaMedico(medico.nombrem, medico.rut_medico, medico.especialidad,medico.disponibilidad);
        },
        error: function(error) {
            console.error('Error al buscar medico:', error);
            $('#mensajeError').show(); 
        }
    });
}


function addmedico(){
    var rut = $('#rutinput').val();
    var nombre = $('#nombreMedico').val();
    var nombreE = $('#nombreEspecialidad').val();
    var medico = { rut,nombre,nombreE}

    guardarLocalmedico(medico);
}
function guardarLocalmedico(medico){
    var medicos = localStorage.getItem('medicos') ? JSON.parse(localStorage.getItem('medicos')) : [];
    medicos.push(medico);
    localStorage.setItem('medicos', JSON.stringify(medicos));
}

// MUESTRA EN LA TABLA DEL LOCAL STORAGE DEL MEDICOS
function mostrarTablaMedico(nombre,rut,nombreE,disponibilidad) {
    console.log(localStorage)

    $('#tablaMedico tbody').append(`
        <tr class="text-center">
            <td>${nombre}</td>
            <td>${rut}</td>
            <td>${nombreE}</td>
            <td>${disponibilidad}</td>
            <td>
                <button class="btn btn-danger " onclick="eliminarMedico(this)">Eliminar</button>
                <button class="btn btn-info " onclick="editarMedico(this)">Editar </button>
            </td>
        </tr>
    `);
}


// Función para eliminar un médico
function eliminarMedico(boton) {
    var row = $(boton).closest('tr');
    var rut = row.find('td:nth-child(2)').text();

    $.ajax({
        url: `http://localhost:8000/api/medico/${rut}/`,
        type: 'DELETE',
        dataType: 'json',
        success: function() {
            alert('Medico eliminado');
            console.log('Medico eliminado');
            row.remove(); 
        },
        error: function(error) {
            console.error('Error al eliminar medico:', error);
            alert('Error al eliminar el medico');
        }
    });
}


// EDITAR MEDICOS

function editarMedico(button) {
    var row = $(button).closest('tr');
    var cols = row.children('td');

    if (button.textContent === 'Editar') {
        // Guardar los valores originales en caso de cancelación
        var originalValues = {
            nombre: $(cols[0]).text(),
            rut: $(cols[1]).text(),
            especialidad: $(cols[2]).text(),
            disponibilidad: $(cols[3]).text()
        };

        // Crear el campo de entrada para el nombre
        var inputNombre = `<input type="text" class="form-control" value="${originalValues.nombre}" required>`;

        // Crear el select con las opciones de especialidad
        var selectEspecialidad = `
            <select class="form-select form-rut mx-auto" id="nombreEspecialidad" name="nombreEspecialidad" required>
                <option value="" disabled>Selecciona una especialidad</option>
                <option value="Telemedicina">TELEMEDICINA</option>
                <option value="Medicina General">MEDICINA GENERAL</option>
                <option value="Mamografia">MAMOGRAFIA</option>
                <option value="Odontologia">ODONTOLOGIA</option>
                <option value="Kinesiologia">KINESIOLOGIA</option>
                <option value="Oftalmologia">OFTALMOLOGIA</option>
                <option value="Toma de muestras">TOMA DE MUESTRAS</option>
                <option value="Radiografias">RADIOGRAFIAS</option>
                <option value="Ginecologia y obstetricia">GINECOLOGIA Y OBTRETICIA</option>
                <option value="Pediatria">PEDIATRIA</option>
                <option value="Traumatologia">TRAUMATOLOGIA</option>
                <option value="Dermatologia">DERMATOLOGIA</option>
            </select>
        `;

        // Crear el select con las opciones de disponibilidad
        var selectDisponibilidad = `
            <select class="form-select form-rut mx-auto" id="Disponibilidad" name="disponibilidad" required>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="NODISPONIBLE">NO DISPONIBLE</option>
            </select>
        `;

        // Reemplazar texto con input para editar nombre y select para especialidad y disponibilidad
        $(cols[0]).html(inputNombre);
        $(cols[2]).html(selectEspecialidad);
        $(cols[2]).find('option[value="' + originalValues.especialidad + '"]').prop('selected', true);
        $(cols[3]).html(selectDisponibilidad);
        $(cols[3]).find('option[value="' + originalValues.disponibilidad + '"]').prop('selected', true);

        // Cambiar texto de los botones Editar y Eliminar a Guardar y Cancelar
        $(button).text('Guardar').removeClass('btn-info').addClass('btn-success');
        $(button).next().text('Cancelar').removeClass('btn-danger').addClass('btn-warning');

        // Guardar los valores originales en el botón para usarlos si se cancela la edición
        $(button).data('originalValues', originalValues);
    } else { // Guardar cambios
        var newNombre = $(cols[0]).find('input').val();
        var newRut = $(cols[1]).text();
        var newEspecialidad = $(cols[2]).find('select').val();
        var newDisponibilidad = $(cols[3]).find('select').val();

        // Actualizar la interfaz con los nuevos valores
        $(cols[0]).text(newNombre);
        $(cols[1]).text(newRut);
        $(cols[2]).text(newEspecialidad);
        $(cols[3]).text(newDisponibilidad);

        // Cambiar botones de vuelta a Editar y Eliminar
        $(button).text('Editar').removeClass('btn-success').addClass('btn-info');
        $(button).next().text('Eliminar').removeClass('btn-warning').addClass('btn-danger');

        // Obtener el ID del médico desde la primera columna de la fila
        var id = $(cols[1]).text();

        // Llamar a la función para actualizar el médico en el backend
        actualizarMedico(id, newNombre, newRut, newEspecialidad, newDisponibilidad);
    }
}

function actualizarMedico(id, nombre, rut, especialidad,disponibilidad) {
    
    if (!nombre || !rut || !especialidad || !disponibilidad) {
        console.error('Todos los campos son requeridos.');
        return;
    }

    // Preparar los datos a enviar en formato JSON
    var data= {
        nombrem: nombre,
        rut_medico: rut,
        especialidad: especialidad,
        disponibilidad: disponibilidad,
    };

    $.ajax({
        url: `http://localhost:8000/api/medico/${id}/`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            alert('Medico Actualizado');
            
        },
        error: function(error) {
            console.error('Error al actualizar medico:', error);
            alert('Error al actualizar el medico.');
        }
    });
}



//PACIENTES

function cargarPacientes() {
    $('#tablaPaciente tbody').empty();

    $.ajax({
        url: 'http://localhost:8000/api/reserva/', // URL de tu API para obtener reservas
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            response.forEach(function(reserva) {
                var pacienteId = reserva.paciente;
                var medicoId = reserva.medico;
                var fecha = reserva.fecha;
                var hora = reserva.hora;

                
                $.ajax({
                    url: 'http://localhost:8000/api/paciente/' + pacienteId + '/', 
                    type: 'GET',
                    dataType: 'json',
                    success: function(paciente) {
                        
                        $.ajax({
                            url: 'http://localhost:8000/api/medico/' + medicoId + '/', 
                            type: 'GET',
                            dataType: 'json',
                            success: function(medico) {
                                mostrarTablapaciente(
                                    reserva.id_reserva,
                                    paciente.nombrepa,
                                    paciente.rut_paciente,
                                    paciente.prevision,
                                    medico.nombrem,
                                    medico.especialidad,
                                    fecha,
                                    hora
                                );
                            },
                            error: function(error) {
                                console.error('Error al cargar detalles del médico', error);
                            }
                        });
                    },
                    error: function(error) {
                        console.error('Error al cargar detalles del paciente', error);
                    }
                });
            });
        },
        error: function(error) {
            console.error('Error al cargar reservas', error);
        }
    });
}

function buscarPacientePorRut(rut) {
    $('#tablaPaciente tbody').empty();
    $('#mensajeError').hide(); 

    console.log("Buscando paciente con RUT:", rut);

    $.ajax({
        url: 'http://localhost:8000/api/reserva/',
        type: 'GET',
        dataType: 'json',
        success: function(reservas) {
            console.log("Reservas obtenidas:", reservas);

            var reservasFiltradas = [];

            reservas.forEach(function(reserva) {
                var pacienteId = reserva.paciente;
                $.ajax({
                    url: `http://localhost:8000/api/paciente/${pacienteId}/`, 
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(paciente) {
                        if (paciente.rut_paciente === rut) {
                            reserva.pacienteData = paciente;
                            reservasFiltradas.push(reserva);
                        }
                    },
                    error: function(error) {
                        console.error('Error al cargar detalles del paciente', error);
                    }
                });
            });

            if (reservasFiltradas.length === 0) {
                $('#mensajeError').show();
            } else {
                reservasFiltradas.forEach(function(reserva) {
                    var paciente = reserva.pacienteData;
                    var medicoId = reserva.medico;
                    var fecha = reserva.fecha;
                    var hora = reserva.hora;

                    $.ajax({
                        url: `http://localhost:8000/api/medico/${medicoId}/`, 
                        type: 'GET',
                        dataType: 'json',
                        success: function(medico) {
                            mostrarTablapaciente(
                                reserva.id_reserva,
                                paciente.nombrepa,
                                paciente.rut_paciente,
                                paciente.prevision,
                                medico.nombrem,
                                medico.especialidad,
                                fecha,
                                hora
                            );
                        },
                        error: function(error) {
                            console.error('Error al cargar detalles del médico', error);
                        }
                    });
                });
            }
        },
        error: function(error) {
            console.error('Error al cargar reservas', error);
        }
    });
}
// MUESTRA EN LA TABLA DEL LOCAL STORAGE DEL PACIENTE
function mostrarTablapaciente(id,nombre, rut, prevision,nombrem, especialidad, fecha, hora) {
    $('#tablaPaciente tbody').append(`
        <tr class="text-center">
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${rut}</td>
            <td>${prevision}</td>
            <td>${nombrem}</td>
            <td>${especialidad}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>
                <button class="btn btn-danger " onclick="eliminarPaciente(this)">Eliminar</button>
            </td>
        </tr>
    `);
}

function eliminarPaciente(boton) {
    var row = $(boton).closest('tr');
    var idReserva = row.find('td:first').text();
    var rutPaciente = row.find('td:nth-child(3)').text(); 

    // Eliminar la reserva
    $.ajax({
        url: `http://localhost:8000/api/reserva/${idReserva}/`, 
        type: 'DELETE',
        dataType: 'json',
        success: function() {
            // Obtener la lista completa de pacientes y filtrar por RUT
            $.ajax({
                url: 'http://localhost:8000/api/paciente/', 
                type: 'GET',
                dataType: 'json',
                success: function(pacientes) {
                    var paciente = pacientes.find(p => p.rut_paciente === rutPaciente);

                    if (paciente) {
                        var idPaciente = paciente.id;

                        // Eliminar el paciente
                        $.ajax({
                            url: `http://localhost:8000/api/paciente/${idPaciente}/`,
                            type: 'DELETE',
                            dataType: 'json',
                            success: function() {
                                alert('Reserva eliminada');
                                row.remove(); 
                            },
                            error: function(error) {
                                console.error('Error al eliminar paciente:', error);
                                alert('Error al eliminar el paciente. Consulta la consola para más detalles.');
                            }
                        });
                    } else {
                        console.error('No se encontró un paciente con el RUT proporcionado');
                        alert('No se encontró un paciente con el RUT proporcionado. Consulta la consola para más detalles.');
                    }
                },
                error: function(error) {
                    console.error('Error al obtener la lista de pacientes:', error);
                    alert('Error al obtener la lista de pacientes. Consulta la consola para más detalles.');
                }
            });
        },
        error: function(error) {
            console.error('Error al eliminar reserva:', error);
            alert('Error al eliminar la reserva. Consulta la consola para más detalles.');
        }
    });
}