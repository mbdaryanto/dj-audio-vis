# Generated by Django 4.1 on 2022-09-25 00:20

import os
from pathlib import Path
from django.db import migrations
from django.conf import settings


def update_file_fields(apps, schema_editor):
    Anomaly = apps.get_model('audio_mon', 'Anomaly')
    for anomaly in Anomaly.objects.all():
        if anomaly.sound_clip is not None:
            initial_path = Path(__file__).parent.parent / 'static' / 'audio' / anomaly.sound_clip
            if initial_path.exists():
                anomaly.sound_file.name = 'audio/{}'.format(anomaly.sound_clip)
                new_path = str(settings.MEDIA_ROOT / 'audio' / anomaly.sound_clip)
                os.rename(str(initial_path), new_path)
                anomaly.save()

class Migration(migrations.Migration):

    dependencies = [
        ("audio_mon", "0004_anomaly_plot_image_anomaly_sound_file"),
    ]

    operations = [
        migrations.RunPython(update_file_fields)
    ]