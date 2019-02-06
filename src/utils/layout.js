module.exports = {
    logoContainer: logoContainer,
    pageContainer: pageContainer,
};
const {
    ui,
    Composite,
} = require('tabris');

function logoContainer(parentWidget, height = 100) {
    let logoContainer = new Composite({
        background: '#fff',
        layoutData: {
            top: 0,
            right: 0,
            left: 0,
            bottom: '70%'
        },
        padding: 0,
    }).appendTo(parentWidget);
    return logoContainer;
};

function pageContainer(nextWidget) {
    let pageContainer = new Composite({
        background: '#92A618',
        layoutData: {
            top: '40%',
            right: 0,
            left: 0,
        },
        padding: 10,
    }).appendTo(nextWidget);
    return pageContainer;
};