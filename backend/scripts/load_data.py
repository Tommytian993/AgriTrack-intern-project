import os
import sys
import django
import json
import re
from django.conf import settings

# configure path base on the current system and set up django
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
sys.path.append(backend_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from app.dbmodels.models import Team, Player, Game, GamePlayer, Shot

# the field name in the json camelCase while in db model (by standard) I used snake_notation
# so this helper function used to convert to same format
def camel_to_snake(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

# first we load all teams data
def load_teams():
    with open(os.path.join(backend_dir, 'raw_data', 'teams.json'), 'r', encoding='utf-8') as f:
        teams = json.load(f)
        for team_data in teams:
            Team.objects.update_or_create(
                id=team_data['id'],
                defaults={'name': team_data['name']}
            )

# loading players data
def load_players():
    with open(os.path.join(backend_dir, 'raw_data', 'players.json'), 'r', encoding='utf-8') as f:
        players = json.load(f)
        for player_data in players:
            Player.objects.update_or_create(
                id=player_data['id'],
                defaults={'name': player_data['name']}
            )

def load_games():
    with open(os.path.join(backend_dir, 'raw_data', 'games.json'), 'r', encoding='utf-8') as f:
        games = json.load(f)
        for game_data in games:
            home_team = Team.objects.get(id=game_data['homeTeam']['id'])
            away_team = Team.objects.get(id=game_data['awayTeam']['id'])
            game, created = Game.objects.update_or_create(
                #base on this id, updates records
                id=game_data['id'], 
                defaults={ 
                    'date': game_data['date'],
                    'home_team': home_team,
                    'away_team': away_team
                }
            )
            load_game_players(game, game_data['homeTeam'], home_team)
            load_game_players(game, game_data['awayTeam'], away_team)

def load_game_players(game, team_data, team):
    for player_data in team_data['players']:
        #fetches from the Player table player's id 
        player = Player.objects.get(id=player_data['id'])
        stats = {camel_to_snake(k): v for k, v in player_data.items() if k not in ['id', 'shots']}
        game_player, created = GamePlayer.objects.update_or_create(
            # left game is field in GamePlayer model, right game the passed variable that holds current game instance.
            game=game,
            player=player,
            defaults={
                'team': team,
                # unpack and assign all the player's performance stats
                **stats
            }
        )
        # call and load the shot data list
        load_shots(game_player, player_data.get('shots', []))

def load_shots(game_player, shots_data):
    for shot_data in shots_data:
        shot_fields = {camel_to_snake(k): v for k, v in shot_data.items()}
        Shot.objects.create(
            # store the player object into the player field 
            game_player=game_player, 
            # unpack and store the shot data like location x y
            **shot_fields 
        )

if __name__ == '__main__':
    #finally execute them in this sequende
    load_teams()
    load_players()
    load_games()
