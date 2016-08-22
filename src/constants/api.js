export const HOST = 'http://api.yiweimatou.com'

export const USER_API_DOMAIN = `${HOST}:1002`
export const ADMIN_API_DOMAIN = `${HOST}:1001`
export const UPLOAD_DOMAIN = 'http://image.yiweimatou.com:999'
export const ORGANIZE_API_DOMAIN = `${HOST}:1005`
export const LESSON_API_DOMAIN = `${HOST}:1007`
export const AREA_API_DOMAIN = `${HOST}:1003`
export const SECTION_API_DOMAIN = `${HOST}:1008`
export const BOOK_API_DOMAIN = `${HOST}:1006`
export const IMG_URL = 'http://image.yiweimatou.com/ywmt/'
export const MONEY_API_DOMAIN = `${HOST}:1010`
export const MSG_API_DOMAIN = `${HOST}:1004`

/**
 * api codes
 */
export const OK = 200
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const INTERNAL_SERVER_ERROR = 500

/**
 * captcha
 */
export const CAPTCHA_API = `${HOST}:998/captcha/add`
/**
*msg apis
*/
export const MSG_GET_API = `${MSG_API_DOMAIN}/msg/get`
export const MSG_INFO_API = `${MSG_API_DOMAIN}/msg/info`
export const MSG_LIST_API = `${MSG_API_DOMAIN}/msg/list`
/**
*money apis
*/
export const MONEY_INFO_API = `${MONEY_API_DOMAIN}/money/info`
export const MONEY_GET_API = `${MONEY_API_DOMAIN}/money/get`
export const MONEY_LIST_API = `${MONEY_API_DOMAIN}/money/list`
export const MONEY_ADD_API = `${MONEY_API_DOMAIN}/money/add`
/**
 * user apis
 */
export const USER_LOGIN_API = `${USER_API_DOMAIN}/account/login`
export const USER_VALID_API = `${USER_API_DOMAIN}/account/valid`
export const USER_FORGET_PWD_API = `${USER_API_DOMAIN}/account/put/forget`
export const USER_EDIT_PWD_API = `${USER_API_DOMAIN}/account/put/pwd`
export const USER_LOGOUT_API = `${USER_API_DOMAIN}/account/logout`
export const USER_LIST_API = `${USER_API_DOMAIN}/account/list`
export const USER_INFO_API = `${USER_API_DOMAIN}/account/info`
export const USER_GET_API = `${USER_API_DOMAIN}/account/get`
export const USER_MONEY_INFO_API = `${USER_API_DOMAIN}/accountmoney/info`
export const USER_MONEY_LIST_API = `${USER_API_DOMAIN}/accountmoney/list`
export const USER_ALIPAY_SET_API = `${USER_API_DOMAIN}/account/put/alipay`
export const USER_GET_MONEY_API = `${USER_API_DOMAIN}/account/put/withdraw`
/**
 * organize apis
 */
export const ORGANIZE_GET_API = `${ORGANIZE_API_DOMAIN}/organize/get`
export const ORGANIZE_LIST_API = `${ORGANIZE_API_DOMAIN}/organize/list`
export const ORGANIZE_EDIT_API = `${ORGANIZE_API_DOMAIN}/organize/put`
export const ORGANIZE_INFO_API = `${ORGANIZE_API_DOMAIN}/organize/info`
/**
*lesson apis
*/
export const LESSON_GET_API = `${LESSON_API_DOMAIN}/lesson/get`
export const LESSON_INFO_API = `${LESSON_API_DOMAIN}/lesson/info`
export const LESSON_EDIT_API = `${LESSON_API_DOMAIN}/lesson/put`
export const LESSON_LIST_API = `${LESSON_API_DOMAIN}/lesson/list`
export const LESSON_REMOVE_API = `${LESSON_API_DOMAIN}/lesson/del`
export const LESSON_ADD_API = `${LESSON_API_DOMAIN}/lesson/add`
export const LESSON_PUT_CET_API = `${LESSON_API_DOMAIN}/lesson/put/cet`
export const LESSON_MONEY_LIST_API = `${LESSON_API_DOMAIN}/lessonmoney/list`
export const LESSON_MONEY_INFO_API = `${LESSON_API_DOMAIN}/lessonmoney/info`
export const LESSON_RCMD_API = `${LESSON_API_DOMAIN}/lesson/add/rcmd`
/**
*team apis
*/
export const TEAM_GET_API = `${LESSON_API_DOMAIN}/team/get`
export const TEAM_INFO_API = `${LESSON_API_DOMAIN}/team/info`
export const TEAM_EDIT_API = `${LESSON_API_DOMAIN}/team/put`
export const TEAM_ADD_API = `${LESSON_API_DOMAIN}/team/add`
export const TEAM_LIST_API = `${LESSON_API_DOMAIN}/team/list`
export const TEAM_REMOVE_API = `${LESSON_API_DOMAIN}/team/del`
/**
*section apis
*/
export const SECTION_GET_API = `${SECTION_API_DOMAIN}/section/get`
export const SECTION_INFO_API = `${SECTION_API_DOMAIN}/section/info`
export const SECTION_EDIT_API = `${SECTION_API_DOMAIN}/section/put`
export const SECTION_ADD_API = `${SECTION_API_DOMAIN}/section/add`
export const SECTION_LIST_API =`${SECTION_API_DOMAIN}/section/list`
export const SECTION_DELETE_API = `${SECTION_API_DOMAIN}/section/del`
/**
 * area apis
 */
export const AREA_GET_API = `${AREA_API_DOMAIN}/area/get`
export const AREA_LIST_API = `${AREA_API_DOMAIN}/area/list`
export const AREA_INFO_API = `${AREA_API_DOMAIN}/area/info`
/**
 * upload apis
 */
export const UPLOAD_YUNBOOK_API = `${UPLOAD_DOMAIN}/book/img`
export const UPLOAD_LOGO_API = `${UPLOAD_DOMAIN}/logo`
export const UPLOAD_AVATAR_API = `${UPLOAD_DOMAIN}/face`
export const UPLOAD_COVER_API = `${UPLOAD_DOMAIN}/cover`
export const UPLOAD_PPT_API = `${UPLOAD_DOMAIN}/book/ppt`
/**
*yunbook apis
*/
export const YUNBOOK_GET_API = `${BOOK_API_DOMAIN}/book/get`
export const YUNBOOK_ADD_API = `${BOOK_API_DOMAIN}/book/add`
export const YUNBOOK_EDIT_API = `${BOOK_API_DOMAIN}/book/put`
export const YUNBOOK_LIST_API = `${BOOK_API_DOMAIN}/book/list`
export const YUNBOOK_INFO_API = `${BOOK_API_DOMAIN}/book/info`
/**
 * organizelesson apis
 */
export const ORGANIZELESSON_INFO_API = `${ORGANIZE_API_DOMAIN}/organizelesson/info`
export const ORGANIZELESSON_GET_API = `${ORGANIZE_API_DOMAIN}/organizelesson/get`
export const ORGANIZELESSON_LIST_API = `${ORGANIZE_API_DOMAIN}/organizelesson/list`
export const ORGANIZELESSON_ADD_API = `${ORGANIZE_API_DOMAIN}/organizelesson/add`
export const ORGANIZELESSON_EDIT_API = `${ORGANIZE_API_DOMAIN}/organizelesson/put`
export const ORGANIZEMONEY_LIST_API = `${ORGANIZE_API_DOMAIN}/organizemoney/list`
export const ORGANIZEMONEY_INFO_API = `${ORGANIZE_API_DOMAIN}/organizemoney/info`
