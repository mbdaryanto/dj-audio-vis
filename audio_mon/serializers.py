from rest_framework import serializers
from .models import Anomaly

class AnomalySerializer(serializers.ModelSerializer):
    class Meta:
        model = Anomaly
        fields = [
            'id', 'timestamp', 'machine', 'severity', 'sensor', 
            'sound_clip', 'suspected_reason', 'action_required', 'comments',
        ]
