from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SinhVien, DiemDanh
from .serializers import SinhVienSerializer, DiemDanhSerializer

@api_view(['GET'])
def sinh_vien_api(request):
    sinh_viens = SinhVien.objects.all()
    serializer = SinhVienSerializer(sinh_viens, many=True)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['POST'])
def diem_danh(request):
    ma_sinh_vien = request.data.get('ma_sinh_vien')
    if not ma_sinh_vien:
        return Response({'error': 'Thiếu mã sinh viên'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        sinh_vien = SinhVien.objects.get(ma_sinh_vien=ma_sinh_vien)
        diem_danh = DiemDanh.objects.create(sinh_vien=sinh_vien)
        serializer = DiemDanhSerializer(diem_danh)
        
        return Response({
            'status': 'Thành công',
            'data': {
                'sinh_vien': SinhVienSerializer(sinh_vien).data,
                'thoi_gian': serializer.data['thoi_gian']
            }
        }, status=status.HTTP_200_OK)
    except SinhVien.DoesNotExist:
        return Response({'error': 'Sinh viên không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def lich_su_diem_danh(request):
    diem_danh = DiemDanh.objects.all().order_by('-thoi_gian')
    serializer = DiemDanhSerializer(diem_danh, many=True)
    return Response({'status': 'success', 'data': serializer.data})

class SinhVienViewSet(viewsets.ModelViewSet):
    queryset = SinhVien.objects.all()
    serializer_class = SinhVienSerializer