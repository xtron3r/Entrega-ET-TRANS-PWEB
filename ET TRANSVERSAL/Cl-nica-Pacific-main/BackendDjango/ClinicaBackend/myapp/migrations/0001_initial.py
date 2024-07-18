# Generated by Django 5.0.6 on 2024-06-28 05:37

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contacto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombrec', models.CharField(max_length=100)),
                ('motivo', models.CharField(max_length=100)),
                ('telefono', models.IntegerField()),
                ('email', models.CharField(max_length=100)),
                ('mensaje', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Medico',
            fields=[
                ('nombrem', models.CharField(max_length=100)),
                ('rut_medico', models.CharField(max_length=11, primary_key=True, serialize=False, unique=True)),
                ('especialidad', models.CharField(max_length=100)),
                ('disponibilidad', models.CharField(choices=[('DISPONIBLE', 'Disponible'), ('NODISPONIBLE', 'Nodisponible')], max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Paciente',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombrepa', models.CharField(max_length=80)),
                ('rut_paciente', models.CharField(max_length=11)),
                ('prevision', models.CharField(choices=[('FONASA', 'Fonasa'), ('ISAPRE', 'Isapre'), ('PARTICULAR', 'Particular')], max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id_reserva', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('fecha', models.CharField(max_length=20)),
                ('hora', models.CharField(max_length=20)),
                ('medico', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.medico')),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.paciente')),
            ],
        ),
    ]
