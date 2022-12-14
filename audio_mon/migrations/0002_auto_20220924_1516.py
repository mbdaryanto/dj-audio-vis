# Generated by Django 4.1 on 2022-09-24 08:16

from django.db import migrations
from django.utils import timezone


def insert_initial_values(apps, schema_editor):
    Machine = apps.get_model('audio_mon', 'Machine')
    cnc = Machine.objects.create(name='CNC Machine')
    milling = Machine.objects.create(name='Milling Machine')

    Action = apps.get_model('audio_mon', 'Action')
    Action.objects.create(name='Immediate')
    Action.objects.create(name='Later')
    Action.objects.create(name='No Action')

    Severity = apps.get_model('audio_mon', 'Severity')
    mild = Severity.objects.create(name='Mild', color='#11a034')
    moderate = Severity.objects.create(name='Moderate', color='#FCA034')
    severe = Severity.objects.create(name='Severe', color='#A02d11')

    Reason = apps.get_model('audio_mon', 'Reason')
    Reason.objects.create(machine=cnc, reason='Spindle Error')
    Reason.objects.create(machine=cnc, reason='Axis Problem')
    Reason.objects.create(machine=cnc, reason='Normal')
    Reason.objects.create(machine=milling, reason='Machine Crash')
    Reason.objects.create(machine=milling, reason='Router Fault')
    Reason.objects.create(machine=milling, reason='Normal')

    Anomaly = apps.get_model('audio_mon', 'Anomaly')
    anomalies_values = [
        [1628676001, cnc, mild, '1234567890', '1.wav'],
        [1629102961, cnc, moderate, '0123456789', '2.wav'],
        [1629058322, cnc, severe, '1234567890', '3.wav'],
        [1629057722, milling, mild, '1122334455', '4.wav'],
        [1629025202, milling, moderate, '2345678900', '5.wav'],
        [1629057361, milling, severe, '2345678900', '6.wav'],
    ]

    for timestamp, machine, severity, sensor, sound_clip in anomalies_values:
        Anomaly.objects.create(
            timestamp=timezone.datetime.fromtimestamp(timestamp),
            machine=machine,
            severity=severity,
            sensor=sensor,
            sound_clip=sound_clip
        )

class Migration(migrations.Migration):

    dependencies = [
        ("audio_mon", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(insert_initial_values)
    ]
