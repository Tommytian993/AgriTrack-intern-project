# -*- coding: utf-8 -*-
import logging
from functools import partial
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from app.dbmodels import models  

LOGGER = logging.getLogger('django')


# 转 snake_case → camelCase
def snake_to_camel(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class CropSummary(APIView):
    logger = LOGGER

    def get(self, request, cropID):
        """Return crop data (原 PlayerSummary)"""
        crop = get_object_or_404(models.Crop, id=cropID)

        # 顶层返回结构
        data = {
            'name': crop.name,
            'harvests': []
        }

        # 关联的 HarvestCrop 记录
        harvest_crops = models.HarvestCrop.objects.filter(crop=crop)

        # 统计字段列表
        fields = [
            'is_main_crop', 'area', 'yield_amount', 'fertilizer_used',
            'irrigation_times', 'pesticide_used', 'disease_events',
            'harvest_times', 'replant_times', 'weed_events', 'soil_events',
            'organic_input_times', 'organic_input_total',
            'machinery_used', 'machinery_total',
            'test_sample_count', 'test_sample_total',
        ]

        for hc in harvest_crops:
            harvest_data = {
                'date': hc.harvest.date.strftime('%Y-%m-%d'),
            }

            # 逐字段复制并转 camelCase
            for field in fields:
                harvest_data[snake_to_camel(field)] = getattr(hc, field)

            # YieldRecord 明细
            records = hc.yield_records.all()
            record_list = [{
                'isHarvested': r.is_harvested,
                'fieldLocationX': r.field_location_x,
                'fieldLocationY': r.field_location_y,
            } for r in records]

            harvest_data['yieldRecords'] = record_list
            data['harvests'].append(harvest_data)

        return Response(data)
