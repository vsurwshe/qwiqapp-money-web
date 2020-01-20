export const USER_KEY = 'user';
export const DUMMY_KEY = 'dummy';
export const USERDATA = 'userData';
export const CURRENCIES = 'currencies';
export const COUNTRIES = 'countries';
export const BILLING_ADDRESS = 'billingAddress';
export const PAYPAL_SETTINGS = 'paypalSettings';
export const PROFILES = 'profiles';
export const PROFILE = 'profile';
export const PROFILE_TYPES = 'profileTypes';
export const SELECTED_PROFILE = 'selectedProfile';
export const LABELS = 'labels';
export const CATEGORIES = 'categories';
export const CONTACTS = 'contacts';
export const BILLS = 'bills';
export const PROFILEID_BILLID = 'profielIdAndBillId';

//===== default profile currency
export const DEFAULT_CURRENCY = 'GBP';

// dummy token creating for email
export const DUMMY_EMAIL= "dummy@email.com";
export const grantType= {
   PASSWORD: "password",
   REFRESH_TOKEN: "refresh_token"
};
//===== user actions
export const userAction = {
   VERIFY_EMAIL: 'VERIFY_EMAIL',
   ADD_BILLING: 'ADD_BILLING',
   ADD_CREDITS: 'ADD_CREDITS',
   ADD_CREDITS_LOW: 'ADD_CREDITS_LOW'
}

//========== Profile Feature===========
export const profileFeature = {
   RECURRING: "Recurring",
   MULTICURRENCY: "MultiCurrency",
   ATTACHMENTS: 'Attachments',
   MULTIUSER: 'MultiUser'
} 

// Specifies the type of bill used when Add/update a Bill
export const billType = {
   PAYABLE: 'EXPENSE_PAYABLE',
   RECEIVABLE: 'INCOME_RECEIVABLE',
   paymentType: {
      PAID:"Paid",
      RECEIVED:"Received"
   }
}

// Specifies the default repeatType of recurring bill used when adding or updating
export const billRepeatType={
   DAY:"DAY"
}

// Specifies the repeatType of recurring bill used when adding or updating
export const recurBillType={
  DAY:"DAY",
  WEEK:"Week",
  MONTH:"MONTH",
  DAYOFMONTH:"DAYOFMONTH",
  YEAR:"YEAR"
}

// This more options is used in Bills for displaying in MoreOption Button 
export const moreOptions = {
   ADDPAYMENT: 'Add a payment',
   PAYHISTORY: 'Payments History',
   MARKPAID: 'Mark as Paid',
   UNMARKPAID: 'Mark as Un-Paid',
   ATTACHMENTS: 'Attachments',
   DELETE: 'Delete'
 }