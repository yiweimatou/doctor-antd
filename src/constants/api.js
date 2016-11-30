export const HOST = 'http://api.yiweimatou.com'

export const WECHATLOGIN = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxe17a9f1153e4a1b5&scope=snsapi_login&redirect_uri=http%3A%2F%2Fwww.yiweimatou.com&state=doctor'

export const USER_API_DOMAIN = `${HOST}:4001`
export const ADMIN_API_DOMAIN = `${HOST}:4001`
export const UPLOAD_DOMAIN = 'http://image.yiweimatou.com:999'
export const ORGANIZE_API_DOMAIN = `${HOST}:4001`
export const LESSON_API_DOMAIN = `${HOST}:4001`
export const AREA_API_DOMAIN = `${HOST}:4001`
export const SECTION_API_DOMAIN = `${HOST}:4001`
export const BOOK_API_DOMAIN = `${HOST}:4001`
export const IMG_URL = 'http://image.yiweimatou.com/ywmt/'
export const BILL_API_DOMAIN = `${HOST}:4001`
export const MSG_API_DOMAIN = `${HOST}:4001`
/**
 * default images
 */
export const DEFAULT_FACE = 'http://image.yiweimatou.com/ywmt/face/default.png'
export const DEFAULT_COVER = 'http://image.yiweimatou.com/ywmt/cover/lesson.png'
export const DEFAULT_LOGO = 'http://image.yiweimatou.com/ywmt/logo/default.png'
export const DEFAULT_TOPICS = 'http://image.yiweimatou.com/topics.png'
/*
*category
 */
export const TEXT = '17'
export const DOC = '16'
export const WX = '15'
export const BAIKE = '14'
export const AUDIO = '13'
export const VIDEO = '12'
export const IMAGE = '11'
export const NOTICE = '10'
export const HTML = '9'
export const ACTIVE = '8'
export const TOPICS = '6'
export const TOPIC = '7'
export const BOOK = '5'
export const SECTION = '4'
export const LESSON = '3'
export const ORGANIZE = '2'
export const ACCOUNT = '1'
/**
 * api codes
 */
export const OK = 200
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const INTERNAL_SERVER_ERROR = 500
/**
 * source apis
 */
export const SOURCE_GET_API = `${USER_API_DOMAIN}/source/get`
export const SOURCE_Add_API = `${USER_API_DOMAIN}/source/add`
export const SOURCE_INFO_API = `${USER_API_DOMAIN}/source/info`
export const SOURCE_LIST_API = `${USER_API_DOMAIN}/source/list`
export const SOURCE_EDIT_API = `${USER_API_DOMAIN}/source/put`
export const SOURCE_DELETE_API = `${USER_API_DOMAIN}/source/del`
/**
 * grow apis
 */
export const GROW_GET_API = `${ADMIN_API_DOMAIN}/grow/get`
export const GROW_INFO_API = `${ADMIN_API_DOMAIN}/grow/info`
export const GROW_ADD_API = `${ADMIN_API_DOMAIN}/grow/add`
export const GROW_EDIT_API = `${ADMIN_API_DOMAIN}/grow/put`
export const GROW_DELETE_API = `${ADMIN_API_DOMAIN}/grow/del`
export const GROW_LIST_API = `${ADMIN_API_DOMAIN}/grow/list`
/**
 * captcha
 */
export const CAPTCHA_API = `${HOST}:4001/captcha/add`
/**
 * category api
 */
export const CATEGORY_API = 'http://m.yiweimatou.com/api/area'
/**
 *msg apis
 */
export const MSG_GET_API = `${MSG_API_DOMAIN}/msg/get`
export const MSG_INFO_API = `${MSG_API_DOMAIN}/msg/info`
export const MSG_LIST_API = `${MSG_API_DOMAIN}/msg/list`
/**
 * paper
 */
export const PAPER_GET_API = `${USER_API_DOMAIN}/paper/get`
export const PAPER_INFO_API = `${USER_API_DOMAIN}/paper/info`
export const PAPER_LIST_API = `${USER_API_DOMAIN}/paper/list`
/**
 * papers
 */
export const PAPERS_GET_API = `${USER_API_DOMAIN}/papers/get`
export const PAPERS_LIST_API = `${USER_API_DOMAIN}/papers/list`
export const PAPERS_INFO_API = `${USER_API_DOMAIN}/papers/info`
/**
 * topic apis
 */
export const TOPIC_ADD_API = `${USER_API_DOMAIN}/topic/add`
export const TOPIC_GET_API = `${USER_API_DOMAIN}/topic/get`
export const TOPIC_INFO_API = `${USER_API_DOMAIN}/topic/info`
export const TOPIC_LIST_API = `${USER_API_DOMAIN}/topic/list`
export const TOPIC_PUT_API = `${USER_API_DOMAIN}/topic/put`
export const TOPIC_DEL_API = `${USER_API_DOMAIN}/topic/del`
/**
 * topics apis
 */
