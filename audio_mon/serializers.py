from rest_framework import serializers
from .models import Action, Anomaly, Machine, Reason, Severity


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = [
            'id', 'name',
        ]

class SeveritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Severity
        fields = [
            'id', 'name', 'color',
        ]

class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason
        fields = [
            'id', 'reason',
        ]

class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = [
            'id', 'name',
        ]

class AnomalySerializer(serializers.ModelSerializer):
    machine = MachineSerializer(read_only=True)
    severity = SeveritySerializer(read_only=True)
    suspected_reason = ReasonSerializer()
    action_required = ActionSerializer()

    class Meta:
        model = Anomaly
        fields = [
            'id', 'timestamp', 'machine', 'severity', 'is_new', 'sensor',
            'sound_clip', 'suspected_reason', 'action_required', 'comments',
        ]
