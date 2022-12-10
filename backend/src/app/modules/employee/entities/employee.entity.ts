import { EmployeeRole } from '../../../../configs/enum/employee-role';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({ name: 'password', type: 'varchar', nullable: false, length: 255 })
  password: string;

  @Column({
    name: 'employee_role',
    type: 'enum',
    enum: EmployeeRole,
    nullable: false,
  })
  employeeRole: EmployeeRole;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 1000,
    nullable: true,
  })
  refreshToken: string;

  @Column({ name: 'expied_at', type: 'varchar', length: 20, nullable: true })
  expiedAt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
// $2b$10$KvaF0Bljivr4B6/ejHSjh.P6X6LsgryZfRyEPcY6jzf/fJxHlKbiy
// $2b$10$Ysa0vY1LYUnuXsKF/v5qJOIXwcE/cwyyjYDfN.xb3DwQGm5udGtL6
