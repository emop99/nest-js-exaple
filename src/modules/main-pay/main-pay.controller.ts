import {Controller, Post, Body, UseGuards, Request} from '@nestjs/common';
import {MainPayService} from './main-pay.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {RegularCardRegisterApiDto} from "./dto/regular-card-register-api.dto";
import {IBillKeyRegisterResponse, IBillKeyResponse, IHandwritingPaymentResponse, IRegularPaymentResponse} from "./interface/regular.interface";
import {MainPayApi} from "../../common/api/main-pay.api";
import {MainPayBillKeyEntity} from "../../entity/main-pay-bill-key.entity";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {DefaultLogger} from "../../config/logger/default.logger";
import {RegularPaymentApiDto} from "./dto/regular-payment-api.dto";
import {IBillKeyPaymentResponse, IHandwritingPaymentResult} from "../../common/api/interface/main-pay-api.interface";
import {MainPayPaymentServiceName, MainPayResponsePayMethod} from "../../entity/main-pay-response.entity";
import {HandWritingPaymentApiDto} from "./dto/hand-writing-payment-api.dto";
import {HandWritingPaymentResponseDto} from "./dto/hand-writing-payment-response.dto";

@Controller('main-pay')
@ApiTags('MainPay 연동')
export class MainPayController {
    private logger = new DefaultLogger('mainPay', '/mainPay');

    constructor(private readonly mainPayService: MainPayService) {
    }

    @Post('regular/payment')
    @ApiOperation({
        description: '메인페이 정기결제 결제 시도',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async regularPayment(
        @Request() request,
        @Body() requestBody: RegularPaymentApiDto,
    ): Promise<IRegularPaymentResponse> {
        let result: IRegularPaymentResponse = {
            result: false,
            resultMessage: '',
        };

        const billKeyInfo: MainPayBillKeyEntity = await this.mainPayService.findBillKeyData(request.user.id);

        if (!billKeyInfo) {
            result.resultMessage = '등록된 결제 카드가 없습니다.';
            return result;
        }

        const mainPayApi = new MainPayApi();

        const response = await mainPayApi.billKeyPayment({
            amount: String(requestBody.amount),
            apiKey: process.env.MAINPAY_API_KEY,
            billKey: billKeyInfo.billKey,
            customerName: request.user.name,
            goodsName: requestBody.goodsName,
            mbrNo: process.env.MAINPAY_MBRNO,
        });

        this.logger.log(`regularRegister::ResponseData::${JSON.stringify({
            userId: request.user.id,
            data: response.data,
        })}`);

        const responseData = response.data as IBillKeyPaymentResponse;

        const mainPayResponseInfo = {
            amount: requestBody.amount,
            applyNo: responseData.data.applNo ? responseData.data.applNo : '',
            billKey: billKeyInfo.billKey,
            failMsg: "",
            isFail: false,
            mbrNo: process.env.MAINPAY_MBRNO,
            mbrRefNo: mainPayApi.mainPayBaseInfo.mbrRefNo,
            payAuto: false,
            payMethod: MainPayResponsePayMethod.CARD,
            payType: "",
            paymentService: MainPayPaymentServiceName.PAYMENT_TEST,
            refNo: responseData.data.refNo ? responseData.data.refNo : '',
            signature: mainPayApi.mainPayBaseInfo.signature,
            taxAmt: responseData.data.taxAmount ? responseData.data.taxAmount : 0,
            timestamp: mainPayApi.mainPayBaseInfo.timestamps,
            userId: request.user.id,
        };

        if (response.data.resultCode === '200') {
            await this.mainPayService.regularPaymentResponseInsert(mainPayResponseInfo);
            result.resultMessage = response.data.resultMessage;
            result.result = true;
        } else {
            await this.mainPayService.regularPaymentResponseInsert({
                ...mainPayResponseInfo,
                failMsg: responseData.resultMessage,
                isFail: true,
            });
            result.resultMessage = response.data.resultMessage;
        }

        return result;
    }

    @Post('regular/register')
    @ApiOperation({
        description: '메인페이 정기결제 카드 등록',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async regularRegister(
        @Request() request,
        @Body() requestBody: RegularCardRegisterApiDto,
    ): Promise<IBillKeyResponse> {
        let response: IBillKeyRegisterResponse;
        let result: IBillKeyResponse = {
            result: false,
            resultMessage: '카드 정보를 잘못 입력하였습니다.',
        };
        const mainPayApi = new MainPayApi();

        const billKeyInfo: MainPayBillKeyEntity = await this.mainPayService.findBillKeyData(request.user.id);

        if (billKeyInfo) {
            try {
                await mainPayApi.billKeyUnused({
                    apiKey: process.env.MAINPAY_API_KEY,
                    billKey: billKeyInfo.billKey,
                    mbrNo: billKeyInfo.mbrNo,
                });
                await this.mainPayService.billKeyDelete(billKeyInfo.id);
            } catch (e) {
                this.logger.error('regularRegister::Error', e);
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
                userId: request.user.id,
                userName: request.user.name,
                userPhone: request.user.phone,
            });
        } catch (e) {
            this.logger.error('regularRegister::Error', e);
            throw new Error(e);
        }

        this.logger.log(`regularRegister::ResponseData::${JSON.stringify({
            userId: request.user.id,
            data: response.data,
        })}`);

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
                userId: request.user.id,
            });
            result.resultMessage = response.resultMessage;
            result.result = true;
        }

        return result;
    }

