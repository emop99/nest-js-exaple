import {
  IBillKeyPaymentCancelParams,
  IBillKeyPaymentCancelResponse,
  IBillKeyPaymentParams,
  IBillKeyPaymentResponse,
  IBillKeyRegisterParams,
  IBillKeyRegisterResponse,
  IBillKeyUnusedParams,
  IBillKeyUnusedResponse,
  IHandwritingPaymentParams,
  IHandwritingPaymentResult,
  IMakeMainPayBaseInfo,
  IMakeSignature,
  IPaymentCancelParams,
  IPaymentCancelResponse,
  IPaymentParams,
  IPaymentReadyMainPayResponse,
  IPaymentReadyParams,
  IPaymentReadyResponse,
  IPaymentReadyTokenCreateParams,
  IPaymentResponse,
} from './interface/main-pay-api.interface';
import {format} from 'date-fns';
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken';
import axios, {AxiosPromise, AxiosResponse} from 'axios';

/**
 * Main Pay API 관련 Class
 */
export class MainPayApi {
  /**
   * 메인 페이 기본 정보
   * @private
   */
  public mainPayBaseInfo = {
    timestamps: '',
    mbrRefNo: '',
    signature: '',
  };

  /**
   * 결제취소 시 사용되는 결제일 정보 가져오기
   * @param paymentDate
   * @private
   */
  public static getOrgTranDate(paymentDate: Date) {
    return format(new Date(paymentDate), 'yyyyMMdd').substring(2, 8);
  }

