from django.db import models

class EnqueteMobilite(models.Model):
    
    absence_espace_amenage_et_difficulte_de_circulation=models.CharField(max_length=20)
    amenagement_pietons_mot_bus=models.CharField(max_length=50)
    amenagement_prioritaire=models.JSONField(default=list)
    amenagements_souhaites=models.JSONField(default=list)
    combinaison_transport=models.CharField(max_length=15)
    combinaison_utilisee=models.CharField(max_length=100)
    confli_entre_usage=models.CharField(max_length=45)
    difficulte_proximite_inbtp=models.JSONField(default=list)
    disponibilit_amenagement_pieto_autour_inbtp=models.CharField(max_length=50)
    fequenceDeplacement=models.CharField(max_length=100)
    lieu_de_descente=models.CharField(max_length=100)
    mode_transport_actuel=models.CharField(max_length=50)
    moment_arrivee=models.CharField(max_length=100)
    moment_depart=models.CharField(max_length=50)
    niveauEtude=models.CharField(max_length=20)
    residence= models.JSONField(default=list)
    satisfaction_organisation_deplacement_inbtp=models.CharField(max_length=30)
    situation_dangereuse=models.CharField(max_length=20)
    situation_dangereuse_details=models.TextField(null=True,blank=True)
    status=models.CharField(max_length=30)
    temps_deplacement=models.CharField(max_length=40)
    temps_deplacement_descente_inbtp=models.CharField(max_length=45)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Réponse à l'enquête"
        verbose_name_plural = "Réponses à l'enquête"
        ordering = ["-date_creation"]

    def __str__(self):
        return f"{self.status} - {self.commune} ({self.date_creation:%d/%m/%Y})"