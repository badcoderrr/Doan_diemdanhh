from django.contrib import admin
from .models import SinhVien, DiemDanh, Lop  # Nhớ import thêm model Lop

@admin.register(Lop)
class LopAdmin(admin.ModelAdmin):
    list_display = ('ma_lop', 'ten_lop')
    search_fields = ('ma_lop', 'ten_lop')
    ordering = ('ma_lop',)

@admin.register(SinhVien)
class SinhVienAdmin(admin.ModelAdmin):
    exclude = ('qr_code',)
    list_display = ('ma_sinh_vien', 'ho_ten', 'ngay_sinh', 'email', 'lop_display')
    list_filter = ('lop',)  # Thêm bộ lọc theo lớp
    search_fields = ('ma_sinh_vien', 'ho_ten', 'email')  
    date_hierarchy = 'ngay_sinh'  # Thêm điều hướng theo ngày sinh
    ordering = ('ma_sinh_vien',)  # Sắp xếp mặc định
    
    # Hiển thị tên lớp thay vì đối tượng
    def lop_display(self, obj):
        return obj.lop.ten_lop if obj.lop else ''
    lop_display.short_description = 'Lớp'

@admin.register(DiemDanh)
class DiemDanhAdmin(admin.ModelAdmin):
    list_display = ('sinh_vien_display', 'thoi_gian_display')
    list_filter = ('thoi_gian',) 
    search_fields = ('sinh_vien__ma_sinh_vien', 'sinh_vien__ho_ten')  
    date_hierarchy = 'thoi_gian' 
    
    # Hiển thị thông tin sinh viên
    def sinh_vien_display(self, obj):
        return f"{obj.sinh_vien.ma_sinh_vien} - {obj.sinh_vien.ho_ten}"
    sinh_vien_display.short_description = 'Sinh viên'
    
    # Định dạng lại thời gian hiển thị
    def thoi_gian_display(self, obj):
        return obj.thoi_gian.strftime("%d/%m/%Y %H:%M")
    thoi_gian_display.short_description = 'Thời gian'
    thoi_gian_display.admin_order_field = 'thoi_gian'