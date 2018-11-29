const {
    ui,
    Page,
    Composite,
    ScrollView,
    Button,
    ImageView,
    TextInput,
    TextView,
    ActivityIndicator,
    SearchAction,
    AlertDialog
} = require('tabris');
let config = require('../config.js');
let animation = require('../utils/animation.js');
let generic = require('../utils/generic.js');
ui.navigationBar.background = '#fff';
exports.show = function(navigationView) {
    //login.check(navigationView);
    let event_data = JSON.parse(localStorage.getItem('event_data'));
    let eventLogo = event_data.cover_photo;
    let eventBGColor = event_data.background_color;
    let eventFontColor = event_data.font_color;
    //navigationView.toolbarColor = eventFontColor || config.item.COLOR_TWO;
    let pageTitle = 'Event Monitor - ' + config.item.APP_NAME;
    navigationView.toolbarVisible = true;
    const ATTENDEES = ['Samuel Armah', 'Kofi Annan', 'Ama Boafo', 'Cyril Noko', 'Bismark Deho'];
    let page = new Page({
        title: pageTitle,
        autoDispose: true,
        background: eventBGColor,
    }).appendTo(navigationView);
    let scrollView = new ScrollView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }).appendTo(page);
    let pageContainer = new Composite({
        layoutData: {
            right: '5%',
            left: '5%',
            centerY: 0
        },
        padding: 10,
    }).appendTo(scrollView);
    new TextView({
        id: 'attendee_numbers',
        text: '<h1 style="margin:20px; padding:0px">[NUMS]</h1>',
        markupEnabled: true,
        font: '25px',
        alignment: 'center'
    }).appendTo(pageContainer);
    let action = new SearchAction({
        id: 'search_box',
        title: 'Search',
        image: {
            src: device.platform === 'iOS' ? 'images/search-black-24dp@3x.png' : 'images/search-white-24dp@3x.png',
            scale: 3
        }
    }).on('select', ({
        target
    }) => {
        target.text = '';
        console.log('Selected "' + JSON.stringify(target.index) + '"'+' | '+device.platform);
    }).on('input', ({
        text
    }) => updateAttendees(text)).on('accept', ({
        text
    }) => {
        console.log('Selected "' + text + '"');
    }).appendTo(navigationView);
    updateAttendees('');
    scrollView.apply({
        '#logo_image': {
            top: ['prev()', 10],
            right: 0,
        },
        '#attendee_numbers': {
            left: 10,
            top: ['prev()', 10],
            right: 10,
        },
    });

    function updateAttendees(query) {
        action.proposals = ATTENDEES.filter(attendee => attendee.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    animation.animateInFromRight(page, 'logo_image', 300);
    animation.animateInFromRight(page, 'welcome_message_event', 400);
    animation.animateInFromRight(page, 'welcome_message', 400);
};