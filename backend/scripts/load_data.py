# -*- coding: utf-8 -*-
"""
Load farms, crops, harvests (含 harvestCrops 与 yieldRecords) into the DB.
JSON files expected in backend_dir/raw_data:
    - farms.json
    - crops.json
    - harvests.json
"""

import os
import sys
import django
import json
import re
from django.conf import settings

# ---------- Django setup ----------
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.append(backend_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from app.dbmodels.models import (
    Farm, Crop, Harvest, HarvestCrop, YieldRecord
)

# ---------- helpers ----------
def camel_to_snake(name: str) -> str:
    """camelCase → snake_case"""
    s1 = re.sub(r'(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

# ---------- load farms ----------
def load_farms():
    path = os.path.join(backend_dir, 'raw_data', 'farms.json')
    with open(path, 'r', encoding='utf-8') as f:
        farms = json.load(f)
    for farm_data in farms:
        Farm.objects.update_or_create(
            id=farm_data['id'],
            defaults={'name': farm_data['name']}
        )

# ---------- load crops ----------
def load_crops():
    path = os.path.join(backend_dir, 'raw_data', 'crops.json')
    with open(path, 'r', encoding='utf-8') as f:
        crops = json.load(f)
    for crop_data in crops:
        Crop.objects.update_or_create(
            id=crop_data['id'],
            defaults={'name': crop_data['name']}
        )

# ---------- load harvest & nested data ----------
def load_harvests():
    path = os.path.join(backend_dir, 'raw_data', 'harvests.json')
    with open(path, 'r', encoding='utf-8') as f:
        harvests = json.load(f)

    for h_data in harvests:
        main_farm = Farm.objects.get(id=h_data['mainFarm']['id'])
        other_farm = Farm.objects.get(id=h_data['otherFarm']['id'])

        harvest, _ = Harvest.objects.update_or_create(
            id=h_data['id'],
            defaults={
                'date': h_data['date'],
                'main_farm': main_farm,
                'other_farm': other_farm,
            }
        )
        # load crops for the two farms
        _load_harvest_crops(harvest, h_data['mainFarm'], main_farm)
        _load_harvest_crops(harvest, h_data['otherFarm'], other_farm)

def _load_harvest_crops(harvest, farm_block, farm_obj):
    """farm_block = dict with keys id, crops[list]"""
    for crop_stats in farm_block['crops']:
        crop_obj = Crop.objects.get(id=crop_stats['id'])
        # split stats vs yieldRecords
        stats = {
            camel_to_snake(k): v
            for k, v in crop_stats.items()
            if k not in ['id', 'yieldRecords']
        }
        hc, _ = HarvestCrop.objects.update_or_create(
            harvest=harvest,
            crop=crop_obj,
            defaults={'farm': farm_obj, **stats}
        )
        _load_yield_records(hc, crop_stats.get('yieldRecords', []))

def _load_yield_records(hc, records):
    for rec in records:
        rec_snake = {camel_to_snake(k): v for k, v in rec.items()}
        YieldRecord.objects.create(harvest_crop=hc, **rec_snake)

# ---------- main ----------
if __name__ == '__main__':
    load_farms()
    load_crops()
    load_harvests()
    print("✔  All agricultural data imported.")
