#!/usr/bin/env python3
"""
Production startup script for Quiz-Lib Backend
This script handles database initialization and starts the FastAPI server
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config.settings import settings
from app.db.connection import engine, get_session
from app.db.models import Base


async def init_database():
    """Initialize database tables"""
    print("🔄 Initializing database...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)


async def check_database_connection():
    """Check if database connection is working"""
    print("🔄 Checking database connection...")
    try:
        async with get_session() as session:
            await session.execute("SELECT 1")
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def main():
    """Main startup function"""
    print("🚀 Starting Quiz-Lib Backend...")
    print(f"📍 Environment: {'Production' if not settings.DEBUG else 'Development'}")
    print(f"🗄️  Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'Local'}")
    
    # Check if we're in a production environment
    if os.getenv("RENDER"):
        print("🌐 Running on Render platform")
    
    # Initialize database in production
    if not settings.DEBUG:
        asyncio.run(init_database())
    
    # Check database connection
    if not asyncio.run(check_database_connection()):
        sys.exit(1)
    
    print("✅ Startup checks completed successfully")
    print("🎯 Starting FastAPI server...")


if __name__ == "__main__":
    main()