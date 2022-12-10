import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(dataSource: DataSource) {
    super(Employee, dataSource.manager);
  }
}
