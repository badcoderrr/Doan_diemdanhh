from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from diemdanh import views

router = DefaultRouter()
router.register(r'sinh-vien', views.SinhVienViewSet)

urlpatterns = [
    # URL admin (phải đứng đầu)
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/sinh-vien/', views.sinh_vien_api, name='sinh-vien-api'),
    path('api/diem-danh/', views.diem_danh, name='diem-danh'),
    path('api/lich-su-diem-danh/', views.lich_su_diem_danh, name='lich-su-diem-danh'),
    
    # DRF router
    path('api/drf/', include(router.urls)),
    
    # Trang thông thường
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
]