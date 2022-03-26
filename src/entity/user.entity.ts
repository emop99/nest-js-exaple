import {Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MainPayBillKeyEntity} from "./main-pay-bill-key.entity";
import {MainPayResponseEntity} from "./main-pay-response.entity";
import {BoardEntity} from "./board.entity";

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
        length: 50,
        type: 'varchar',
    })
    loginId: string;

    @Column({
        length: 250,
        type: 'varchar',
    })
    password: string;

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

    @OneToMany(() => MainPayBillKeyEntity, mainPayBillKeyEntity => mainPayBillKeyEntity.user)
    billKeys: MainPayBillKeyEntity[];

    @OneToMany(() => MainPayResponseEntity, mainPayResponseEntity => mainPayResponseEntity.user)
    mainPayResponse: MainPayResponseEntity[];

    @OneToMany(() => BoardEntity, boardEntity => boardEntity.user)
    board: BoardEntity[];
}
