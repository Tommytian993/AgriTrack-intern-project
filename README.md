# AgriTrack - Agricultural Data Management System

## Project Features

AgriTrack is a agricultural data storing and visualization system designed to track crop yields, farm operations, and harvest data. This project was developed as part of my internship experience, focusing on modern web development practices and data analytics.

- Data visualization for agricultural data of specific crop or harvest events
- Tech Stack: Angular, Django, PostgreSQL

## Database Schema
- **Farms**: Agricultural land units
- **Crops**: Plant species being cultivated
- **Harvests**: Harvest event, with date, location and id.
- **HarvestCrops**: Specific crop performance during a harvest event
- **YieldRecords**: Geographic coordinates of the harvested crop

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
