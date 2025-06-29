# Generated by Django 5.0.4 on 2025-06-23 12:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Crop",
            fields=[
                ("id", models.IntegerField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Farm",
            fields=[
                ("id", models.IntegerField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Harvest",
            fields=[
                ("id", models.IntegerField(primary_key=True, serialize=False)),
                ("date", models.DateField()),
                (
                    "main_farm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="main_harvests",
                        to="app.farm",
                    ),
                ),
                (
                    "other_farm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="other_harvests",
                        to="app.farm",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="HarvestCrop",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("is_main_crop", models.BooleanField()),
                ("area", models.IntegerField()),
                ("yield_amount", models.IntegerField()),
                ("fertilizer_used", models.IntegerField()),
                ("irrigation_times", models.IntegerField()),
                ("pesticide_used", models.IntegerField()),
                ("disease_events", models.IntegerField()),
                ("harvest_times", models.IntegerField()),
                ("replant_times", models.IntegerField()),
                ("weed_events", models.IntegerField()),
                ("soil_events", models.IntegerField()),
                ("organic_input_times", models.IntegerField()),
                ("organic_input_total", models.IntegerField()),
                ("machinery_used", models.IntegerField()),
                ("machinery_total", models.IntegerField()),
                ("test_sample_count", models.IntegerField()),
                ("test_sample_total", models.IntegerField()),
                (
                    "crop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="harvest_crops",
                        to="app.crop",
                    ),
                ),
                (
                    "farm",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="farm_crops",
                        to="app.farm",
                    ),
                ),
                (
                    "harvest",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="harvest_crops",
                        to="app.harvest",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="YieldRecord",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("is_harvested", models.BooleanField()),
                ("field_location_x", models.FloatField()),
                ("field_location_y", models.FloatField()),
                (
                    "harvest_crop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="yield_records",
                        to="app.harvestcrop",
                    ),
                ),
            ],
        ),
    ]
