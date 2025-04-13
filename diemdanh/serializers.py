from rest_framework import serializers
from .models import SinhVien, DiemDanh

class SinhVienSerializer(serializers.ModelSerializer):
    lop_display = serializers.CharField(source='lop.ten_lop', read_only=True)
    khoa_display = serializers.CharField(source='lop.khoa.ten_khoa', read_only=True)
    
    class Meta:
        model = SinhVien
        fields = ['id', 'ma_sinh_vien', 'ho_ten', 'ngay_sinh', 'email', 'qr_code', 'lop_display', 'khoa_display']

class DiemDanhSerializer(serializers.ModelSerializer):
    sinh_vien_info = serializers.SerializerMethodField()
    
    class Meta:
        model = DiemDanh
        fields = ['id', 'sinh_vien', 'thoi_gian', 'sinh_vien_info']
    
    def get_sinh_vien_info(self, obj):
        return {
            'ma_sinh_vien': obj.sinh_vien.ma_sinh_vien,
            'ho_ten': obj.sinh_vien.ho_ten,
            'lop': obj.sinh_vien.lop.ten_lop if obj.sinh_vien.lop else '',
            'khoa': obj.sinh_vien.lop.khoa.ten_khoa if obj.sinh_vien.lop and obj.sinh_vien.lop.khoa else ''
        }