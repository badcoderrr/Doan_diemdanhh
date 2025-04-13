import os
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hethong_diemdanh.settings')
django.setup()

from diemdanh.models import SinhVien

def update_emails():
    count = 0
    for sv in SinhVien.objects.filter(email__isnull=True):
        sv.email = f"{sv.ma_sinh_vien}@student.stu.edu.vn"
        sv.save()
        count += 1
    print(f"Đã cập nhật {count} sinh viên")

if __name__ == "__main__":
    update_emails()