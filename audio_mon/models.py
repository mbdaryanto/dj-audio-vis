from django.db import models


class Machine(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Action(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Severity(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Reason(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.RESTRICT)
    reason = models.CharField(max_length=100)


class Anomaly(models.Model):
    timestamp = models.DateTimeField()
    machine = models.ForeignKey(Machine, on_delete=models.RESTRICT)
    severity = models.ForeignKey(Severity, on_delete=models.RESTRICT)
    is_new = models.BooleanField(default=True)
    sensor = models.CharField(max_length=100)
    sound_clip = models.CharField(max_length=100)
    suspected_reason = models.ForeignKey(Reason, null=True, on_delete=models.RESTRICT)
    action_required = models.ForeignKey(Action, null=True, on_delete=models.RESTRICT)
    comments = models.TextField()
    sound_file = models.FileField(upload_to='audio', null=True)
    plot_image = models.FileField(upload_to='plots', null=True)
