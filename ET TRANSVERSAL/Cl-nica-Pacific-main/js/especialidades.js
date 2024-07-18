function reservarEspecialidad(especialidad) {
    localStorage.clear();
    // Guardar la especialidad en el localStorage
    localStorage.setItem('especialidadSeleccionada', especialidad);
    // Redireccionar a la página de datos del paciente
    window.location.href = 'datos_paciente.html';
  }