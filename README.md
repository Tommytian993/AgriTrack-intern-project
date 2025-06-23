# AgriTrack - Agricultural Data Management System

## Project Overview

AgriTrack is a comprehensive agricultural data management system designed to track crop yields, farm operations, and harvest data. This project was developed as part of my internship experience, focusing on modern web development practices and data analytics.

## Features

- **Crop Management**: Track individual crops with detailed performance metrics
- **Farm Operations**: Monitor farm activities including irrigation, fertilization, and pest control
- **Harvest Tracking**: Record harvest data with location-based yield information
- **Data Analytics**: RESTful API for data retrieval and analysis
- **Modern Tech Stack**: Django backend with PostgreSQL database

## Technology Stack

### Backend
- **Framework**: Django 4.x with Django REST Framework
- **Database**: PostgreSQL with custom agricultural schema
- **API**: RESTful endpoints for data access
- **Authentication**: Django's built-in authentication system

### Frontend (Planned)
- **Framework**: Angular/React (to be implemented)
- **UI**: Modern responsive design
- **Charts**: Data visualization for agricultural metrics

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
