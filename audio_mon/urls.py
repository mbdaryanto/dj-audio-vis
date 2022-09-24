from django.urls import path
from . import views


urlpatterns = [
    path('', views.home),
    path('anomaly/', views.AnomalyList.as_view()),
    path('anomaly/<int:pk>/', views.AnomalyDetail.as_view()),
    path('anomaly/<int:pk>/waveform/', views.waveform),
    path('plot/<int:pk>/', views.AnomalyDetailPlot.as_view()),
    path('machines/', views.MachineList.as_view()),
]