    @ApiOperation({
        description: '신용 카드 수기 결제'
    })
    @Post('handwritingPayment')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async handwritingPayment(
        @Request() request,
        @Body() requestBody: HandWritingPaymentApiDto,
    ): Promise<IHandwritingPaymentResponse> {
        let result: IHandwritingPaymentResponse = {
            result: false,
            resultMessage: '',
        };

        const mainPayApi = new MainPayApi();

        const response = await mainPayApi.handwritingPayment({
            amount: requestBody.amount,
            apiKey: process.env.MAINPAY_API_KEY,
            cardNo: requestBody.cardNo,
            customerEmail: request.user.email,
            customerName: request.user.name,
            customerTelNo: request.user.phone,
            expd: requestBody.expd,
            goodsName: requestBody.goodsName,
            installment: requestBody.installment,
            keyInAuthType: "K",
            mbrNo: process.env.MAINPAY_MBRNO,
        });

        this.logger.log(`handwritingPayment::ResponseData::${JSON.stringify({
            userId: request.user.id,
            data: response.data,
        })}`);

        const responseData = response.data as IHandwritingPaymentResult;

        let handWritingPaymentResponseDto = {
            amount: Number(requestBody.amount),
            applyNo: responseData.data.applyNo ? responseData.data.applyNo: '',
            failMsg: "",
            isFail: false,
            mbrNo: process.env.MAINPAY_MBRNO,
            mbrRefNo: mainPayApi.mainPayBaseInfo.mbrRefNo,
            payMethod: MainPayResponsePayMethod.CARD,
            payType: responseData.data.payType ? responseData.data.payType : '',
            paymentService: MainPayPaymentServiceName.PAYMENT_TEST,
            refNo: responseData.data.refNo ? responseData.data.refNo : '',
            signature: mainPayApi.mainPayBaseInfo.signature,
            taxAmt: 0,
            timestamp: mainPayApi.mainPayBaseInfo.timestamps,
            userId: request.user.id,
        } as HandWritingPaymentResponseDto;

        if (responseData.resultCode === '200') {
            await this.mainPayService.handwritingPaymentResponseInsert(handWritingPaymentResponseDto);
            result.resultMessage = responseData.resultMessage;
            result.result = true;
        } else {
            await this.mainPayService.handwritingPaymentResponseInsert({
                ...handWritingPaymentResponseDto,
                isFail: true,
                failMsg: responseData.resultMessage,
            });
            result.resultMessage = responseData.resultMessage;
        }

        return result;
    }
}
