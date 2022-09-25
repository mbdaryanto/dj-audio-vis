# Generated by Django 4.1 on 2022-09-25 00:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "audio_mon",
            "0003_anomaly_is_new_alter_action_name_alter_machine_name_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="anomaly",
            name="plot_image",
            field=models.FileField(null=True, upload_to="plots"),
        ),
        migrations.AddField(
            model_name="anomaly",
            name="sound_file",
            field=models.FileField(null=True, upload_to="audio"),
        ),
    ]
