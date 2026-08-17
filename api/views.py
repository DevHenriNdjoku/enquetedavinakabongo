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




# class DashboardAPIView(APIView):

#     def get(self, request):

#         enquetes = list(EnqueteMobilite.objects.all())

#         total = len(enquetes)

#         if total == 0:
#             return Response({})

#         # -------------------------------------------------------
#         # Fonctions utilitaires
#         # -------------------------------------------------------

#         def distribution(field):
#             data = Counter(getattr(e, field) for e in enquetes)

#             return {
#                 "labels": list(data.keys()),
#                 "values": list(data.values())
#             }

#         def moyenne_prix():

#             valeurs = []

#             for e in enquetes:

#                 try:

#                     prix = (
#                         str(e.prix_acceptable)
#                         .replace("FC", "")
#                         .replace("fc", "")
#                         .replace(" ", "")
#                     )

#                     valeurs.append(int(prix))

#                 except:

#                     pass

#             return round(mean(valeurs), 0) if valeurs else 0

#         def top_json(field, limit=3):

#             compteur = Counter()

#             for e in enquetes:

#                 compteur.update(getattr(e, field))

#             top = compteur.most_common(limit)

#             return {
#                 "labels": [i[0] for i in top],
#                 "values": [i[1] for i in top]
#             }

#         def acceptation_par(field):

#             labels = []
#             favorables = []
#             defavorables = []

#             valeurs = defaultdict(lambda: {"oui": 0, "non": 0})

#             for e in enquetes:

#                 cle = getattr(e, field)

#                 if e.utilisation.lower().startswith("oui"):
#                     valeurs[cle]["oui"] += 1
#                 else:
#                     valeurs[cle]["non"] += 1

#             for k, v in valeurs.items():
#                 labels.append(k)
#                 favorables.append(v["oui"])
#                 defavorables.append(v["non"])

#             return {
#                 "labels": labels,
#                 "datasets": [
#                     {
#                         "label": "Favorable",
#                         "data": favorables
#                     },
#                     {
#                         "label": "Défavorable",
#                         "data": defavorables
#                     }
#                 ]
#             }

#         def impact_par(field):

#             groupes = defaultdict(list)

#             for e in enquetes:
#                 groupes[getattr(e, field)].append(e.impact_attente)

#             labels = []
#             values = []

#             for k, v in groupes.items():
#                 labels.append(k)
#                 values.append(round(mean(v), 1))

#             return {
#                 "labels": labels,
#                 "values": values
#             }

#         def pourcentage_acceptation_par_commune():

#             communes = defaultdict(lambda: {"oui": 0, "total": 0})

#             for e in enquetes:

#                 communes[e.commune]["total"] += 1

#                 if e.utilisation.lower().startswith("oui"):
#                     communes[e.commune]["oui"] += 1

#             labels = []
#             values = []

#             for commune, data in communes.items():

#                 labels.append(commune)

#                 values.append(
#                     round(
#                         (data["oui"] / data["total"]) * 100,
#                         1
#                     )
#                 )

#             return {
#                 "labels": labels,
#                 "values": values
#             }

#         # -------------------------------------------------------
#         # Calculs
#         # -------------------------------------------------------

#         favorables = sum(
#             1
#             for e in enquetes
#             if e.utilisation.lower().startswith("oui")
#         )

#         insatisfaits = sum(
#             1
#             for e in enquetes
#             if e.satisfaction.lower() in [
#                 "peu satisfait",
#                 "pas satisfait",
#                 "insatisfait"
#             ]
#         )

#         durees = []

#         for e in enquetes:

#             try:
#                 durees.append(int(e.duree))
#             except:
#                 pass

#         # -------------------------------------------------------
#         # Réponse
#         # -------------------------------------------------------

#         return Response({

#             "total_respondants": total,

#             "taux_acceptation":
#                 round((favorables / total) * 100, 1),

#             "taux_insatisfaction":
#                 round((insatisfaits / total) * 100, 1),

#             "temps_moyen":
#                 round(mean(durees), 0) if durees else 0,

#             "favorables_tramway":
#                 favorables,

#             "prix_moyen":
#                 moyenne_prix(),

#             "impact_moyen":
#                 round(
#                     EnqueteMobilite.objects.aggregate(
#                         Avg("impact_attente")
#                     )["impact_attente__avg"],
#                     1
#                 ),

#             "communes_count":
#                 EnqueteMobilite.objects.values("commune").distinct().count(),

#             "problemes_count":
#                 sum(len(e.problemes) for e in enquetes),

#             "age_distribution":
#                 distribution("age"),

#             "commune_distribution":
#                 distribution("commune"),

#             "activite_distribution":
#                 distribution("activite"),

#             "intention_utilisation":
#                 distribution("utilisation"),

#             "top_attentes":
#                 top_json("criteres"),

#             "frequence_utilisation":
#                 distribution("frequence_utilisation"),

#             "acceptation_par_age":
#                 acceptation_par("age"),

#             "acceptation_par_activite":
#                 acceptation_par("activite"),

#             "acceptation_par_commune":
#                 pourcentage_acceptation_par_commune(),

#             "impact_par_age":
#                 impact_par("age"),

#             "impact_par_activite":
#                 impact_par("activite"),

#             "transport_distribution":
#                 distribution("transport"),

#             "depenses_distribution":
#                 distribution("depense"),

#             "top_problemes":
#                 top_json("problemes")

#         })

class ExportCSVAPIView(APIView):

    def get(self, request):

        # Récupérer toutes les données
        data = EnqueteMobilite.objects.all()

        # Créer une réponse CSV
        response = HttpResponse(
            content_type="text/csv"
        )

        response["Content-Disposition"] = 'attachment; filename="enquete_mobilite_export.csv"'

        writer = csv.writer(response)

        # En-têtes CSV
        writer.writerow([
            "commune",
            "age",
            "activite",
            "frequence",
            "motif",
            "transport",
            "duree",
            "depense",
            "satisfaction",
            "problemes",
            "utilisation",
            "abandon_transport",
            "impact_attente",
            "prix_acceptable",
            "frequence_utilisation",
            "criteres",
            "moments_difficiles",
            "date",
            "created_at"
        ])

        # Données
        for ligne in data:
            writer.writerow([
                ligne.residence["commune"],
                ligne.age,
                ligne.activite,
                ligne.frequence,
                ligne.motif,
                ligne.transport,
                ligne.duree,
                ligne.depense,
                ligne.satisfaction,
                str(ligne.problemes),
                ligne.utilisation,
                ligne.abandon_transport,
                ligne.impact_attente,
                ligne.prix_acceptable,
                ligne.frequence_utilisation,
                str(ligne.criteres),
                ligne.moments_difficiles,
                ligne.date,
                ligne.created_at
            ])

        return response