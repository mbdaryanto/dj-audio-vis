import os
from typing import Optional
import wave
from io import BytesIO
from pathlib import Path
from django.shortcuts import render, get_object_or_404
from django.http.request import HttpRequest
from django.http import Http404, FileResponse
from django.conf import settings
from rest_framework import generics, permissions, filters
from rest_framework.response import Response
import django_filters.rest_framework
# from rest_framework.decorators import api_view
import numpy as np
from matplotlib import pyplot as plt
from scipy import signal
from .models import Action, Anomaly, Machine, Reason, Severity
from .serializers import ActionSerializer, AnomalySerializer, AnomalyUpdateSerializer, MachineSerializer, ReasonSerializer, SeveritySerializer


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
        anomaly: Anomaly = get_object_or_404(Anomaly, pk=pk)

        if not bool(anomaly.sound_file):
            raise Http404('sound file not available')

        # audio_file = AUDIO_BASE_DIR / anomaly.sound_clip
        if bool(anomaly.plot_image):
            return FileResponse(
                anomaly.plot_image.open('rb'),
            )

        sound_file_path = Path(anomaly.sound_file.path)
        anomaly.plot_image.name = 'plots/{}.png'.format(sound_file_path.stem)
        wave_to_plot(sound_file_path, format='png', as_file=anomaly.plot_image.path)
        anomaly.save()
        return FileResponse(
            anomaly.plot_image.open('rb'),
        )
        # return HttpResponse(
        #     content=png_file,
        #     content_type='image/png',
        # )

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
    # serializer_class = AnomalySerializer
    permission_classes = (permissions.AllowAny,)

    def get_serializer_class(self):
        if self.request.method in {'PATCH', 'PUT'}:
            return AnomalyUpdateSerializer
        return AnomalySerializer


class AnomalyDetailPlot(generics.RetrieveAPIView):
    queryset = Anomaly.objects.all()
    permission_classes = (permissions.AllowAny,)

    def retrieve(self, request: HttpRequest, *args, **kwargs):
        instance = self.get_object()
        audio_file = AUDIO_BASE_DIR / instance.sound_clip
        return Response({ 'plot': wave_to_plot(audio_file) })


def wave_to_plot(wave_file: Path, format: str = 'png', as_file: str = None) -> Optional[bytes]:
    with wave_file.open('rb') as fin:
        signal_wave = wave.open(fin)
        params = signal_wave.getparams()

        sig = np.frombuffer(signal_wave.readframes(params.nframes), dtype=np.int16)
        # take only 1st channel
        sig = sig[0::params.nchannels]

    abs_max = np.max(np.abs(sig))
    normalized = sig / abs_max

    f, t, Sxx = signal.spectrogram(sig, fs=params.framerate)
    freq_slice = np.where((f <= 8162))

    # keep only frequencies of interest
    f = f[freq_slice]
    Sxx = Sxx[freq_slice,:][0]

    mean = np.mean(Sxx)
    std = np.std(Sxx)

    plt.switch_backend('AGG')
    plt.figure(1, figsize=(4, 6), dpi=100)

    plot_a = plt.subplot(3, 1, 1)
    plot_a.plot(normalized)
    plot_a.set_xlabel('Frames')
    plot_a.set_ylabel('Amp')

    plot_b = plt.subplot(3, 1, (2, 3))
    # plot_b.specgram(normalized, NFFT=1024, Fs=framerate, noverlap=900)
    plot_b.pcolormesh(t, f, Sxx, vmin=0, vmax=2 * std + mean)
    plot_b.set_xlabel('Time')
    plot_b.set_ylabel('Frequency')

    # plt.show()
    if as_file:
        plt.savefig(as_file, format=format)
        return None

    imgdata = BytesIO()
    plt.savefig(imgdata, format=format)
    return imgdata.getvalue()


class MachineList(generics.ListAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer


class SeverityList(generics.ListAPIView):
    queryset = Severity.objects.all()
    serializer_class = SeveritySerializer


class ActionList(generics.ListAPIView):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer


class ReasonList(generics.ListAPIView):
    queryset = Reason.objects.all()
    serializer_class = ReasonSerializer
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['machine', 'name']
    filterset_fields = ['machine',]
