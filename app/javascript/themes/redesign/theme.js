// =========== Webpack ===========
import 'bootstrap-select'
import 'slick-carousel'
import 'jquery-validation'

// =========== Vendor ===========

// JS
import 'themes/redesign/javascript/theme.min'
import 'themes/redesign/vendor/easy-pie-chart/jquery.easypiechart.min.js'

// TODO: Remove the hs.core and hs.clipboard in favor of stimulus
import 'themes/redesign/javascript/hs.core'
import 'themes/redesign/javascript/components/hs.clipboard'
// Images
import 'themes/redesign/images/logo/twitter.svg'
import 'themes/redesign/images/decoration/bubble4.svg'

document.addEventListener('turbolinks:before-cache', function () {
  $('[data-toggle="tooltip"]').tooltip('hide')
})

document.addEventListener('turbolinks:load', function() {
  var mySVGsToInject = document.querySelectorAll('img.js-svg-injector');
  SVGInjector(mySVGsToInject);

  // var skin = localStorage.getItem('skin') || 'default';
  // var unusedLink = document.querySelector('link[data-skin]:not([data-skin="' + skin + '"])');
  // unusedLink.setAttribute('rel', '');
  // unusedLink.setAttribute('disabled', true);
})


      