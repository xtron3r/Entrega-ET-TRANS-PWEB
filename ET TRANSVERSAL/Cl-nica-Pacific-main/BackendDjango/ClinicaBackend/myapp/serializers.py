from rest_framework import serializers
from django.contrib.auth.models import User 
from .models import Contacto,Medico,Paciente,Reserva

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields ="__all__"

class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields ="__all__"

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields ="__all__"

class ReservaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reserva
        fields = "__all__"
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username","password")
        extra_kwargs = {'password': {'write_only': True}} 