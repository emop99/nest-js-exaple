import {Inject, Injectable} from '@nestjs/common';
import {IsNull, Repository} from "typeorm";
import {MainPayResponseEntity} from "../../entity/main-pay-response.entity";
import {MainPayBillKeyEntity} from "../../entity/main-pay-bill-key.entity";
import {RegularCardRegisterDto} from "./dto/regular-card-register.dto";

@Injectable()
export class MainPayService {
    constructor(
        @Inject('MAIN_PAY_RESPONSE_REPOSITORY')
        private mainPayResponseRepository: Repository<MainPayResponseEntity>,
        @Inject('MAIN_PAY_BILL_KEY_REPOSITORY')
        private mainPayBillKeyRepository: Repository<MainPayBillKeyEntity>,
    ) {
    }

    public async billKeyRegister(mainPayBillKeyInfo: RegularCardRegisterDto): Promise<void> {
        await this.mainPayBillKeyRepository.save(mainPayBillKeyInfo);
    };

    public async findBillKeyData(userId: number): Promise<MainPayBillKeyEntity> {
        return await this.mainPayBillKeyRepository.findOne({
            where: {
                userId: userId,
                deletedAt: IsNull(),
            },
        });
    };

    public async billKeyDelete(id: number): Promise<void> {
        await this.mainPayBillKeyRepository.update({id: id}, {deletedAt: new Date()});
    }
}
