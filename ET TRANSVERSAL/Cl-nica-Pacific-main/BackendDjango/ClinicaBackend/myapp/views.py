from rest_framework import viewsets
from .models import Contacto,Medico,Paciente,Reserva
from django.contrib.auth.models import User
from .serializers import ContactoSerializer, MedicoSerializer,PacienteSerializer,ReservaSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate


# Create your views here.
class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all() 
    serializer_class = ContactoSerializer

class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

    def get_queryset(self):
        queryset = Reserva.objects.all()
        medico_id = self.request.query_params.get('medico', None)
        if medico_id:
            queryset = queryset.filter(medico__rut_medico=medico_id)
        return queryset

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            return Response({'detail': 'Inicio de sesión exitoso'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)