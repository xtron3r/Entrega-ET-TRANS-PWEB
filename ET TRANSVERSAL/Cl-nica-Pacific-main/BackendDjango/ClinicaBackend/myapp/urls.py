from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactoViewSet,MedicoViewSet,PacienteViewSet,ReservaViewSet,UserViewSet
from .views import LoginAPIView




router = DefaultRouter()
router.register('contacto', ContactoViewSet)
router.register('medico', MedicoViewSet)
router.register('paciente', PacienteViewSet)
router.register('reserva', ReservaViewSet)
router.register('user', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginAPIView.as_view(), name='login'),
]
