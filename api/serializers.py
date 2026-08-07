from rest_framework import serializers
from .models import EnqueteMobilite

class EnqueteMobiliteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnqueteMobilite
        fields = '__all__'

