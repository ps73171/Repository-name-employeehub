import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import (
    audit_logs,
    auth,
    departments,
    employees,
    health,
    users,
)
from app.core.config import settings
from app.core.logging import get_logger, setup_logging


# --------------------------------------------------
# Logging
# --------------------------------------------------

setup_logging()

logger = get_logger(__name__)


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "EmployeeHub Enterprise "
        "Employee Management Platform API"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)


# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request ID Middleware
# --------------------------------------------------

@app.middleware("http")
async def request_id_middleware(
    request: Request,
    call_next,
):
    request_id = request.headers.get(
        "X-Request-ID",
        str(uuid.uuid4()),
    )

    request.state.request_id = request_id

    response = await call_next(request)

    response.headers[
        "X-Request-ID"
    ] = request_id

    return response


# --------------------------------------------------
# Request Logging Middleware
# --------------------------------------------------

@app.middleware("http")
async def request_logging_middleware(
    request: Request,
    call_next,
):
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time = (
        time.perf_counter()
        - start_time
    )

    logger.info(
        "%s %s | Status: %s | Time: %.4fs",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )

    return response


# --------------------------------------------------
# Security Headers Middleware
# --------------------------------------------------

@app.middleware("http")
async def security_headers_middleware(
    request: Request,
    call_next,
):
    response = await call_next(request)

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    response.headers[
        "X-Frame-Options"
    ] = "DENY"

    response.headers[
        "X-XSS-Protection"
    ] = "1; mode=block"

    response.headers[
        "Referrer-Policy"
    ] = "strict-origin-when-cross-origin"

    return response


# --------------------------------------------------
# API Routers
# --------------------------------------------------

app.include_router(
    health.router,
    prefix="/api/v1",
)

app.include_router(
    auth.router,
    prefix="/api/v1",
)

app.include_router(
    employees.router,
    prefix="/api/v1",
)

app.include_router(
    departments.router,
    prefix="/api/v1",
)

app.include_router(
    users.router,
    prefix="/api/v1",
)

app.include_router(
    audit_logs.router,
    prefix="/api/v1",
)


# --------------------------------------------------
# Root Endpoint
# --------------------------------------------------

@app.get(
    "/",
    tags=["System"],
)
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "running",
    }


# --------------------------------------------------
# Application Health
# --------------------------------------------------

@app.get(
    "/health",
    tags=["System"],
)
def application_health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
    }


# --------------------------------------------------
# Global Exception Handler
# --------------------------------------------------

@app.exception_handler(
    Exception
)
async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    request_id = getattr(
        request.state,
        "request_id",
        "unknown",
    )

    logger.exception(
        "Unhandled exception | "
        "Request ID: %s | "
        "Path: %s",
        request_id,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": (
                "An unexpected error occurred"
            ),
            "request_id": request_id,
        },
    )