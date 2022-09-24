import os
import wave
from io import BytesIO
from pathlib import Path
from django.shortcuts import render, get_object_or_404
from django.http.request import HttpRequest
from django.http import HttpResponse, Http404
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
import django_filters.rest_framework
# from rest_framework.decorators import api_view
import numpy as np
from matplotlib import pyplot as plt
from scipy import signal
from .models import Anomaly, Machine, Reason, Severity
from .serializers import AnomalySerializer, MachineSerializer, ReasonSerializer, SeveritySerializer


AUDIO_BASE_DIR = Path(__file__).parent / 'static' / 'audio'


def home(request: HttpRequest):
    context = {}
    dev_server_url = os.getenv('DEV_SERVER')
    if dev_server_url is not None:
        context['dev_server_url'] = dev_server_url

    return render(request, 'home.html', context)


def waveform(
    request: HttpRequest,
    pk: int,
):
    if request.method == "GET":
        # return HttpResponse("Hello World {}".format(id))
        anomaly = get_object_or_404(Anomaly, pk=pk)
        audio_file = AUDIO_BASE_DIR / anomaly.sound_clip
        return HttpResponse(
            content=wave_to_plot(audio_file),
            content_type='image/png',
        )

    raise Http404("Method not supported")


class AnomalyList(generics.ListAPIView):
    queryset = Anomaly.objects.all()
    serializer_class = AnomalySerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['machine', 'severity', 'sensor',]
    filterset_fields = ['machine', 'severity', 'sensor',]



class AnomalyDetail(generics.RetrieveUpdateAPIView):
    queryset = Anomaly.objects.all()
    serializer_class = AnomalySerializer
    permission_classes = (permissions.AllowAny,)


class AnomalyDetailPlot(generics.RetrieveAPIView):
    queryset = Anomaly.objects.all()
    permission_classes = (permissions.AllowAny,)

    def retrieve(self, request: HttpRequest, *args, **kwargs):
        instance = self.get_object()
        audio_file = AUDIO_BASE_DIR / instance.sound_clip
        return Response({ 'plot': wave_to_plot(audio_file) })


def wave_to_plot(wave_file: Path, format: str = 'png') -> bytes:
    with wave_file.open('rb') as fin:
        signal_wave = wave.open(fin)
        # sample_rate = 16384
        framerate = signal_wave.getframerate()
        nframes = signal_wave.getnframes()
        signal_wave.getnchannels()

        sig = np.frombuffer(signal_wave.readframes(nframes), dtype=np.int16)

    abs_max = np.max(np.abs(sig))
    normalized = sig / abs_max

    f, t, Sxx = signal.spectrogram(normalized) # , fs=framerate
    freq_slice = np.where((f <= 8162))

    # keep only frequencies of interest
    f = f[freq_slice]
    Sxx = Sxx[freq_slice,:][0]

    plt.switch_backend('AGG')
    plt.figure(1, figsize=(6, 8), dpi=200)

    plot_a = plt.subplot(3, 1, 1)
    plot_a.plot(normalized)
    plot_a.set_xlabel('Frames')
    plot_a.set_ylabel('Amp')

    plot_b = plt.subplot(3, 1, (2, 3))
    # plot_b.specgram(normalized, NFFT=1024, Fs=framerate, noverlap=900)
    plot_b.pcolormesh(t, f, Sxx)
    plot_b.set_xlabel('Time')
    plot_b.set_ylabel('Frequency')

    # plt.show()
    imgdata = BytesIO()
    plt.savefig(imgdata, format=format)
    return imgdata.getvalue()


class MachineList(generics.ListAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer


class SeverityList(generics.ListAPIView):
    queryset = Severity.objects.all()
    serializer_class = SeveritySerializer


class ReasonList(generics.ListAPIView):
    queryset = Reason.objects.all()
    serializer_class = ReasonSerializer
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['machine', 'name']
    filterset_fields = ['machine',]
