# AgriTrack - Agricultural Data Management System

## Project Overview

AgriTrack is a data storing and visualization site, that aims to help farmers track crop yields, farm operations, and harvest data.

This project was developed during my last internship at Cool Crops from Feb 2024 to May 2024, this oppotunity allowed me to learn more about web development and agriculture data analytics.

Tech Stack: Angular, Django, PostgreSQL

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

## Installation & Setup
- Python 3.8+
- PostgreSQL 12+
- pip

### Backend Setup
1 Clone repo
2 Dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3 Database Configuration
   ```bash
   createdb agriproject
   createuser agriproject
   ```
4 Create migrations
   ```bash
   python manage.py migrate
   ```
5 Run Server
   ```bash
   python manage.py runserver
   ```
