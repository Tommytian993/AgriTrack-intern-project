# AgriTrack - Agricultural Data Management System

## Project Overview

AgriTrack is a agricultural data storing and visualization system designed to track crop yields, farm operations, and harvest data. This project was developed as part of my internship experience, focusing on modern web development practices and data analytics.

## Features
- Data visualization for agricultural data of specific crop or harvest events
- Tech Stack: Angular, Django, PostgreSQL

## Database Schema

The system uses a domain-specific schema designed for agricultural data:

- **Farms**: Agricultural land units
- **Crops**: Plant species being cultivated
- **Harvests**: Collection events with date and location
- **HarvestCrops**: Individual crop performance during harvests
- **YieldRecords**: Detailed yield data with geographic coordinates

## API Endpoints

### Crop Summary
```
GET /api/v1/cropSummary/{cropID}
```
Returns comprehensive data for a specific crop including:
- Basic crop information
- Historical harvest data
- Performance metrics
- Geographic yield records

## Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip

### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Configure database:
   ```bash
   # Create PostgreSQL database and user
   createdb agriproject
   createuser agriproject
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```
