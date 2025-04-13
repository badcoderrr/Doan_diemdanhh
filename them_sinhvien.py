import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hethong_diemdanh.settings')
import django
django.setup()

from diemdanh.models import SinhVien

danh_sach = [
    {"ma_sv": "DH52104952", "ten": "Le Anh Vu"},
    {"ma_sv": "DH52102314", "ten": "Tong Thanh Binh   "},
]

for sv in danh_sach:
    SinhVien.objects.create(
        ma_sinh_vien=sv["ma_sv"],
        ho_ten=sv["ten"],
        email=f"{sv['ma_sv']}@student.stu.edu.vn"
    )
print(f"Đã thêm {len(danh_sach)} sinh viên")