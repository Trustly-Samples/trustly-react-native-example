/**
 * @format
 * @flow strict
 */

type Address = {
  address1: string,
  address2?: string,
  city: string,
  country: string,
  state: string,
  zip: string,
};

type Account = {
  accountNumber: string,
  routingNumber: string,
  type: number,
};

type Customer = {
  address: Address,
  balance?: string,
  currency?: string,
  dateOfBirth?: string,
  driverLicense?: {
    number: string,
    state: string,
  },
  email?: string,
  enrollDate: number, // Unix Timestamp
  externalId: string,
  name: string,
  phone?: string,
  taxId?: string,
  vip?: string,
};

type Metadata = {
  clc?: {
    datetimeQR: string,
    gamingAssetNumber: string,
    playerCardNumber?: string,
    propertyId: string,
  },
  finishButtonLabelType?: string,
  integrationContext?: string,
  lang?: string,
  urlScheme?: string,
};

type Recurrence = {
  automaticCapture: boolean,
  endDate?: number, // Unix Timestamp
  frequency?: number,
  frequencyUnit: number,
  frequencyUnitType: number,
  recurringAmount: string,
  startDate?: number, // Unix Timestamp
};

type Verification = {
  verifyCustomer: boolean,
};

export type Establish = {
  accessId: string,
  account?: Account,
  address?: Address,
  allowedPaymentProviderTypes?: string[],
  amount?: number,
  authToken?: string,
  cancelUrl: string,
  currency: string,
  customer: Customer,
  description?: string,
  displayAmount?: string,
  env?: string,
  envHost?: string,
  merchantId: string,
  merchantReference: string,
  metadata?: Metadata,
  notificationUrl?: string,
  returnUrl: string,
  paymentType?: string,
  recurrence?: Recurrence,
  requestSignature: string,
  transactionId?: string,
  verification?: Verification,
};
