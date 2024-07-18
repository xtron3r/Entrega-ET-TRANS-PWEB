document.addEventListener('DOMContentLoaded', function() {
    function validarRut(rut) {
        rut = rut.replace(/\./g, '').replace(/\-/g, '');
  
        var dv = rut.slice(-1).toUpperCase();
        var rutSinDV = rut.slice(0, -1);
  
        if (!/^\d+$/.test(rutSinDV)) return false;
  
        var suma = 0;
        var multiplo = 2;
  
        for (var i = rutSinDV.length - 1; i >= 0; i--) {
            suma += parseInt(rutSinDV.charAt(i)) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
  
        var dvEsperado = 11 - (suma % 11);
        dvEsperado = (dvEsperado === 11) ? '0' : ((dvEsperado === 10) ? 'K' : dvEsperado.toString());
  
        return dvEsperado === dv;
    }
  
    function mensajeError(mensaje) {
        var mensajeError = document.getElementById('mensaje-error');
        mensajeError.innerHTML = mensaje;
    }
  
    function validarFormulario() {
        var rutInput = document.getElementById('txt_rut');
        var rut = rutInput.value.trim();
  
        mensajeError('');
        if (rut === '') {
            mensajeError('Debe ingresar un RUT.');
            return false;
        }
        if (rut.length > 12) {
            mensajeError('El RUT ingresado es demasiado largo.');
            return false;
        }
        if (rut.length < 8) {
            mensajeError('El RUT ingresado es demasiado corto.');
            return false;
        }
  
        if (!validarRut(rut)) {
            mensajeError('El RUT ingresado no es válido.');
            return false;
        }
  
        cargarPacientesPorRut(rut);
  
        return true;
    }
  
    function agregarFila(id, nombrep, rutpa, prevision, nombrem,especialidad, fecha, hora) {
        var newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${id}</td>
            <td>${nombrep}</td>
            <td>${rutpa}</td>
            <td>${prevision}</td>
            <td>${nombrem}</td>
            <td>${especialidad}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>
                <button type="button" class="btn btn-danger btn-anular fw-bold" onclick="eliminarPaciente(this)">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    
        var tableBody = document.getElementById("tableBody");
        if (!tableBody) {
            tableBody = document.createElement("tbody");
            tableBody.id = "tableBody";
            document.querySelector("table").appendChild(tableBody);
        }
    
        tableBody.appendChild(newRow);
    }

    function limpiarTabla() {
        var tableBody = document.getElementById("tableBody");
        if (tableBody) {
            tableBody.innerHTML = ''; // Elimina todas las filas de la tabla
        }
    }

    function cargarPacientesPorRut(rut) {
        limpiarTabla();

        $.ajax({
            url: 'http://localhost:8000/api/reserva/',
            type: 'GET',
            dataType: 'json',
            success: function(reservas) {
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
                    mensajeError('No se encontraron pacientes con el RUT ingresado.');
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
                                agregarFila(
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
                mensajeError('Error al cargar reservas. Consulte la consola para más detalles.');
            }
        });
    }
  
    document.getElementById('btnvalida').addEventListener('click', function(event) {
        event.preventDefault();
        validarFormulario();
    });
});







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
