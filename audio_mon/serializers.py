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
            'sound_file', 'plot_image',
        ]


class ObjectWithIdSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class AnomalyUpdateSerializer(serializers.ModelSerializer):
    suspected_reason = ObjectWithIdSerializer(required=False, allow_null=True)
    action_required = ObjectWithIdSerializer(required=False, allow_null=True)
    comments = serializers.CharField(required=False, style={'base_template': 'textarea.html'})

    def update(self, instance, validated_data):
        print('updating instance...')
        print(repr(validated_data))

        _suspected_reason = validated_data.pop('suspected_reason', None)
        if _suspected_reason is not None and 'id' in _suspected_reason:
            instance.suspected_reason = Reason.objects.get(pk=_suspected_reason.get('id'))

        _action_required = validated_data.pop('action_required', None)
        if _action_required is not None and 'id' in _action_required:
            instance.action_required = Action.objects.get(pk=_action_required.get('id'))

        if 'comments' in validated_data:
            instance.comments = validated_data['comments']

        if 'is_new' in validated_data:
            instance.is_new = validated_data['is_new']

        instance.save()

        return instance

    class Meta:
        model = Anomaly
        fields = [
            'is_new', 'suspected_reason', 'action_required', 'comments',
        ]
