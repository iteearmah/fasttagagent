let access_domain = localStorage.getItem('access_domain') || '192.168.0.100:8080';
let access_ws = localStorage.getItem('access_ws') || '192.168.0.100:9000';
let appImages = require('./utils/appImages.js');
exports.item = {
    APP_NAME: 'FASTAG',
    BG_COLOR: '#5c3159',
    FONT_COLOR: '#A22F54',
    COLOR_ONE: '#FCA906',
    COLOR_TWO: '#A22F54',
    COLOR_THREE: '#FFE325',
    MAIN_BGCOLOR: '#5c3159',
    BUTTON_PRIMARY: '#1161EE',
    BUTTON_WARNING: '#F14141',
    LABEL_COLOR: '#FFF',
    API_URL: 'http://' + access_domain + '/api',
    WS_HOSTPORT: 'ws://' + access_ws,
    FORM_TYPE: 'input',
    LOGO: 'images/fastaglogo.png',
    PAGE_BG: appImages.appbg(),
};