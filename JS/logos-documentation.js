/*!
 * # Logos - Documentation.js
 * author: José Daniel Sorto Domínguez
 * email: josdansd@gmail.com
 *
 * This work is protected by copyright in the Honduran legislation and therefore framed its protection in all those countries who are subscribers to the Berne Convention.
 * It's redistribution, modification, remix, transform, or build upon itself it's totally forbidden without Author's consent.
 *
 * Éste trabajo está protegido por la figura de los derechos de autor de acuerdo a la legislación Hondureña, y por tanto enmarcado y protegido también en todos
 * los países suscriptores  del Convenio de Berna.
 * Su redistribución, modificación, alteración, transformación o creaciones derivadas del mismo están totalmente prohíbidas sin el consentimiento del autor.
 */

// Ready Script Tag
$(document).ready(function() {

// Extended Function to Clean Empty Elements on an Array

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

function filesCounter(folderID, folderIndex) {
 var api_key = 'AIzaSyCH1rMUSufwYRevAe_--lgVnqJt_EiaEhc';
 var URL = "https://www.googleapis.com/drive/v3/files?corpora=user&orderBy=folder%2C+name&pageSize=200&q='" + folderID + "'+in+parents&supportsTeamDrives=false&key=" + api_key;
  var promise = $.getJSON(URL, function(data, status) {
  });
  promise.done(function(data) {
    $('.folders-container').children('.folder').eq(folderIndex).find('.quantity > span').text(data.files.length.toString());
  }).fail(function() {
  });
  }
  function filesLister(folderID) {
   var api_key = 'AIzaSyCH1rMUSufwYRevAe_--lgVnqJt_EiaEhc';
   var URL = "https://www.googleapis.com/drive/v3/files?corpora=user&orderBy=folder%2C+name&pageSize=200&q='" + folderID + "'+in+parents&supportsTeamDrives=false&key=" + api_key;
    var promise = $.getJSON(URL, function(data, status) {
    });
    promise.done(function(data) {
      $('.grid-container').empty();
      $('.helper-container').children('ul').empty();
      $('#categoryFilters').children().not(':first').remove();
      var buttonConstructor = [];
      var helperConstructor = [];
      Object.keys(data.files).forEach(function(key, index) {
        if (data.files[index].mimeType != "application/vnd.google-apps.folder") {
          var extensionRemover = data.files[index].name;
          var getViewLink = 'https://drive.google.com/file/d/' + data.files[index].id + '/edit?usp=sharing'
          var getDownloadLink = 'https://drive.google.com/uc?export=download&id=' + data.files[index].id;
          var catTranslator = extensionRemover.match(/(\(cat:.{3}\))/gm);
          var indexRestart = index + 1;
          extensionRemover = extensionRemover.replace(/(\..{3}$)/gm, "");
          extensionRemover = extensionRemover.replace(/(\(cat:.{3}\))/gm, "");
          var category;
          var categoryHelper;
          function categoryDeterminator() {
            if (catTranslator == '(cat:CIV)') { // Civil
           category = 'category-a';
           categoryHelper = 'Derecho Civil';
            }
            if (catTranslator == '(cat:MER)') { // Mercantil
            category = 'category-b';
            categoryHelper = 'Derecho Mercantil';
            }
            if (catTranslator == '(cat:LAB)') { // Laboral
           category = 'category-c';
           categoryHelper = 'Derecho Laboral';
            }
            if (catTranslator == '(cat:PRO)') { // Procesal
           category = 'category-d';
           categoryHelper = 'Derecho Procesal';
            }
            if (catTranslator == '(cat:AMB)') { // Ambiental
           category = 'category-e';
           categoryHelper = 'Derecho Ambiental';
            }
            if (catTranslator == '(cat:CON)') { // Constitucional
           category = 'category-f';
           categoryHelper = 'Derecho Constitucional';
            }
            if (catTranslator == '(cat:ADM)') { // Administrativo
           category = 'category-g';
           categoryHelper = 'Derecho Administrativo';
            }
            if (catTranslator == '(cat:HUM)') { // Humanos
           category = 'category-h';
           categoryHelper = 'Derechos Humanos';
            }
            if (catTranslator == '(cat:INT)') { // Internacional
           category = 'category-i';
           categoryHelper = 'Derecho Internacional';
            }
            if (catTranslator == '(cat:BAN)') { // Bancario
           category = 'category-j';
           categoryHelper = 'Derecho Bancario';
            }
            if (catTranslator == '(cat:PEN)') { // Penal
           category = 'category-k';
           categoryHelper = 'Derecho Penal';
            }
            if (catTranslator == '(cat:SEN)') { // Sentencias
           category = 'category-l';
           categoryHelper = 'Sentencias';
            }
            if (catTranslator == '(cat:GEN)') { // General
           category = 'category-m';
           categoryHelper = 'Derecho en General';
            }
            if (catTranslator == '(cat:PUB)') { // Público
           category = 'category-n';
           categoryHelper = 'Derecho Público';
            }
            if (catTranslator == '(cat:PRI)') { // Privado
           category = 'category-o';
           categoryHelper = 'Derecho Privado';
            }
            if (catTranslator == null) {
             category = 'category-u';
            }
          }
          categoryDeterminator();
          buttonConstructor.push(category);
          helperConstructor.push(categoryHelper);
          $('.grid-container').append('<div class="mix item ' + category + '" data-category="' + category + '" data-order="' + indexRestart.toString() + '"><h5 class="item-title"><i class="fa fa-book" aria-hidden="true"></i>' + extensionRemover + '</h5><div class="hi-icon-wrap hi-icon-effect-3 hi-icon-effect-3a"><a class="hi-icon hi-icon-images" target="_blank" href="' + getViewLink + '"><i class="fa fa-eye" aria-hidden="true"></i></a></div><div class="hi-icon-wrap hi-icon-effect-3 hi-icon-effect-3a"><a class="hi-icon hi-icon-images" href="' + getDownloadLink + '"><i class="fa fa-download" aria-hidden="true"></i></a></div></div>');
        } else {
        }
      });
      buttonConstructor.clean(undefined);
      buttonConstructor = buttonConstructor.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
      helperConstructor.clean(undefined);
      helperConstructor = helperConstructor.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
      });
      for (i = 0; i < helperConstructor.length; i++) {
          $('<li><em></em><b>' + helperConstructor[i] + '</b>: Documentos en <span style="font-weight: bold;">éste color</span>.</li>').appendTo('.helper-container > ul');
      }
      var getCatColor;
      for (i = 0; i < buttonConstructor.length; i++) {
          $('<button type="button" class="filter" data-filter=".' + buttonConstructor[i] + '"></button>').appendTo('#categoryFilters');
          getCatColor = $('.mix.item.' + buttonConstructor[i]).first().css("border-left-color");
          $('.helper-container').find('ul > li:eq(' + i + ')').children('em').css('background', getCatColor);
          $('.helper-container').find('ul > li:eq(' + i + ')').children('span').css('color', getCatColor);
      }
      if ( $('.helper-container > ul').children().length >= 4 ) {
          $('.helper-container > ul > li:eq(2)').before('<li class="more"><div></div></li>');
          $('.helper-container > ul > li:eq(2)').nextAll().hide();
      }
      $('.folders-container').hide();
      $('.grid-container, .helper-container, .button-container').show();
      $('.page.dimmer').dimmer('hide');
      $('.grid-container').mixItUp();
      searchInit();
    }).fail(function() {
    });
  }

