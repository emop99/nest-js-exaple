import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MainPayBillKeyEntity} from "./main-pay-bill-key.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        type: 'varchar',
        comment: '회원명'
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 25,
        comment: '핸드폰 번호',
    })
    phone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(type => MainPayBillKeyEntity, mainPayBillKeyEntity => mainPayBillKeyEntity.user)
    billKeys: MainPayBillKeyEntity[];
}
