from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from diemdanh import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'sinh-vien', views.SinhVienViewSet)

urlpatterns = [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path('api/sinh-vien/', views.sinh_vien_api, name='sinh-vien-api'),
    path('api/diem-danh/', views.diem_danh, name='diem-danh'),
    path('api/lich-su-diem-danh/', views.lich_su_diem_danh, name='lich-su-diem-danh'),
    path('api/drf/', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)