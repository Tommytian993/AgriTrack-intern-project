# AgriTrack - Agricultural Data Management System

## Project Overview

AgriTrack is a data storing and visualization site, developed with Angular Django and PostgreSQL, that aims to help farmers track to farm operations, crop yields, harvest data and etc.

This project was developed during my last internship at Cool Crops from Feb 2024 to May 2024, this oppotunity allowed me to learn more about web development and agriculture data analytics.



## Database Schema
- Farms: Contain ID and Name of farms
- Crops: Contain ID and Name of crops
- Harvests: Harvest event, with date, location and id.
- HarvestCrops: Specific crop performance during a harvest event
- YieldRecords: Geographic coordinates of the harvested crop

## API Endpoints

### Crop Summary
```
GET /api/v1/cropSummary/{cropID}
```
Returns: 
- crop id
- farm data
- harvest events
- performance and specific harvest data
- yield geography

## Install relevent packages and Run
- Python
- PostgreSQL
- pip

Clone repo
Dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
Database Configuration
   ```bash
   createdb agriproject
   createuser agriproject
   ```
Create migrations
   ```bash
   python manage.py migrate
   ```
Run Server
   ```bash
   python manage.py runserver
   ```
