$(document).ready(function () {
  let monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  let now = new Date();
  let day = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();
  let medicoId;
  let reservasMedicoActual = [];

  function cargarMedicos() {
    var especialidadSeleccionada = localStorage.getItem("especialidadSeleccionada");
    $.ajax({
      url: 'http://localhost:8000/api/medico/',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        var medicoContainer = $('#seleccionMedico').find('div');
        medicoContainer.empty();

        response.forEach(function(medico) {
          if (medico.especialidad === especialidadSeleccionada && medico.disponibilidad === 'DISPONIBLE') {
            var medicoCard = `
              <div class="mb-3">
                <div class="row g-0">
                  <div class="col-md-10 mx-auto mt-3">
                    <div class="card-body wrapper p-2">
                      <h5 class="card-title"> <i class="bi bi-person-circle"></i> ${medico.nombrem}</h5>
                      <p class="card-text mt-2 "> <i class="bi bi-heart-pulse"></i> ${medico.especialidad}</p>
                      <input type="button" class="btn btn-back1 btn-primary fw-bold seleccionar-medico" data-rut="${medico.rut_medico}" value="SELECCIONAR">
                    </div>
                  </div>
                </div>
              </div>
            `;
            medicoContainer.append(medicoCard);
          }
        });
      },
      error: function(error) {
        console.error('Error al cargar médicos:', error);
      }
    });
  }

  cargarMedicos();

  function updateCalendar() {
    $("#text_month").text(monthName[month]);
    $("#text_year").text(year);

    $(".days").empty();
    let totalDays = new Date(year, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 1; i <= totalDays; i++) {
      let $day = $("<li>").addClass("calendar-day").text(i);
      if (year < now.getFullYear() || (year === now.getFullYear() && (month < now.getMonth() || (month === now.getMonth() && i < day)))) {
        $day.addClass("inactive");
      }
      $(".days").append($day);
    }
  }

  // Botón mes siguiente
  $("#next").click(function () {
    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }
    updateCalendar();
  });

  // Botón mes anterior
  $("#prev").click(function () {
    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }
    updateCalendar();
  });

  function generateHourSlots() {
    const $hoursContainer = $(".hours");
    $hoursContainer.empty();

    for (let i = 8; i <= 19; i++) {
      for (let j = 0; j < 2; j++) {
        const period = i < 12 ? 'AM' : 'PM';
        const hourText = i <= 12 ? i : i - 12;
        const minuteText = j === 0 ? '00' : '30';
        const $hourSlot = $("<div></div>")
          .addClass("hour-slot")
          .text(`${hourText}:${minuteText} ${period}`);
        $hoursContainer.append($hourSlot);
      }
    }
  }

  function cargarReservasMedico(medicoId) {
    $.ajax({
      url: 'http://localhost:8000/api/reserva/',
      type: 'GET',
      dataType: 'json',
      data: {
        medico: medicoId  // Envía el ID del médico como parámetro en la solicitud GET
      },
      success: function(reservas) {
        reservasMedicoActual = reservas;
        updateCalendar();
        deshabilitarHorasReservadas($('.calendar-day.active').text());
      },
      error: function(error) {
        console.error('Error al cargar reservas:', error);
      }
    });
  }

  function deshabilitarHorasReservadas(diaSeleccionado) {
    const $hourSlots = $(".hour-slot");
    $hourSlots.removeClass("inactive");

    reservasMedicoActual.forEach(function(reserva) {
      let fechaReserva = new Date(reserva.fecha);
      let diaReserva = fechaReserva.getDate();
      let mesReserva = fechaReserva.getMonth();
      let anioReserva = fechaReserva.getFullYear();

      if (anioReserva === year && mesReserva === month && diaReserva == diaSeleccionado) {
        $hourSlots.each(function() {
          if ($(this).text() === reserva.hora) {
            $(this).addClass("inactive");
          }
        });
      }
    });
  }

  $(document).on("click", ".seleccionar-medico", function(event) {
    var $button = $(this);
    medicoId = $(this).data("rut");

    // Limpiar las reservas actuales al seleccionar un nuevo médico
    reservasMedicoActual = [];

    $(".seleccionar-medico").each(function() {
      $(this).val("SELECCIONAR");
      $(this).prop("disabled", false);
    });

    $button.val("SELECCIONADO");

    console.log("Medico seleccionado con Rut: " + medicoId);
    alert("Medico seleccionado con Rut: " + medicoId);

    cargarReservasMedico(medicoId);
    $(".calendar-container").show();
    $(".days").empty();
    $(".hours").empty();
  });

  $(document).on("click", ".calendar-day", function () {
    if (!$(this).hasClass("inactive")) {
      $(".calendar-day").removeClass("active");
      $(this).addClass("active");
      $(".hours").show(); // Asegurarse de mostrar el contenedor de horas
      generateHourSlots();
      deshabilitarHorasReservadas($(this).text());
    }
  });

  $(document).on("click", ".hour-slot", function () {
    if (!$(this).hasClass("inactive")) {
      $(".hour-slot").removeClass("active");
      $(this).addClass("active");
    }
  });

  $('#guardar').click(function() {
    var fecha = $('#text_year').text() + '-' + (month + 1) + '-' + $('.calendar-day.active').text();
    var hora = $('.hour-slot.active').text();
    var especialidadSeleccionada = localStorage.getItem("especialidadSeleccionada");

    // Redirigir si la especialidad es "telemedicina"
    if (especialidadSeleccionada === 'Telemedicina') {
      window.location.href = 'pago.html';
      return;
    }

    var data = {
      rut_paciente: localStorage.getItem("rut"),
      nombrepa: localStorage.getItem("nombre"),
      prevision: localStorage.getItem("prevision")
    };

    $.ajax({
      url: "http://localhost:8000/api/paciente/",
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function(response) {
        console.log('SUCCESS!', response);
        alert('Paciente guardado correctamente!');

        var pacienteId = response.id;

        var reservaData = {
          paciente: pacienteId,
          medico: medicoId,
          fecha: fecha,
          hora: hora
        };

        console.log(reservaData);

        $.ajax({
          url: "http://localhost:8000/api/reserva/",
          type: "POST",
          data: JSON.stringify(reservaData),
          contentType: "application/json",
          success: function(response) {
            console.log('SUCCESS!', response);
            alert('Reserva guardada correctamente!');
            cargarReservasMedico(medicoId); // Volver a cargar reservas para actualizar el calendario
          },
          error: function(error) {
            alert('No se pudo guardar la reserva!');
            console.log('FAILED...', error);
          }
        });
      },
      error: function(error) {
        alert('No se pudo guardar paciente!');
        console.log('FAILED...', error);
      }
    });

    var paciente = {
      rut: localStorage.getItem("rut"),
      nombre: localStorage.getItem("nombre"),
      prevision: localStorage.getItem("prevision"),
      especialidadSeleccionada: especialidadSeleccionada,
      fecha: fecha,
      hora: hora
    };

    agregarPaciente(paciente);
    cargarPacientes();
    alert("Fecha y hora guardadas correctamente.");

    $('.hour-slot').addClass('inactive').removeClass('active');
    $(this).prop('disabled', true);
  });

  function agregarPaciente(nuevoPaciente) {
    let pacientes = [];
    if(localStorage.getItem('pacientes')){
      pacientes = JSON.parse(localStorage.getItem('pacientes'));
    }
    pacientes.push(nuevoPaciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }

  cargarPacientes();

  function cargarPacientes() {
    $('#tableBody').empty();
    if(localStorage.getItem('pacientes')){
      var pacientes = JSON.parse(localStorage.getItem('pacientes'));
      pacientes.forEach(function(paciente){
        mostrarPaciente(paciente);
      });
    }
  }

  function mostrarPaciente(paciente) {
    var newRow = `
      <tr>
        <td>${paciente.nombre}</td>
        <td>${paciente.rut}</td>
        <td>${paciente.fecha}</td>
        <td>${paciente.hora}</td>
        <td>${paciente.prevision}</td>
        <td>${paciente.especialidadSeleccionada}</td>
      </tr>
    `;

    $('#tableBody').append(newRow);
  }

  $(".calendar-container").hide();
  $(".hours").hide();
});