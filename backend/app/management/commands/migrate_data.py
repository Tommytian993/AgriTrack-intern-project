from django.core.management.base import BaseCommand
from django.db import connection
from app.dbmodels.models import Farm, Crop, Harvest, HarvestCrop, YieldRecord


class Command(BaseCommand):
    help = 'Migrate data from old models to new models'

    def handle(self, *args, **options):
        self.stdout.write('Starting data migration...')
        
        # 清空新表
        YieldRecord.objects.all().delete()
        HarvestCrop.objects.all().delete()
        Harvest.objects.all().delete()
        Crop.objects.all().delete()
        Farm.objects.all().delete()
        
        # 从原始表复制数据到新表
        with connection.cursor() as cursor:
            # 复制团队数据到农场
            cursor.execute("""
                INSERT INTO app_farm (id, name)
                SELECT id, name FROM app.app_team
            """)
            
            # 复制球员数据到作物
            cursor.execute("""
                INSERT INTO app_crop (id, name)
                SELECT id, name FROM app.app_player
            """)
            
            # 复制游戏数据到收获
            cursor.execute("""
                INSERT INTO app_harvest (id, date, main_farm_id, other_farm_id)
                SELECT id, date, home_team_id, away_team_id FROM app.app_game
            """)
            
            # 复制游戏球员数据到收获作物
            cursor.execute("""
                INSERT INTO app_harvestcrop (
                    harvest_id, crop_id, farm_id, is_main_crop, area, yield_amount,
                    fertilizer_used, irrigation_times, pesticide_used, disease_events,
                    harvest_times, replant_times, weed_events, soil_events,
                    organic_input_times, organic_input_total, machinery_used,
                    machinery_total, test_sample_count, test_sample_total
                )
                SELECT 
                    game_id, player_id, team_id, is_starter, minutes, points,
                    assists, offensive_rebounds, defensive_rebounds, steals,
                    blocks, turnovers, defensive_fouls, offensive_fouls,
                    free_throws_made, free_throws_attempted, two_pointers_made,
                    two_pointers_attempted, three_pointers_made, three_pointers_attempted
                FROM app.app_gameplayer
            """)
            
            # 复制投篮数据到产量记录
            cursor.execute("""
                INSERT INTO app_yieldrecord (
                    harvest_crop_id, is_harvested, field_location_x, field_location_y
                )
                SELECT 
                    s.game_player_id, s.is_make, s.location_x, s.location_y
                FROM app.app_shot s
                JOIN app.app_gameplayer gp ON s.game_player_id = gp.id
            """)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully migrated data!')
        ) 