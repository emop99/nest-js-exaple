/**
 * 메인 페이 기본 정보 Interface
 */
export interface IMakeMainPayBaseInfo {
  mbrNo: string;
  apiKey: string;
  amount: string;
}

/**
 * 서명 값 생성 Params Interface
 */
export interface IMakeSignature {
  mbrNo: string;
  mbrRefNo: string;
  apiKey: string;
  timestamps: string;
  amount: string;
}

/**
 * 빌키 생성 Params Interface
 */
export interface IBillKeyRegisterParams {
  mbrNo: string;
  apiKey: string;
  cardNo: string;
  expd: string;
  birthDay: string;
  userId: number;
  userName: string;
  userPhone: string;
}

/**
 * 빌키 생성 Response Interface
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
  };
}

/**
 * 구독 주문 결제 처리 Params
 */
export interface IBillKeyPaymentParams {
  mbrNo: string;
  apiKey: string;
  goodsName: string;
  amount: string;
  billKey: string;
  customerName: string;
}

/**
 * 구독 주문 결제 처리 Response
 */
export interface IBillKeyPaymentResponse {
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
    goodsName: string;
    amount: number;
    taxAmount: number;
    feeAmount: number;
    applNo: string;
    signature: string;
    timestamp: string;
  };
}

/**
 * 구독 주문 결제 취소 처리 Params
 */
export interface IBillKeyPaymentCancelParams {
  mbrNo: string;
  orgRefNo: string;
  orgTranDate: string;
  amount: string;
  apiKey: string;
}

/**
 * 구독 주문 결제 취소 처리 Response
 */
export interface IBillKeyPaymentCancelResponse {
  resultCode: string;
  resultMessage: string;
  data: {
    mbrNo: string;
    mbrRefNo: string;
    refNo: string;
    tranDate: string;
    orgRefNo: string;
    amount: string;
  };
}

/**
 * 빌키 해지 처리 Params
 */
export interface IBillKeyUnusedParams {
  apiKey: string;
  mbrNo: string;
  billKey: string;
}

/**
 * 빌키 해지 처리 Response
 */
export interface IBillKeyUnusedResponse {
  resultCode: string;
  resultMessage: string;
  data: {
    mbrNo: string;
    mbrRefNo: string;
    tranDate: string;
  };
}

/**
 * 결제창 호출 전 처리 Params
 */
export interface IPaymentReadyParams {
  apiKey: string;
  mbrNo: string;
  payMethod: string;
  amount: string;
  goodsName: string;
  approvalUrl: string;
  closeUrl: string;
  customerName: string;
  customerEmail: string;
}

/**
 * 결제창 호출 전 처리 Main Pay Response
 */
export interface IPaymentReadyMainPayResponse {
  resultCode: string;
  resultMessage: string;
  data: {
    aid: string;
    nextMobileUrl: string;
    nextPcUrl: string;
    nextAppUrl: string;
    createTime: string;
    expireTime: string;
  };
}

/**
 * 결제창 호출 전 처리 Response
 */
export interface IPaymentReadyResponse {
  requestResponse: {
    resultCode: string;
    resultMessage: string;
    data: {
      aid: string;
      nextMobileUrl: string;
      nextPcUrl: string;
      nextAppUrl: string;
      createTime: string;
      expireTime: string;
    };
  };
  requestParameter: {
    version: string;
    mbrNo: string;
    mbrRefNo: string;
    paymethod: string;
    amount: string;
    goodsName: string;
    approvalUrl: string;
    closeUrl: string;
    customerName: string;
    customerEmail: string;
    timestamp: string;
    signature: string;
  };
}

/**
 * 결제창 호출 전 처리 토큰 생성 Params
 */
export interface IPaymentReadyTokenCreateParams {
  readyParameters: {
    version: string;
    mbrNo: string;
    mbrRefNo: string;
    paymethod: string;
    amount: string;
    goodsName: string;
    approvalUrl: string;
    closeUrl: string;
    customerName: string;
    customerEmail: string;
    timestamp: string;
    signature: string;
  };
  apiKey: string;
  aid: string;
  amount: string;
  studentId?: number;
}

