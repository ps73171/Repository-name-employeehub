from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.v1.auth import require_roles
from app.db.database import get_db
from app.db.models import AuditLog, User


router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


@router.get("/")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin"])
    ),
):

    logs = (
        db.query(AuditLog)
        .order_by(
            AuditLog.created_at.desc()
        )
        .all()
    )

    return logs