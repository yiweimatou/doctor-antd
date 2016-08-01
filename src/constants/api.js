export const HOST = 'http://121.41.92.56'

export const USER_API_DOMAIN = `${HOST}:1002`
export const ADMIN_API_DOMAIN = `${HOST}:1001`
export const UPLOAD_DOMAIN = `${HOST}:999`
export const ORGANIZE_API_DOMAIN = `${HOST}:1005`
export const LESSON_API_DOMAIN = `${HOST}:1007`
export const AREA_API_DOMAIN = `${HOST}:1003`
export const SECTION_API_DOMAIN = `${HOST}:1008`
/**
 * api codes
 */
export const OK = 200
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const INTERNAL_SERVER_ERROR = 500
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
export const YUNBOOK_GET_API = `${USER_API_DOMAIN}/userbook/get`
export const YUNBOOK_ADD_API = `${USER_API_DOMAIN}/userbook/add`
export const YUNBOOK_EDIT_API = `${USER_API_DOMAIN}/userbook/put`
export const YUNBOOK_LIST_API = `${USER_API_DOMAIN}/userbook/list`
export const YUNBOOK_INFO_API = `${USER_API_DOMAIN}/userbook/info`
/**
 * organizelesson apis
 */
export const ORGANIZELESSON_INFO_API = `${ORGANIZE_API_DOMAIN}/organizelesson/info`
export const ORGANIZELESSON_GET_API = `${ORGANIZE_API_DOMAIN}/organizelesson/get`
export const ORGANIZELESSON_LIST_API = `${ORGANIZE_API_DOMAIN}/organizelesson/list`
export const ORGANIZELESSON_ADD_API = `${ORGANIZE_API_DOMAIN}/organizelesson/add`
export const ORGANIZELESSON_EDIT_API = `${ORGANIZE_API_DOMAIN}/organizelesson/put`