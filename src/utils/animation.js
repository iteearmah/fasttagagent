module.exports = {
  animateInFromRight : animateInFromRight,
  animateInScaleUp : animateInScaleUp,
};

function animateInFromRight(page,id, delay) {
  page.find('#'+id).set({
    opacity: 0.0,
    transform: {translationX: 32}
  });
  page.find('#'+id).animate({
    opacity: 1.0,
    transform: {translationX: 0}
  }, {
    duration: 500,
    delay: delay,
    easing: 'ease-out'
  });
}

function animateInScaleUp(page,id, delay) {
  page.find('#'+id).animate({
    opacity: 1.0,
    transform: {translationX: -64}
  }, {
    duration: 500,
    easing: 'ease-out'
  });
}

