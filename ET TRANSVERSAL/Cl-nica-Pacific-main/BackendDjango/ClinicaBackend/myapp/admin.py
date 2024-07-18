from django.contrib import admin
from .models import Contacto,Medico,Paciente,Reserva

# Register your models here.

admin.site.register(Contacto)
admin.site.register(Medico)
admin.site.register(Paciente)
admin.site.register(Reserva)
