from django.shortcuts import render
from rest_framework.views import APIView
from api.serializers import EnqueteMobiliteSerializer
from rest_framework.response import Response
from rest_framework import status

from collections import Counter, defaultdict
from statistics import mean

from django.db.models import Avg, Count
from .models import EnqueteMobilite


import csv
from django.http import HttpResponse
from .models import EnqueteMobilite



class CouCouViewSet(APIView):
    def get(self, request,*agrs,**kwargs):
        return Response({"message": "coucou"}, status=status.HTTP_200_OK)

# # Create your views here.
class EnqueteMobiliteViewSet(APIView):
    def get(self, request,*args, **kwargs):
        data=EnqueteMobilite.objects.all()
        serializer=EnqueteMobiliteSerializer(data,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
    def post(self, request,*args, **kwargs):
        try:
            data = request.data
            serialier=EnqueteMobiliteSerializer(data=data)
            if serialier.is_valid():
                serialier.save()
                return Response(serialier.data, status=status.HTTP_201_CREATED)
            return Response(serialier.errors, status=status.HTTP_400_BAD_REQUEST)   
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# class ExportCSVAPIView(APIView):
