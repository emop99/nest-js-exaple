import {Controller, Post, Body} from '@nestjs/common';
import {MainPayService} from './main-pay.service';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {RegularCardRegisterApiDto} from "./dto/regular-card-register-api.dto";
import {IBillKeyRegisterResponse, IBillKeyResponse} from "./interface/regular.interface";
import {MainPayApi} from "../../common/api/main-pay.api";
import {format} from "date-fns";
import {MainPayBillKeyEntity} from "../../entity/main-pay-bill-key.entity";

@Controller('main-pay')
@ApiTags('MainPay 연동')
export class MainPayController {
    constructor(private readonly mainPayService: MainPayService) {
    }

    @Post('regular/payment')
    @ApiOperation({
        description: '메인페이 정기결제 결제 시도',
    })
    regularPayment() {

    }

    @Post('regular/register')
    @ApiOperation({
        description: '메인페이 정기결제 카드 등록',
    })
    async regularRegister(
        @Body() requestBody: RegularCardRegisterApiDto
    ): Promise<IBillKeyResponse> {
        let response: IBillKeyRegisterResponse;
        let result: IBillKeyResponse = {
            result: false,
            resultMessage: '카드 정보를 잘못 입력하였습니다.',
        };
        const mainPayApi = new MainPayApi();

        const billKeyInfo: MainPayBillKeyEntity = await this.mainPayService.findBillKeyData(requestBody.userId);

        if (billKeyInfo) {
            try {
                await mainPayApi.billKeyUnused({
                    apiKey: process.env.MAINPAY_API_KEY,
                    billKey: billKeyInfo.billKey,
                    mbrNo: billKeyInfo.mbrNo,
                });
                await this.mainPayService.billKeyDelete(billKeyInfo.id);
            } catch (e) {
                throw new Error(e);
            }
        }

        try {
            response = await mainPayApi.billKeyRegister({
                mbrNo: process.env.MAINPAY_MBRNO,
                apiKey: process.env.MAINPAY_API_KEY,
                cardNo: requestBody.cardNo,
                expd: requestBody.expd,
                birthDay: requestBody.birthDay,
                userId: requestBody.userId,
                userName: requestBody.userName,
                userPhone: requestBody.userPhone,
            });
        } catch (e) {
            throw new Error(e);
        }

        const loggerData = {
            method: 'MainPayController::regularRegister',
            userId: requestBody.userId,
            data: response.data,
            createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };

        // logger.info(JSON.stringify(loggerData));

        if (response.resultCode === '200') {
            await this.mainPayService.billKeyRegister({
                billKey: response.data.billkey,
                cardName: response.data.cardName,
                cardNo: response.data.cardNo,
                customerName: response.data.custommerName,
                customerTelNo: response.data.custommerTelNo,
                mbrNo: response.data.mbrNo,
                mbrRefNo: response.data.mbrRefNo,
                refNo: response.data.refNo,
                userId: requestBody.userId,
            });
            result.resultMessage = response.resultMessage;
            result.result = true;
        }

        return result;
    }
}
