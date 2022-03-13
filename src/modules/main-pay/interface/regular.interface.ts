/**
 * 정기결제 카드 등록/해제 Response
 */
export interface IBillKeyResponse {
    result: boolean;
    resultMessage: string;
}

/**
 * 정기결제 카드 등록 MainPay Response
 */
export interface IBillKeyRegisterResponse {
    resultCode: string;
    resultMessage: string;
    developerMessage: string;
    detailResultCode: string;
    charset: string;
    data: {
        mbrNo: string;
        mbrRefNo: string;
        refNo: string;
        tranDate: string;
        billkey: string;
        cardCompanyNo: string;
        cardName: string;
        cardNo: string;
        custommerName: string;
        custommerTelNo: string;
    }
}

/**
 * 정기결제 카드 결제 Response
 */
export interface IRegularPaymentResponse {
    result: boolean;
    resultMessage: string;
}
