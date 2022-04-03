import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('mainpay_bill_key')
export class MainPayBillKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 6,
    type: 'varchar',
    comment: 'MainPay 가맹점 번호',
  })
  mbrNo: string;

  @Column({
    length: 20,
    type: 'char',
    comment: 'MainPay와 연결된 주문번호',
  })
  mbrRefNo: string;

  @Column({
    length: 12,
    type: 'char',
    comment: 'MainPay에서 생성한 거래번호',
  })
  refNo: string;

  @Column({
    length: 20,
    type: 'char',
    comment: '카드 고유 일련번호',
  })
  billKey: string;

  @Column({
    length: 100,
    nullable: true,
    type: 'varchar',
  })
  cardName: string;

  @Column({
    length: 20,
    type: 'char',
    nullable: true,
  })
  cardNo: string;

  @Column({
    nullable: true,
    type: 'char',
    length: 30,
    comment: '고객명',
  })
  customerName: string;

  @Column({
    type: 'char',
    nullable: true,
    length: 30,
    comment: '고객 전화번호',
  })
  customerTelNo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt: Date;

  @ManyToOne((type) => UserEntity, (user) => user.billKeys)
  user: UserEntity;

  @Column()
  userId: number;
}
