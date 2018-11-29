let access_domain = localStorage.getItem('access_domain') || '192.168.0.100:8080';
let access_ws = localStorage.getItem('access_ws') || '192.168.0.100:9000';
exports.item = {
    APP_NAME: 'FASTAG',
    BG_COLOR: '#FCA906',
    FONT_COLOR: '#A22F54',
    COLOR_ONE: '#FCA906',
    COLOR_TWO: '#A22F54',
    COLOR_THREE: '#FFE325',
    MAIN_BGCOLOR: '#FFFFFF',
    API_URL: 'http://' + access_domain + '/api',
    WS_HOSTPORT: 'ws://' + access_ws,
    FORM_TYPE: 'input',
    LOGO: 'images/fastaglogo.jpg'
};