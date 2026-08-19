from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Q, F
from collections import Counter
from statistics import mean
from .models import EnqueteMobilite
import json
from django.shortcuts import render


class DashboardAPIView(APIView):
    """
    API View pour le dashboard d'analyse des données d'enquête
    """
    
    def get(self, request):
        try:
            # Récupérer toutes les réponses
            enquetes = EnqueteMobilite.objects.all()
            total_reponses = enquetes.count()
            
            if total_reponses == 0:
                return Response({
                    "message": "Aucune donnée disponible",
                    "total_reponses": 0
                })
            
            # 1. STATISTIQUES GÉNÉRALES
            stats_generales = {
                "total_reponses": total_reponses,
                "derniere_reponse": enquetes.latest('date_creation').date_creation.strftime("%d/%m/%Y %H:%M"),
                "premiere_reponse": enquetes.earliest('date_creation').date_creation.strftime("%d/%m/%Y %H:%M")
            }
            
            # 2. RÉPARTITION PAR STATUT
            repartition_statut = list(enquetes.values('status').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 3. MODES DE TRANSPORT PRINCIPAUX
            modes_transport = list(enquetes.values('mode_transport_actuel').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 4. SATISFACTION ORGANISATION
            satisfaction_data = list(enquetes.values('satisfaction_organisation_deplacement_inbtp').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 5. FRÉQUENCE DE DÉPLACEMENT
            frequence_data = list(enquetes.values('fequenceDeplacement').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 6. NIVEAU D'ÉTUDE
            niveau_etude_data = list(enquetes.values('niveauEtude').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 7. TEMPS DE DÉPLACEMENT
            temps_deplacement_data = list(enquetes.values('temps_deplacement').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 8. CONFLITS ENTRE USAGERS
            conflits_data = list(enquetes.values('confli_entre_usage').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 9. SITUATIONS DANGEREUSES
            situations_dangereuses = enquetes.filter(situation_dangereuse="Oui").count()
            pourcentage_dangereux = (situations_dangereuses / total_reponses) * 100
            
            # 10. AMÉNAGEMENTS PRIORITAIRES (analyse JSON)
            amenagements_prioritaires = []
            for enquete in enquetes:
                if enquete.amenagement_prioritaire:
                    try:
                        if isinstance(enquete.amenagement_prioritaire, str):
                            items = json.loads(enquete.amenagement_prioritaire)
                        else:
                            items = enquete.amenagement_prioritaire
                        
                        if isinstance(items, list):
                            amenagements_prioritaires.extend(items)
                    except:
                        continue
            
            top_amenagements = Counter(amenagements_prioritaires).most_common(10)
            
            # 11. DIFFICULTÉS RENCONTRÉES (analyse JSON)
            difficultes_list = []
            for enquete in enquetes:
                if enquete.difficulte_proximite_inbtp:
                    try:
                        if isinstance(enquete.difficulte_proximite_inbtp, str):
                            items = json.loads(enquete.difficulte_proximite_inbtp)
                        else:
                            items = enquete.difficulte_proximite_inbtp
                        
                        if isinstance(items, list):
                            difficultes_list.extend(items)
                    except:
                        continue
            
            top_difficultes = Counter(difficultes_list).most_common(10)
            
            # 12. AMÉNAGEMENTS SOUHAITÉS (analyse JSON)
            amenagements_souhaites_list = []
            for enquete in enquetes:
                if enquete.amenagements_souhaites:
                    try:
                        if isinstance(enquete.amenagements_souhaites, str):
                            items = json.loads(enquete.amenagements_souhaites)
                        else:
                            items = enquete.amenagements_souhaites
                        
                        if isinstance(items, list):
                            amenagements_souhaites_list.extend(items)
                    except:
                        continue
            
            top_souhaits = Counter(amenagements_souhaites_list).most_common(10)
            
            # 13. RÉPARTITION PAR MOMENT D'ARRIVÉE
            moment_arrivee_data = list(enquetes.values('moment_arrivee').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 14. RÉPARTITION PAR MOMENT DE DÉPART
            moment_depart_data = list(enquetes.values('moment_depart').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 15. LIEU DE DESCENTE
            lieu_descente_data = list(enquetes.values('lieu_de_descente').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 16. TEMPS DEPUIS DESCENTE
            temps_descente_data = list(enquetes.values('temps_deplacement_descente_inbtp').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 17. COMBINAISON TRANSPORT
            combinaison_data = list(enquetes.values('combinaison_transport').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 18. AMÉNAGEMENT PIÉTONS/MOTO/BUS
            amenagement_pmb_data = list(enquetes.values('amenagement_pietons_mot_bus').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 19. DISPONIBILITÉ AMÉNAGEMENT PIÉTONS
            disponibilite_pietons_data = list(enquetes.values('disponibilit_amenagement_pieto_autour_inbtp').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 20. ABSENCE ESPACE AMÉNAGÉ
            absence_espace_data = list(enquetes.values('absence_espace_amenage_et_difficulte_de_circulation').annotate(
                count=Count('id')
            ).order_by('-count'))
            
            # 21. ÉVOLUTION TEMPORELLE (par jour)
            evolution_data = list(enquetes.extra(
                select={'date': 'DATE(date_creation)'}
            ).values('date').annotate(
                count=Count('id')
            ).order_by('date'))
            
            # Préparer la réponse
            response_data = {
                "stats_generales": stats_generales,
                "repartition_statut": repartition_statut,
                "modes_transport": modes_transport,
                "satisfaction": satisfaction_data,
                "frequence_deplacement": frequence_data,
                "niveau_etude": niveau_etude_data,
                "temps_deplacement": temps_deplacement_data,
                "conflits": conflits_data,
                "situations_dangereuses": {
                    "total": situations_dangereuses,
                    "pourcentage": round(pourcentage_dangereux, 2)
                },
                "top_amenagements": [{"nom": item[0], "count": item[1]} for item in top_amenagements],
                "top_difficultes": [{"nom": item[0], "count": item[1]} for item in top_difficultes],
                "top_souhaits": [{"nom": item[0], "count": item[1]} for item in top_souhaits],
                "moment_arrivee": moment_arrivee_data,
                "moment_depart": moment_depart_data,
                "lieu_descente": lieu_descente_data,
                "temps_descente": temps_descente_data,
                "combinaison_transport": combinaison_data,
                "amenagement_pmb": amenagement_pmb_data,
                "disponibilite_pietons": disponibilite_pietons_data,
                "absence_espace": absence_espace_data,
                "evolution_temporelle": evolution_data,
                "metadata": {
                    "total_categories": 21,
                    "derniere_mise_a_jour": "maintenant"
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "error": str(e),
                "message": "Erreur lors de la génération du dashboard"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStatsAPIView(APIView):
    """
    API View pour les statistiques rapides (widgets)
    """
    
    def get(self, request):
        try:
            enquetes = EnqueteMobilite.objects.all()
            total = enquetes.count()
            
            if total == 0:
                return Response({
                    "total_reponses": 0,
                    "stats_rapides": []
                })
            
            # Statistiques rapides pour les widgets
            stats_rapides = [
                {
                    "titre": "Total Réponses",
                    "valeur": total,
                    "icone": "users",
                    "couleur": "blue",
                    "tendance": "+"
                },
                {
                    "titre": "Situations Dangereuses",
                    "valeur": enquetes.filter(situation_dangereuse="Oui").count(),
                    "icone": "alert-triangle",
                    "couleur": "red",
                    "pourcentage": round((enquetes.filter(situation_dangereuse="Oui").count() / total) * 100, 1)
                },
                {
                    "titre": "Satisfaits",
                    "valeur": enquetes.filter(
                        Q(satisfaction_organisation_deplacement_inbtp__icontains="satisfaisant") |
                        Q(satisfaction_organisation_deplacement_inbtp__icontains="très")
                    ).count(),
                    "icone": "thumbs-up",
                    "couleur": "green",
                    "pourcentage": round((enquetes.filter(
                        Q(satisfaction_organisation_deplacement_inbtp__icontains="satisfaisant") |
                        Q(satisfaction_organisation_deplacement_inbtp__icontains="très")
                    ).count() / total) * 100, 1)
                },
                {
                    "titre": "Conflits Fréquents",
                    "valeur": enquetes.filter(
                        Q(confli_entre_usage__icontains="fréquemment") |
                        Q(confli_entre_usage__icontains="très")
                    ).count(),
                    "icone": "alert-octagon",
                    "couleur": "orange",
                    "pourcentage": round((enquetes.filter(
                        Q(confli_entre_usage__icontains="fréquemment") |
                        Q(confli_entre_usage__icontains="très")
                    ).count() / total) * 100, 1)
                }
            ]
            
            return Response({
                "total_reponses": total,
                "stats_rapides": stats_rapides,
                "derniere_mise_a_jour": "maintenant"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "error": str(e),
                "message": "Erreur lors de la récupération des statistiques"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def dashboard_page(request):
    """
    Vue pour afficher la page HTML du dashboard
    """
    return render(request, 'dashboard/index.html')