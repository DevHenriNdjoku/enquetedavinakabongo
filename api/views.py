from django.shortcuts import render
from rest_framework.views import APIView
from api.serializers import EnqueteMobiliteSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

from django.http import HttpResponse
from django.utils import timezone
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter
from io import BytesIO
import json

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



class ExportEnqueteExcelAPIView(APIView):
    """Télécharge toutes les réponses de l'enquête dans un fichier Excel."""

    # Les réponses contiennent des données d'enquête : réserver l'export au staff.
    # permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        headers = [
            ("id", "ID"),
            ("date_creation", "Date de création"),
            ("status", "Statut"),
            ("niveauEtude", "Niveau d'étude"),
            ("residence", "Lieu de résidence"),
            ("fequenceDeplacement", "Fréquence des déplacements"),
            ("moment_arrivee", "Heure d'arrivée"),
            ("moment_depart", "Heure de départ"),
            ("mode_transport_actuel", "Mode de transport"),
            ("combinaison_transport", "Combinaison de transports"),
            ("combinaison_utilisee", "Combinaison utilisée"),
            ("temps_deplacement", "Temps de déplacement"),
            ("lieu_de_descente", "Lieu de descente"),
            ("temps_deplacement_descente_inbtp", "Temps à pied depuis la descente"),
            ("satisfaction_organisation_deplacement_inbtp", "Satisfaction"),
            ("difficulte_proximite_inbtp", "Difficultés à proximité"),
            ("confli_entre_usage", "Conflits entre usagers"),
            ("situation_dangereuse", "Situation dangereuse"),
            ("situation_dangereuse_details", "Détails de la situation dangereuse"),
            ("absence_espace_amenage_et_difficulte_de_circulation", "Absence d'espace aménagé"),
            ("amenagement_pietons_mot_bus", "Aménagement piétons, motos et bus"),
            ("disponibilit_amenagement_pieto_autour_inbtp", "Disponibilité des aménagements piétons"),
            ("amenagement_prioritaire", "Aménagements prioritaires"),
            ("amenagements_souhaites", "Aménagements souhaités"),
        ]

        workbook = Workbook()
        worksheet = workbook.active
        worksheet.title = "Réponses mobilité"
        worksheet.append([label for _, label in headers])

        header_fill = PatternFill(fill_type="solid", fgColor="1F4E78")
        for cell in worksheet[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = header_fill

        for response in EnqueteMobilite.objects.all().iterator():
            row = []
            for field_name, _ in headers:
                value = getattr(response, field_name)
                if isinstance(value, (list, dict)):
                    value = json.dumps(value, ensure_ascii=False)
                elif hasattr(value, "isoformat"):
                    value = timezone.localtime(value).strftime("%Y-%m-%d %H:%M:%S")

                # Treat user-entered strings as text, not Excel formulas.
                if isinstance(value, str) and value.lstrip().startswith(("=", "+", "-", "@")):
                    value = "'" + value
                row.append(value)
            worksheet.append(row)

        worksheet.freeze_panes = "A2"
        worksheet.auto_filter.ref = worksheet.dimensions
        for column_index, (_, label) in enumerate(headers, start=1):
            max_length = max(
                len(label),
                max((len(str(worksheet.cell(row, column_index).value or "")) for row in range(2, worksheet.max_row + 1)), default=0),
            )
            worksheet.column_dimensions[get_column_letter(column_index)].width = min(max_length + 2, 50)

        output = BytesIO()
        workbook.save(output)
        output.seek(0)

        filename = f"enquete_mobilite_{timezone.localdate():%Y-%m-%d}.xlsx"
        response = HttpResponse(
            output.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        response["X-Content-Type-Options"] = "nosniff"
        return response
