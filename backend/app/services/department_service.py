from sqlalchemy.orm import Session

from app.db.models import Department


def create_department(
    db: Session,
    department_data: dict,
):
    department = Department(
        **department_data
    )

    db.add(department)
    db.commit()
    db.refresh(department)

    return department


def get_department_by_id(
    db: Session,
    department_id: int,
):
    return (
        db.query(Department)
        .filter(
            Department.id
            == department_id
        )
        .first()
    )


def get_department_by_name(
    db: Session,
    name: str,
):
    return (
        db.query(Department)
        .filter(
            Department.name == name
        )
        .first()
    )


def get_departments(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):
    return (
        db.query(Department)
        .filter(
            Department.is_active == True
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_department(
    db: Session,
    department: Department,
    update_data: dict,
):
    for field, value in update_data.items():
        setattr(
            department,
            field,
            value,
        )

    db.commit()
    db.refresh(department)

    return department


def deactivate_department(
    db: Session,
    department: Department,
):
    department.is_active = False

    db.commit()
    db.refresh(department)

    return department