export const  TOPICS_GET_API = `${USER_API_DOMAIN}/topics/get`
export const  TOPICS_ADD_API = `${USER_API_DOMAIN}/topics/add`
export const  TOPICS_INFO_API = `${USER_API_DOMAIN}/topics/info`
export const  TOPICS_LIST_API = `${USER_API_DOMAIN}/topics/list`
export const  TOPICS_PUT_API = `${USER_API_DOMAIN}/topics/put`
export const  TOPICS_DEL_API = `${USER_API_DOMAIN}/topics/del`
export const  TOPICS_BUY_API = `${USER_API_DOMAIN}/topics/buy`
/**
 *bill apis
 */
export const BILL_INFO_API = `${BILL_API_DOMAIN}/bill/info`
export const BILL_GET_API = `${BILL_API_DOMAIN}/bill/get`
export const BILL_LIST_API = `${BILL_API_DOMAIN}/bill/list`
export const BILL_ADD_API = `${BILL_API_DOMAIN}/bill/add`
export const BILL_EDIT_API = `${BILL_API_DOMAIN}/bill/put`
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
export const LESSON_RCMD_API = `${LESSON_API_DOMAIN}/lesson/add/rcmd`
/**
 *team apis
 */
export const TEAM_GET_API = `${LESSON_API_DOMAIN}/lesson_team/get`
export const TEAM_INFO_API = `${LESSON_API_DOMAIN}/lesson_team/info`
export const TEAM_EDIT_API = `${LESSON_API_DOMAIN}/lesson_team/put`
export const TEAM_ADD_API = `${LESSON_API_DOMAIN}/lesson_team/add`
export const TEAM_LIST_API = `${LESSON_API_DOMAIN}/lesson_team/list`
export const TEAM_REMOVE_API = `${LESSON_API_DOMAIN}/lesson_team/del`
/**
 *section apis
 */
export const SECTION_GET_API = `${SECTION_API_DOMAIN}/section/get`
export const SECTION_INFO_API = `${SECTION_API_DOMAIN}/section/info`
export const SECTION_EDIT_API = `${SECTION_API_DOMAIN}/section/put`
export const SECTION_ADD_API = `${SECTION_API_DOMAIN}/section/add`
export const SECTION_LIST_API = `${SECTION_API_DOMAIN}/section/list`
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
export const UPLOAD_IMG_API = `${UPLOAD_DOMAIN}/img`
export const UPLOAD_FILE_API = `${UPLOAD_DOMAIN}/file`
/**
 *yunbook apis
 */
export const YUNBOOK_GET_API = `${BOOK_API_DOMAIN}/book/get`
export const YUNBOOK_ADD_API = `${BOOK_API_DOMAIN}/book/add`
export const YUNBOOK_EDIT_API = `${BOOK_API_DOMAIN}/book/put`
export const YUNBOOK_LIST_API = `${BOOK_API_DOMAIN}/book/list`
export const YUNBOOK_INFO_API = `${BOOK_API_DOMAIN}/book/info`
export const YUNBOOK_BUY_API = `${BOOK_API_DOMAIN}/book/buy`
/**
*organize_focus
*/
export const ORGANIZE_FOCUS_INFO = `${ORGANIZE_API_DOMAIN}/organize_focus/info`
export const ORGANIZE_FOCUS_LIST = `${ORGANIZE_API_DOMAIN}/organize_focus/list`
/**
 * organizelesson apis
 */
export const ORGANIZELESSON_INFO_API = `${ORGANIZE_API_DOMAIN}/organize_lesson/info`
export const ORGANIZELESSON_GET_API = `${ORGANIZE_API_DOMAIN}/organize_lesson/get`
export const ORGANIZELESSON_LIST_API = `${ORGANIZE_API_DOMAIN}/organize_lesson/list`
export const ORGANIZELESSON_ADD_API = `${ORGANIZE_API_DOMAIN}/organize_lesson/add`
export const ORGANIZELESSON_EDIT_API = `${ORGANIZE_API_DOMAIN}/organize_lesson/put`
export const ORGANIZE_BUY = `${ORGANIZE_API_DOMAIN}/organize_lesson/buy`
/**
 * organizeteam apis
 */
export const ORGANIZE_TEAM_INFO_API = `${ORGANIZE_API_DOMAIN}/organize_team/info`
export const ORGANIZE_TEAM_GET_API = `${ORGANIZE_API_DOMAIN}/organize_team/get`
export const ORGANIZE_TEAM_LIST_API = `${ORGANIZE_API_DOMAIN}/organize_team/list`
export const ORGANIZE_TEAM_EDIT_API = `${ORGANIZE_API_DOMAIN}/organize_team/put`
export const ORGANIZE_TEAM_ADD_API = `${ORGANIZE_API_DOMAIN}/organize_team/add`
export const ORGANIZE_TEAM_DEL = `${ORGANIZE_API_DOMAIN}/organize_team/del`
/**
 * timetable
 */
export const TIME_TABLE_ADD = `${USER_API_DOMAIN}/timetable/add`
export const TIME_TABLE_EDIT = `${USER_API_DOMAIN}/timetable/put`
export const TIME_TABLE_GET = `${USER_API_DOMAIN}/timetable/get`
/**
 * url
 */
export const HTML_GET = `${UPLOAD_DOMAIN}/header/info`