  /**
   * 랜덤번호 생성
   * @param length text length
   */
  private static generateRandomNumber = (length: number) => {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += Math.floor(Math.random() * 10).toString();
    }
    return str;
  };

  /**
   * 타임스탬프 (YYYYMMDDHHMI24SS 형식의 문자열) 18자리
   * @private
   */
  private static makeTimestamps() {
    return `${format(
      new Date(),
      'yyyyMMddHHmmss',
    )}${MainPayApi.generateRandomNumber(4)}`;
  }

  /**
   * 중복되지 않는 주문번호 20자리
   * @private
   */
  private static makeMbrRefNo() {
    return uuidv4().replace(/-/gi, '').substr(0, 20);
  }

  /**
   * 결제 위변조 방지를 위한 파라미터 서명 값 64자리
   * @param data
   * @private
   */
  private static makeSignature(data: IMakeSignature) {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(
        `${data.mbrNo}|${data.mbrRefNo}|${data.amount}|${data.apiKey}|${data.timestamps}`,
      )
      .digest('hex');
  }

  /**
   * 빌키 생성 API
   * @param data IBillKeyRegisterParams
   * @return {} IBillKeyRegisterResponse
   */
  public async billKeyRegister(
    data: IBillKeyRegisterParams,
  ): Promise<IBillKeyRegisterResponse> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: '0',
    });

    const params = new URLSearchParams();
    params.append('mbrNo', String(data.mbrNo));
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('cardNo', data.cardNo);
    params.append('expd', data.expd);
    params.append('authType', '0');
    params.append('birthDay', data.birthDay);
    params.append('amount', '0');
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);
    params.append('customerId', String(data.userId));
    params.append('customerName', data.userName);
    params.append('customerTelNo', data.userPhone);

    const response = await axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/card-auto/auth`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );

    return response.data;
  }

  /**
   * 생성된 빌키로 결제 처리
   * @param data IBillKeyPaymentParams
   * @return {} IBillKeyPaymentResponse
   */
  public async billKeyPayment(
    data: IBillKeyPaymentParams,
  ): Promise<AxiosPromise<IBillKeyPaymentResponse>> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: data.amount,
    });

    const params = new URLSearchParams();
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('goodsName', data.goodsName);
    params.append('amount', data.amount);
    params.append('billkey', data.billKey);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);
    params.append('customerName', data.customerName);
    params.append('taxAmt', '0');
    params.append('feeAmt', '0');
    params.append('clientType', 'MERCHANT');

    return axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/card-auto/trans`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 빌키 결제 취소 처리
   * @param data IBillKeyPaymentCancelParams
   * @return {} IBillKeyPaymentCancelResponse
   */
  public async billKeyPaymentCancel(
    data: IBillKeyPaymentCancelParams,
  ): Promise<AxiosPromise<IBillKeyPaymentCancelResponse>> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: data.amount,
    });

    const params = new URLSearchParams();
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('orgRefNo', data.orgRefNo);
    params.append('orgTranDate', data.orgTranDate);
    params.append('amount', data.amount);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);
    params.append('clinetType', 'MERCHANT');

    return axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/card-auto/cancel`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 빌키 해제 처리
   * @param data IBillKeyUnusedParams
   * @return {} IBillKeyUnusedResponse
   */
  public async billKeyUnused(
    data: IBillKeyUnusedParams,
  ): Promise<AxiosPromise<IBillKeyUnusedResponse>> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: '0',
    });

    const params = new URLSearchParams();
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);
    params.append('billkey', data.billKey);
    params.append('clientType', 'online');

    return axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/card-auto/auth-cancel`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 결제창 호출 전 처리
   * @param data IPaymentReadyParams
   * @return {} IPaymentReadyResponse
   */
  public async paymentReady(
    data: IPaymentReadyParams,
  ): Promise<IPaymentReadyResponse> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: data.amount,
    });

    const params = new URLSearchParams();
    params.append('version', '1.0');
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('paymethod', data.payMethod);
    params.append('amount', data.amount);
    params.append('goodsName', data.goodsName);
    params.append('approvalUrl', data.approvalUrl);
    params.append('closeUrl', data.closeUrl);
    params.append('customerName', data.customerName);
    params.append('customerEmail', data.customerEmail);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);

    const response: AxiosResponse<IPaymentReadyMainPayResponse> =
      await axios.post(
        `${process.env.MAINPAY_STANDARD_PAYMENT_HOST}/v1/payment/ready`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        },
      );

    return {
      requestResponse: {
        resultCode: response.data.resultCode,
        resultMessage: response.data.resultMessage,
        data: {
          aid: response.data.data.aid,
          nextMobileUrl: response.data.data.nextMobileUrl,
          nextPcUrl: response.data.data.nextPcUrl,
          nextAppUrl: response.data.data.nextAppUrl,
          createTime: response.data.data.createTime,
          expireTime: response.data.data.expireTime,
        },
      },
      requestParameter: {
        version: '1.0',
        mbrNo: data.mbrNo,
        mbrRefNo: this.mainPayBaseInfo.mbrRefNo,
        paymethod: data.payMethod,
        amount: data.amount,
        goodsName: data.goodsName,
        approvalUrl: data.approvalUrl,
        closeUrl: data.closeUrl,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        timestamp: this.mainPayBaseInfo.timestamps,
        signature: this.mainPayBaseInfo.signature,
      },
    };
  }

  /**
   * 결제창 호출 후 결제 처리
   * @param data IPaymentParams
   * @return {}
   */
  public async payment(
    data: IPaymentParams,
  ): Promise<AxiosPromise<IPaymentResponse>> {
    const params = new URLSearchParams();
    params.append('version', '1.0');
    params.append('mbrNo', data.mbrNo);
    params.append('aid', data.aid);
    params.append('mbrRefNo', data.mbrRefNo);
    params.append('authToken', data.authToken);
    params.append('paymethod', data.payMethod);
    params.append('amount', data.amount);
    params.append('timestamp', data.timestamp);
    params.append('signature', data.signature);

    return axios.post(
      `${process.env.MAINPAY_STANDARD_PAYMENT_HOST}/v1/payment/pay`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 결제 승인요청 과정에서 오류가 발생해 응답을 못받은 경우 망취소(net-cancel) 처리
   * @param data IPaymentParams
   */
  public async paymentNetCancel(data: IPaymentParams) {
    const params = new URLSearchParams();
    params.append('version', '1.0');
    params.append('mbrNo', data.mbrNo);
    params.append('aid', data.aid);
    params.append('mbrRefNo', data.mbrRefNo);
    params.append('authToken', data.authToken);
    params.append('paymethod', data.payMethod);
    params.append('amount', data.amount);
    params.append('timestamp', data.timestamp);
    params.append('signature', data.signature);

    return axios.post(
      `${process.env.MAINPAY_STANDARD_PAYMENT_HOST}/v1/payment/net-cancel`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 결제창 호출 전 처리 토큰 생성
   * @param data IPaymentReadyTokenCreateParams
   * @return string jwt
   */
  public paymentReadyTokenCreate(data: IPaymentReadyTokenCreateParams) {
    return jwt.sign(data, process.env.SECRET!, { expiresIn: 60 * 60 * 24 * 7 });
  }

  /**
   * 결제창 호출 전 처리 토큰 확인
   * @param token string
   * @return {} IPaymentReadyTokenCreateParams
   */
  public paymentReadyTokenVerify(
    token: string,
  ): IPaymentReadyTokenCreateParams {
    return jwt.verify(
      token,
      process.env.SECRET!,
    ) as IPaymentReadyTokenCreateParams;
  }

  /**
   * 신용카드 수기 결제 처리
   */
  public async handwritingPayment(
    data: IHandwritingPaymentParams,
  ): Promise<AxiosPromise<IHandwritingPaymentResult>> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: data.amount,
    });

    const params = new URLSearchParams();
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);
    params.append('paymethod', 'CARD');
    params.append('cardNo', data.cardNo);
    params.append('expd', data.expd);
    params.append('amount', data.amount);
    params.append('installment', data.installment);
    params.append('goodsName', data.goodsName);
    params.append('keyinAuthType', data.keyInAuthType);

    if (data.customerEmail) {
      params.append('customerEmail', data.customerEmail);
    }
    if (data.customerName) {
      params.append('customerName', data.customerName);
    }
    if (data.customerTelNo) {
      params.append('customerTelNo', data.customerTelNo);
    }

    return axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/card-keyin/trans`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 결제 취소 처리
   * @param data IPaymentCancelParams
   * @return {} IPaymentCancelResponse
   */
  public async paymentCancel(
    data: IPaymentCancelParams,
  ): Promise<AxiosPromise<IPaymentCancelResponse>> {
    this.makeMainPayBaseInfo({
      mbrNo: data.mbrNo,
      apiKey: data.apiKey,
      amount: data.amount,
    });

    const params = new URLSearchParams();
    params.append('mbrNo', data.mbrNo);
    params.append('mbrRefNo', this.mainPayBaseInfo.mbrRefNo);
    params.append('orgRefNo', data.orgRefNo);
    params.append('orgTranDate', data.orgTranDate);
    params.append('payType', data.payType);
    params.append('paymethod', data.paymethod);
    params.append('timestamp', this.mainPayBaseInfo.timestamps);
    params.append('signature', this.mainPayBaseInfo.signature);

    return axios.post(
      `${process.env.MAINPAY_HOST}/v1/api/payments/payment/cancel`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
  }

  /**
   * 메인 페이 기본 정보 Make
   * @param data
   * @private
   */
  private makeMainPayBaseInfo(data: IMakeMainPayBaseInfo) {
    this.mainPayBaseInfo.timestamps = MainPayApi.makeTimestamps();
    this.mainPayBaseInfo.mbrRefNo = MainPayApi.makeMbrRefNo();
    this.mainPayBaseInfo.signature = MainPayApi.makeSignature({
      amount: data.amount,
      apiKey: data.apiKey,
      mbrNo: data.mbrNo,
      mbrRefNo: this.mainPayBaseInfo.mbrRefNo,
      timestamps: this.mainPayBaseInfo.timestamps,
    });
  }
}
