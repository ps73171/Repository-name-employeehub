from sqlalchemy.orm import Session

from app.db.models import Employee


def create_employee(
    db: Session,
    employee_data: dict,
):
    employee = Employee(
        **employee_data
    )

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee


def get_employee_by_id(
    db: Session,
    employee_id: int,
):
    return (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )


def get_employee_by_code(
    db: Session,
    employee_code: str,
):
    return (
        db.query(Employee)
        .filter(
            Employee.employee_code
            == employee_code
        )
        .first()
    )


def get_employee_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(Employee)
        .filter(
            Employee.email == email
        )
        .first()
    )


def get_employees(
    db: Session,
    skip: int = 0,
    limit: int = 10,
):
    return (
        db.query(Employee)
        .offset(skip)
        .limit(limit)
        .all()
    )


def update_employee(
    db: Session,
    employee: Employee,
    update_data: dict,
):
    for field, value in update_data.items():
        setattr(
            employee,
            field,
            value,
        )

    db.commit()
    db.refresh(employee)

    return employee


def delete_employee(
    db: Session,
    employee: Employee,
):
    db.delete(employee)
    db.commit()

    return True