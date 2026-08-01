from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user, require_roles
from app.db.database import get_db
from app.db.models import Department, User
from app.schemas.department import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)


router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)


@router.post(
    "/",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_department(
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin", "hr"])
    ),
):

    existing = (
        db.query(Department)
        .filter(
            Department.name
            == department_data.name
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Department already exists",
        )

    department = Department(
        **department_data.model_dump()
    )

    db.add(department)
    db.commit()
    db.refresh(department)

    return department


@router.get(
    "/",
    response_model=list[DepartmentResponse],
)
def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    return (
        db.query(Department)
        .filter(
            Department.is_active == True
        )
        .all()
    )


@router.get(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def get_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    department = (
        db.query(Department)
        .filter(
            Department.id
            == department_id
        )
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found",
        )

    return department


@router.put(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def update_department(
    department_id: int,
    department_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin", "hr"])
    ),
):

    department = (
        db.query(Department)
        .filter(
            Department.id
            == department_id
        )
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found",
        )

    update_data = (
        department_data
        .model_dump(
            exclude_unset=True
        )
    )

    for field, value in update_data.items():
        setattr(
            department,
            field,
            value,
        )

    db.commit()
    db.refresh(department)

    return department


@router.delete(
    "/{department_id}",
)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin"])
    ),
):

    department = (
        db.query(Department)
        .filter(
            Department.id
            == department_id
        )
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=404,
            detail="Department not found",
        )

    department.is_active = False

    db.commit()

    return {
        "message": (
            "Department deactivated successfully"
        ),
        "department_id": department_id,
    }