/**
 * 결제창 호출 후 결제 처리 Params
 */
export interface IPaymentParams {
  mbrNo: string;
  apiKey: string;
  amount: string;
  aid: string;
  mbrRefNo: string;
  authToken: string;
  payMethod: string;
  signature: string;
  timestamp: string;
}

/**
 * 결제창 호출 후 결제 처리 Response
 */
export interface IPaymentResponse {
  resultCode: string;
  resultMessage: string;
  data: {
    mbrNo: string;
    refNo: string;
    tranDate: string;
    tranTime: string;
    mbrRefNo: string;
    goodsName: string;
    amount: string;
    taxAmount: string;
    feeAmount: string;
    Installment: string;
    customerName: string;
    customerTelNo: string;
    applyNo: string;
    cardNo: string;
    issueCompanyNo: string;
    acqCompanyNo: string;
    payType: string;
  };
}

/**
 * 수기 결제 처리 Params
 */
export interface IHandwritingPaymentParams {
  apiKey: string;
  mbrNo: string; //*	섹타나인에서 부여한 가맹점 번호 (상점 아이디)	6
  cardNo: string; //*	카드번호	16
  expd: string; //*	카드유효기간 (YYMM) (주의) 년/월 순서에 유의	4
  amount: string; //*	결제금액 (공급가+부가세)	10
  installment: string; //*	할부개월 (0 ~ 24)	2
  goodsName: string; //*	상품명 (특수문자 사용금지)	30
  keyInAuthType: 'K'; //*	키인인가구분 (K: 비인증 | O: 구인증) ※ 경우 따라 카드사 특약 필요 비인증, 구인증 심사 여부를 영업사원에게 문의	1
  customerName?: string; //	구매자명	30
  customerTelNo?: string; //	구매자연락처	12
  customerEmail?: string; //	구매자이메일	50
}

/**
 * 수기 결제 처리 Result
 */
export interface IHandwritingPaymentResult {
  resultCode: string; // 응답코드 '200' 이면 성공, 이외는 거절	4
  resultMessage: string; // 응답메시지	200
  data: {
    mbrNo: string; // 가맹점번호	6
    mbrRefNo: string; // 가맹점주문번호	20
    refNo: string; // 거래번호 (거래 취소시 필요)	12
    tranDate: string; // 거래일자 (거래 취소시 필요)	6
    payType: string; // 결제타입 (거래 취소시 필요)	2
    tranTime: string; // 거래시각	6
    amount: string; // 결제금액	10
    applyNo: string; // 승인번호	10
    issueCompanyNo: string; // 카드 발급사 코드(공통코드 참조)	2
    issueCompanyName: string; // 카드발급사명	100
    issueCardName: string; // 발급카드명	100
    acqCompanyNo: string; // 카드 매입사 코드 (공통코드 참조)	2
    acqCompanyName: string; // 카드매입사명	100
  };
}

/**
 * 결제 취소 처리
 */
export interface IPaymentCancelParams {
  mbrNo: string; // 섹타나인에서 부여한 가맹점 번호 (상점 아이디)	6
  orgRefNo: string; // 원거래번호 (승인응답 시 보관한 거래번호)	12
  orgTranDate: string; // 원거래 승인일자 (승인응답 시 보관한 승인일자)	6
  payType: string; // 원거래 결제타입 (승인응답 시 보관한 결제타입)
  paymethod: string; // 지불수단 (CARD:신용카드 | HPP: 휴대폰소액 | ACCT: 계좌이체)	5
  apiKey: string;
  amount: string;
}

/**
 * 결제 취소 처리 Response
 */
export interface IPaymentCancelResponse {
  resultCode: string; // 응답코드 '200' 이면 성공, 이외는 거절	4
  resultMessage: string; // 응답메시지	200
  data: {
    mbrNo: string; // 가맹점번호	6
    mbrRefNo: string; // 가맹점주문번호	20
    refNo: string; // 거래번호	12
    tranDate: string; // 거래일자	6
    tranTime: string; // 거래시각
  };
}
