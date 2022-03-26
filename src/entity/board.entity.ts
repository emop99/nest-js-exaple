import {Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('board')
export class BoardEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        type: 'varchar',
        comment: '작성자 명',
        nullable: false,
    })
    writerName: string;

    @Column({
        length: 100,
        type: 'varchar',
        comment: '작성자 ID',
        nullable: false,
    })
    writerId: string;

    @Column({
        length: 100,
        type: 'varchar',
        comment: '글 제목',
        nullable: false,
    })
    subject: string;

    @Column({
        type: 'text',
        comment: '글 내용',
        nullable: false,
    })
    contents: string;

    @Column({
        type: 'int',
        comment: '조회수',
        default: 0,
    })
    viewCnt: number;

    @ManyToOne(type => UserEntity, user => user.board)
    user: UserEntity;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