$('.helper-container').on('click', 'li.more', function() {
  if ( $(this).next().css('display') == 'none' ) {
    $(this).nextAll().show();
  } else {
    $(this).nextAll().hide();
  }
});

function searchInit() {
  console.log('running Search init');
  var inputText;
  var $matching = $();

  // Delay function
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  $("#searchInput").keyup(function(){
    // Delay function invoked to make sure user stopped typing
    delay(function(){
      inputText = $("#searchInput").val().toLowerCase();

      // Check to see if input field is empty
      if ((inputText.length) > 0) {
        $( '.mix.item').each(function() {
          $this = $("this");

           // add item to be filtered out if input text matches items inside the title
           if($(this).children('.item-title').text().toLowerCase().match(inputText)) {
            $matching = $matching.add(this);
          }
          else {
            // removes any previously matched item
            $matching = $matching.not(this);
          }
        });
        $(".grid-container").mixItUp('filter', $matching);
      }

      else {
        // resets the filter to show all item if input is empty
        $(".grid-container").mixItUp('filter', 'all');
      }
    }, 200 );
  });
}

  var fstFolderID = '0Bz_5QRNicMYRVEx0X3YtT0k4SGc'; // Códigos
  var sndFolderID = '0Bz_5QRNicMYRQ2F1NlFxWjVDSlU'; // Doctrina
  var trdFolderID = '0Bz_5QRNicMYRcXl0a3NiZG14dWM'; // Leyes
  var fthFolderID = '0Bz_5QRNicMYRbmkya0d5RHJhUVU'; // Reglamentos

  filesCounter(fstFolderID, 0);
  filesCounter(sndFolderID, 1);
  filesCounter(trdFolderID, 2);
  filesCounter(fthFolderID, 3);

 $('.folder').on('click', function() {
  $('.page.dimmer').dimmer('show');
  if ( $(this).is(':nth-child(1)') ) {
    filesLister(fstFolderID);
    $('.modular-tab:nth-child(1)').toggleClass('active');
  }
  if ( $(this).is(':nth-child(2)') ) {
    filesLister(sndFolderID);
    $('.modular-tab:nth-child(2)').toggleClass('active');
  }
  if ( $(this).is(':nth-child(3)') ) {
    filesLister(trdFolderID);
    $('.modular-tab:nth-child(3)').toggleClass('active');
  }
  if ( $(this).is(':nth-child(4)') ) {
    filesLister(fthFolderID);
    $('.modular-tab:nth-child(4)').toggleClass('active');
  }
 });

 $('.document-repository').on('click', '.button-container .modular-tab', function() {
   $('.page.dimmer').dimmer('show');
   $('.grid-container').empty();
   $('.grid-container').mixItUp('destroy');
   if ( $(this).is(':nth-child(1)') ) {
     filesLister(fstFolderID);
     $(this).toggleClass('active');
     $(this).siblings().removeClass('active');
   }
   if ( $(this).is(':nth-child(2)') ) {
     filesLister(sndFolderID);
     $(this).toggleClass('active');
     $(this).siblings().removeClass('active');
   }
   if ( $(this).is(':nth-child(3)') ) {
     filesLister(trdFolderID);
     $(this).toggleClass('active');
     $(this).siblings().removeClass('active');
   }
   if ( $(this).is(':nth-child(4)') ) {
     filesLister(fthFolderID);
     $(this).toggleClass('active');
     $(this).siblings().removeClass('active');
   }
 });
});

if (matchMedia) {
  var mq = window.matchMedia("(max-width: 420px)");
  mq.addListener(WidthChange);
  WidthChange(mq);
}

function WidthChange(mq) {
  if (mq.matches) {
    $('#searchInput').on('focusin', function() {
      $(this).closest('.menu-group').siblings().hide().end().closest('.document-repository').find('.helper-container').hide();
    });
    $('#searchInput').on('focusout', function() {
      $(this).closest('.menu-group').siblings().show().end().closest('.document-repository').find('.helper-container').show();
    });
  }
}
