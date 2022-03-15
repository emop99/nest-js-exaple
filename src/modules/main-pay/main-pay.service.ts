import {Inject, Injectable} from '@nestjs/common';
import {IsNull, Repository} from "typeorm";
import {MainPayResponseEntity} from "../../entity/main-pay-response.entity";
import {MainPayBillKeyEntity} from "../../entity/main-pay-bill-key.entity";
import {RegularCardRegisterDto} from "./dto/regular-card-register.dto";
import {RegularCardPaymentResponseDto} from "./dto/regular-card-payment-response.dto";
import {HandWritingPaymentResponseDto} from "./dto/hand-writing-payment-response.dto";
import {PaymentCancelInfoUpdateDto} from "./dto/payment-cancel-info-update.dto";

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
    };

    public async regularPaymentCancelBillKeyDelete(userId: number, billkey: string): Promise<void> {
        await this.mainPayBillKeyRepository.update({billKey: billkey, userId: userId}, {deletedAt: new Date()});
    };

    public async regularPaymentResponseInsert(mainPayResponseInfo: RegularCardPaymentResponseDto): Promise<void> {
        mainPayResponseInfo.failMsg = mainPayResponseInfo.failMsg.replace(/"/gi, "");
        await this.mainPayResponseRepository.save(mainPayResponseInfo);
    };

    public async handwritingPaymentResponseInsert(mainPayResponseInfo: HandWritingPaymentResponseDto): Promise<void> {
        mainPayResponseInfo.failMsg = mainPayResponseInfo.failMsg.replace(/"/gi, "");
        await this.mainPayResponseRepository.save(mainPayResponseInfo);
    };

    public async findPaymentResponse(mbrRefNo: string): Promise<MainPayResponseEntity> {
        return await this.mainPayResponseRepository.findOne({where: {mbrRefNo: mbrRefNo}});
    };

    public async paymentCancelInfoUpdate(cancelInfo: PaymentCancelInfoUpdateDto): Promise<void> {
        await this.mainPayResponseRepository.update({mbrRefNo: cancelInfo.mbrRefNo}, {
            isCancel: cancelInfo.isCancel,
            cancelMsg: cancelInfo.cancelMsg,
            cancelDate: new Date(),
        })
    };
}
