from django.db import models
import qrcode
from io import BytesIO
from django.core.files import File
import os

class Khoa(models.Model):
    ma_khoa = models.CharField(max_length=10, unique=True, verbose_name="Mã khoa")
    ten_khoa = models.CharField(max_length=100, verbose_name="Tên khoa")
    
    class Meta:
        verbose_name = "Khoa"
        verbose_name_plural = "Danh sách khoa"
    
    def __str__(self):
        return f"{self.ma_khoa} - {self.ten_khoa}"

class Lop(models.Model):
    ma_lop = models.CharField(max_length=10, unique=True, verbose_name="Mã lớp")
    ten_lop = models.CharField(max_length=100, verbose_name="Tên lớp")
    khoa = models.ForeignKey(Khoa, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Khoa")

    
    class Meta:
        verbose_name = "Lớp"
        verbose_name_plural = "Danh sách lớp"
    
    def __str__(self):
        return f"{self.ma_lop} - {self.ten_lop}"

class SinhVien(models.Model):
    ma_sinh_vien = models.CharField(
        max_length=20, 
        unique=True,
        verbose_name="Mã sinh viên",
        help_text="Mã số sinh viên duy nhất"
    )
    ho_ten = models.CharField(max_length=100, verbose_name="Họ và tên")
    ngay_sinh = models.DateField(verbose_name="Ngày sinh")
    email = models.EmailField(unique=True, blank=True, null=True, verbose_name="Email")
    lop = models.ForeignKey(
        Lop, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Lớp"
    )
    qr_code = models.ImageField(
        upload_to='qrcodes/', 
        blank=True, 
        null=True,
        verbose_name="Mã QR"
    )

    class Meta:
        verbose_name = "Sinh viên"
        verbose_name_plural = "Danh sách sinh viên"
        ordering = ['ma_sinh_vien']

    def __str__(self):
        return f"{self.ma_sinh_vien} - {self.ho_ten}"

    def generate_qrcode(self):
        if not self.ma_sinh_vien:
            return None
            
        qr_data = f"{self.ma_sinh_vien}|{self.ho_ten}|{self.lop.ten_lop if self.lop else ''}|{self.lop.khoa.ten_khoa if self.lop and self.lop.khoa else ''}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        file_name = f'qr_{self.ma_sinh_vien}.png'
        self.qr_code.save(file_name, File(buffer), save=False)
        buffer.close()
        return file_name

    def save(self, *args, **kwargs):
        if not self.qr_code or self._state.adding:
            self.generate_qrcode()
        super().save(*args, **kwargs)

class DiemDanh(models.Model):
    sinh_vien = models.ForeignKey(
        SinhVien, 
        on_delete=models.CASCADE,
        verbose_name="Sinh viên"
    )
    thoi_gian = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Thời gian điểm danh"
    )
    
    class Meta:
        verbose_name = "Điểm danh"
        verbose_name_plural = "Danh sách điểm danh"
        ordering = ['-thoi_gian']
    
    def __str__(self):
        return f"{self.sinh_vien} - {self.thoi_gian.strftime('%d/%m/%Y %H:%M')}"