from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user, require_roles
from app.db.database import get_db
from app.db.models import Employee, User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
)


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin", "hr"])
    ),
):

    existing_employee = (
        db.query(Employee)
        .filter(
            Employee.employee_code
            == employee_data.employee_code
        )
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=409,
            detail="Employee code already exists",
        )

    existing_email = (
        db.query(Employee)
        .filter(
            Employee.email
            == employee_data.email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Employee email already exists",
        )

    employee = Employee(
        **employee_data.model_dump()
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee


@router.get(
    "/",
    response_model=list[EmployeeResponse],
)
def get_employees(
    search: str | None = Query(
        default=None
    ),
    department_id: int | None = Query(
        default=None
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    query = db.query(Employee)

    if search:
        query = query.filter(
            (
                Employee.first_name
                .ilike(f"%{search}%")
            )
            | (
                Employee.last_name
                .ilike(f"%{search}%")
            )
            | (
                Employee.email
                .ilike(f"%{search}%")
            )
            | (
                Employee.employee_code
                .ilike(f"%{search}%")
            )
        )

    if department_id:
        query = query.filter(
            Employee.department_id
            == department_id
        )

    offset = (
        page - 1
    ) * page_size

    return (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    return employee


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin", "hr"])
    ),
):

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    update_data = (
        employee_data
        .model_dump(
            exclude_unset=True
        )
    )

    for field, value in update_data.items():
        setattr(
            employee,
            field,
            value,
        )

    db.commit()
    db.refresh(employee)

    return employee


@router.delete(
    "/{employee_id}",
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(["admin"])
    ),
):

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully",
        "employee_id": employee_id,
    }