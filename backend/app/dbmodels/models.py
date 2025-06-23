from django.db import models


# Team → Farm
class Farm(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)


# Player → Crop
class Crop(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)


# Game → Harvest
class Harvest(models.Model):
    id = models.IntegerField(primary_key=True)
    date = models.DateField()
    main_farm = models.ForeignKey(Farm, related_name='main_harvests', on_delete=models.CASCADE)
    other_farm = models.ForeignKey(Farm, related_name='other_harvests', on_delete=models.CASCADE)


# GamePlayer → HarvestCrop
class HarvestCrop(models.Model):
    harvest = models.ForeignKey(Harvest, related_name='harvest_crops', on_delete=models.CASCADE)
    crop = models.ForeignKey(Crop, related_name='harvest_crops', on_delete=models.CASCADE)
    farm = models.ForeignKey(Farm, related_name='farm_crops', on_delete=models.CASCADE)

    is_main_crop = models.BooleanField()          
    area = models.IntegerField()                  
    yield_amount = models.IntegerField()          # was points
    fertilizer_used = models.IntegerField()       # was ass ists
    irrigation_times = models.IntegerField()      # was offensive_rebounds
    pesticide_used = models.IntegerField()        # was defensive_rebounds
    disease_events = models.IntegerField()        # was steals
    harvest_times = models.IntegerField()         # was blocks
    replant_times = models.IntegerField()         # was turnovers
    weed_events = models.IntegerField()           # was defensive_fouls
    soil_events = models.IntegerField()           # was offensive_fouls
    organic_input_times = models.IntegerField()   # was free_throws_made
    organic_input_total = models.IntegerField()   # was free_throws_attempted
    machinery_used = models.IntegerField()        # was two_pointers_made
    machinery_total = models.IntegerField()       # was two_pointers_attempted
    test_sample_count = models.IntegerField()     # was three_pointers_made
    test_sample_total = models.IntegerField()     



# Shot → YieldRecord
class YieldRecord(models.Model):
    harvest_crop = models.ForeignKey(HarvestCrop, related_name='yield_records', on_delete=models.CASCADE)
    is_harvested = models.BooleanField()
    field_location_x = models.FloatField()        
    field_location_y = models.FloatField()        
