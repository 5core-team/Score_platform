export const baseURL = "https://api.africarisque.com";

const SummaryApi = {

    //Auth
    login :  { // user login
        url : '/api/auth/login/',
        method : 'post'
    },
    change_password : { // user change password
        url : '/api/auth/change-password/',
        method : 'post'
    },
    password_setup : { // user password setup for the first time
        url : '/api/auth/password-setup/',
        method : 'post'
    },
    reset_code : { // user request reset code for password reset
        url : '/api/auth/reset-code/',
        method : 'post'
    },
    reset_password : { // user reset password
        url : '/api/auth/reset-password/',
        method : 'post'
    },
    verify_code : { // user verify reset code for password reset
        url : '/api/auth/verify-code/',
        method : 'post'
    },
    verify_credentials : { // verify credential for password setup
        url : '/api/auth/verify-credentials/',
        method : 'post'
    },

    //Profile
    update_profile : { // update user profile
        url : '/api/auth/profile/',
        method : 'put'
    },
    update_partial_profile : { // update user profile partially
        url : '/api/auth/profile/',
        method : 'patch'
    },

    //Customers
    get_customers : { // get all customers
        url : '/api/customers/customers/',
        method : 'get'
    },
    create_customer : { // create a new customer
        url : '/api/customers/customers/',
        method : 'post'
    },
    get_customer : { // get a customer by id
        url : '/api/customers/customers/{id}/',
        method : 'get'
    },
    update_customer : { // update a customer by id
        url : '/api/customers/customers/{id}/',
        method : 'put'
    },
    update_partial_customer : { // update a customer partially by id
        url : '/api/customers/customers/{id}/',
        method : 'patch'
    },
    delete_customer : { // delete a customer by id
        url : '/api/customers/customers/{id}/',
        method : 'delete'
    },

    search_customers : { // search customers by npi 
        url : '/api/customers/customers/search/',
        method : 'get'
    },
    request_consultation_otp_to_customer_by_uuid : { // request consultation otp to a customer by uuid
        url : '/api/customers/customers/request-otp/',
        method : 'post'
    },
    verify_otp_consultation_to_customer_by_uuid : { // verify consultation otp to a customer by uuid with the otp code
        url : '/api/customers/customers/verify-otp/',
        method : 'post'
    },

    //Customer dettes
    get_customer_debts : { // get all dettes of a customer by customer id | huissier + conseiller  toutes les dettes (read only pour le conseiller)
        url : '/api/customers/debts/',
        method : 'get'
    },
    create_customer_debt : { // create a new dette for a customer by customer id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/debts/',
        method : 'post'
    },
    get_customer_debt : { // get a dette of a customer by debt id | huissier + conseiller  read only pour le conseiller
        url : '/api/customers/debts/{id}/',
        method : 'get'
    },
    update_customer_debt : { // update a dette of a customer by debt id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/debts/{id}/',
        method : 'put'
    },
    update_partial_customer_debt : { // update a dette of a customer partially by debt id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/debts/{id}/',
        method : 'patch'
    },
    send_validation_request_for_customer_debt_by_id : { // send a validation request for a customer debt by debt id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/debts/{id}/send-validation/',
        method : 'post'
    },
    toggle_monitoring_customer_debt : { // activate or deactivate a customer debt by debt id | huissier seulement . uniquement pour les dettes valider.
        url : '/api/customers/debts/{id}/toggle-monitoring/',
        method : 'post'
    },
    reject_debt_by_unique_link : { // refuse a customer debt by unique link | no auth required. le lien doit être unique. no parameter just token
        url : 'api/customers/debts/reject/',
        method : 'get'
    },

    //customers remboursements
    get_customer_reimbursements : { // get all reimbursements of a customer by customer id | huissier + conseiller  toutes les remboursements (read only pour le conseiller)
        url : '/api/customers/repayments/',
        method : 'get'
    },
    create_customer_reimbursement : { // create a new reimbursement for a customer by customer id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/repayments/',
        method : 'post'
    },
    get_customer_reimbursement : { // get a reimbursement of a customer by reimbursement id | huissier + conseiller  read only pour le conseiller
        url : '/api/customers/repayments/{id}/',
        method : 'get'
    },
    update_customer_reimbursement : { // update a reimbursement of a customer by reimbursement id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/repayments/{id}/',
        method : 'put'
    },
    update_partial_customer_reimbursement : { // update a reimbursement of a customer partially by reimbursement id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/repayments/{id}/',
        method : 'patch'
    },
    send_validation_request_for_customer_reimbursement_by_id : { // send a validation request for a customer reimbursement by reimbursement id | huissier seulement Nécessite un session_token valide.
        url : '/api/customers/repayments/{id}/send-validation/',
        method : 'post'
    },
    reject_reimbursement_by_unique_link : { // refuse a customer reimbursement by unique link | no auth required. le lien doit être unique. no parameter just token
        url : 'api/customers/repayments/reject/',
        method : 'get'
    },
    validate_reimbursement_by_unique_link : { // validate a customer reimbursement by unique link | no auth required. le lien doit être unique. no parameter just token
        url : 'api/customers/repayments/validate/',
        method : 'get'
    },
  
    //Dashboard
    super_admin_dashboard : { // get dashboard data for super admin
        url : '/api/dashboard/admin/',
        method : 'get'
    },
    country_representative_dashboard : { // get dashboard data for représentant pays
        url : '/api/dashboard/country/',
        method : 'get'
    },
    front_office_dashboard : { // get dashboard data for front office
        url : '/api/dashboard/front-office/',
        method : 'get'
    },
    huissier_dashboard : { // get dashboard data for huissier
        url : '/api/dashboard/huissier/',
        method : 'get'
    },
    conseiller_dashboard : { // get dashboard data for conseiller financier
        url : '/api/dashboard/conseiller/',
        method : 'get'
    },
    
    //Geography Country
    get_countries : { // get all countries
        url : '/api/geography/countries/',
        method : 'get'
    },
    create_country : { // create a new country
        url : '/api/geography/countries/',
        method : 'post'
    },
    get_country_subscription : { // get subscription details of a country by country id
        url : '/api/geography/countries/{country_id}/subscription/',
        method : 'get'
    },
    create_country_subscription : { // create subscription for a country by country id
        url : '/api/geography/countries/{country_id}/subscription/create/',
        method : 'post'
    },
    renew_country_subscription : { // renew subscription for a country by country id
        url : '/api/geography/countries/{country_id}/subscription/renew/',
        method : 'put'
    },
    get_country : { // get a country by id
        url : '/api/geography/countries/{id}/',
        method : 'get'
    },
    update_country : { // update a country by id (complete)
        url : '/api/geography/countries/{id}/',
        method : 'put'
    },
    update_partial_country : { // update a country by id (partial)
        url : '/api/geography/countries/{id}/',
        method : 'patch'
    },
    delete_country : { // delete a country by id
        url : '/api/geography/countries/{id}/',
        method : 'delete'
    },

    //Geography subzone ex : quartier, secteur, arrondissement used by front office
    get_subzones : { // get all zones
        url : '/api/geography/subzones/',
        method : 'get'
    },
    create_subzone : { // create a new zone
        url : '/api/geography/subzones/',
        method : 'post'
    },
    get_subzone : { // get a zone by id
        url : '/api/geography/subzones/{id}/',
        method : 'get'
    },
    update_subzone : { // update a zone by id (complete)
        url : '/api/geography/subzones/{id}/',
        method : 'put'
    },
    update_partial_subzone : { // update a zone by id (partial)
        url : '/api/geography/subzones/{id}/',
        method : 'patch'
    },
    delete_subzone : { // delete a zone by id
        url : '/api/geography/subzones/{id}/',
        method : 'delete'
    },

    //Geography - Zone for country representative
    get_zones : { // get all zones
        url : '/api/geography/zones/',
        method : 'get'
    },
    create_zone : { // create a new zone
        url : '/api/geography/zones/',
        method : 'post'
    },
    get_zone : { // get a zone by id
        url : '/api/geography/zones/{id}/',
        method : 'get'
    },
    update_zone : { // update a zone by id (complete)
        url : '/api/geography/zones/{id}/',
        method : 'put'
    },
    update_partial_zone : { // update a zone by id (partial)
        url : '/api/geography/zones/{id}/',
        method : 'patch'
    },
    delete_zone : { // delete a zone by id
        url : '/api/geography/zones/{id}/',
        method : 'delete'
    },

    //Staff - Conseiller Financier | used by front office
    get_financial_advisors : { // get all financial advisors
        url : '/api/staff/financial-advisors/',
        method : 'get'
    },
    create_financial_advisor : { // create a new financial advisor
        url : '/api/staff/financial-advisors/',
        method : 'post'
    },
    get_financial_advisor : { // get a financial advisor by id
        url : '/api/staff/financial-advisors/{id}/',
        method : 'get'
    },
    update_financial_advisor : { // update a financial advisor by id (complete)
        url : '/api/staff/financial-advisors/{id}/',
        method : 'put'
    },
    update_partial_financial_advisor : { // update a financial advisor by id (partial)
        url : '/api/staff/financial-advisors/{id}/',
        method : 'patch'
    },
    delete_financial_advisor : { // delete a financial advisor by id
        url : '/api/staff/financial-advisors/{id}/',
        method : 'delete'
    },

    //Staff - Front Office used by country representative
    get_front_offices : { // get all front offices
        url : '/api/staff/front-offices/',
        method : 'get'
    },
    create_front_office : { // create a new front office
        url : '/api/staff/front-offices/',
        method : 'post'
    },
    get_front_office : { // get a front office by id
        url : '/api/staff/front-offices/{id}/',
        method : 'get'
    },
    update_front_office : { // update a front office by id (complete)
        url : '/api/staff/front-offices/{id}/',
        method : 'put'
    },
    update_partial_front_office : { // update a front office by id (partial)
        url : '/api/staff/front-offices/{id}/',
        method : 'patch'
    },
    delete_front_office : { // delete a front office by id
        url : '/api/staff/front-offices/{id}/',
        method : 'delete'
    },

    //Staff - Huissier | used by front office
    get_huissiers : { // get all huissiers
        url : '/api/staff/huissiers/',
        method : 'get'
    },
    create_huissier : { // create a new huissier
        url : '/api/staff/huissiers/',
        method : 'post'
    },
    get_huissier : { // get a huissier by id
        url : '/api/staff/huissiers/{id}/',
        method : 'get'
    },
    update_huissier : { // update a huissier by id (complete)
        url : '/api/staff/huissiers/{id}/',
        method : 'put'
    },
    update_partial_huissier : { // update a huissier by id (partial)
        url : '/api/staff/huissiers/{id}/',
        method : 'patch'
    },
    delete_huissier : { // delete a huissier by id
        url : '/api/staff/huissiers/{id}/',
        method : 'delete'
    }
}

export default SummaryApi;
