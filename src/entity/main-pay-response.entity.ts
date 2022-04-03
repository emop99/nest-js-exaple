import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum MainPayPaymentServiceName {
  PAYMENT_TEST = 'payment_test',
}

/**
 * 결제 수단
 */
export enum MainPayResponsePayMethod {
  CARD = 'CARD',
  VACCT = 'VACCT',
  ACCT = 'ACCT',
  HPP = 'HPP',
}

@Entity('mainpay_response')
export class MainPayResponseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: 'MainPay와 연결된 주문번호',
  })
  mbrRefNo: string;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: false,
    comment: 'MainPay 가맹점 번호',
  })
  mbrNo: string;

  @Column({
    type: 'enum',
    nullable: false,
    comment: '결제와 관련된 서비스',
    enum: MainPayPaymentServiceName,
  })
  paymentService: string;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
    comment: '결제 금액',
  })
  amount: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: true,
    comment: '부가세금액',
  })
  taxAmt: number;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: '서명값',
  })
  signature: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '카드 고유 일련번호',
  })
  billKey: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
    comment: '자동 결제 여부',
  })
  payAuto: boolean;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '결제 요청 실패 메시지',
  })
  failMsg: string;

  @Column({
    type: 'boolean',
    default: 0,
    comment: '결제 실패 여부',
  })
  isFail: boolean;

  @Column({
    type: 'varchar',
    length: 12,
    nullable: true,
    comment: 'MainPay에서 생성한 거래번호',
  })
  refNo: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  timestamp: string;

  @Column({
    type: 'enum',
    enum: MainPayResponsePayMethod,
  })
  payMethod: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'MainPay에서 생성한 카드사 승인번호',
  })
  applyNo: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '취소 여부',
  })
  isCancel: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '취소메시지',
  })
  cancelMsg: string;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '취소 완료일',
  })
  cancelDate: Date;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: true,
    comment: '카드인증구분 (취소 시에 필요한 값)',
  })
  payType: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @DeleteDateColumn()
  deletedAt: string;

  @ManyToOne(() => UserEntity, (user) => user.mainPayResponse)
  user: UserEntity;

  @Column()
  userId: number;
}
