jQuery(document).ready(function onReady() {

    // find current course index
    var courseIndex = 1;
    var search = window.location.search;
    var indexOf = search.indexOf('course');
    if (indexOf > 0) {
      courseIndex = search.substring(indexOf+7, indexOf+8);
    }

    // show widget of correct course index
    jQuery('#teetimecontainer').teetime({
      issuer: "groenstaetetest",
      onlyShowAvailable: true,
      course: courseIndex
    });

    // set select field to current course index
    jQuery('select.widget-input').find('option[value='+courseIndex+']').attr('selected','selected');

    // listen to changing the course index
    jQuery('select.widget-input').change(function() {
      jQuery('#teetimecontainer').teetime('reload', {
        date: jQuery("#datepicker").val(),
        course: jQuery(this).find(":selected").val()
      })
    });

    // configure datepicker
    jQuery( "#datepicker" ).datepicker({
        "dateFormat": "dd-mm-yy",
        "minDate": 0,
        "onSelect": function(date, inst) {
            jQuery('#teetimecontainer').teetime('reload', {
              date: jQuery("#datepicker").val(),
              course: jQuery('select.widget-input').find(":selected").val()
            });
        }
    });
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    jQuery( "#datepicker").val(dd + "-" + mm + "-" + yyyy);

});
