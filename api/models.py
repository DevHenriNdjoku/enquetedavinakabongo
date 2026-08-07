from django.db import models

class EnqueteMobilite(models.Model):
    # Lieu de résidence
    residence= models.JSONField(default=list)
     
    # Profil
    status = models.CharField(max_length=100)

    # Déplacements
    mode_transport_actuel = models.CharField(max_length=100)
    temps_deplacement = models.CharField(max_length=100)
    moment_arrivee = models.CharField(max_length=100)
    moment_depart = models.CharField(max_length=100)

    # Combinaison de transport
    combinaison_transport = models.CharField(max_length=10)
    itineraire_combinaison = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # Difficultés rencontrées
    problemes_deplacement = models.CharField(max_length=255)

    # Situation dangereuse
    situation_dangereuse = models.CharField(max_length=10)
    precision_situation_dangereuse = models.TextField(
        blank=True,
        null=True
    )

    # Organisation actuelle
    evaluation_organisation_deplacements = models.CharField(max_length=100)

    # Aménagements souhaités
    amenagements_souhaites = models.JSONField(default=list)

    # Avis sur le pôle multimodal
    avantage_pole_echange = models.CharField(max_length=255)

    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Réponse à l'enquête"
        verbose_name_plural = "Réponses à l'enquête"
        ordering = ["-date_creation"]

    def __str__(self):
        return f"{self.status} - {self.commune} ({self.date_creation:%d/%m/%Y})"