$(function () {
  const checkbox = $('.amenity_checkbox');
  const checkedAmenities = {};

  checkbox.on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      // Add amenity id and name to object if checkbox is checked
      checkedAmenities[amenityId] = amenityName;
    } else {
      // Remove amenity id and name from object if checkbox is unchecked
      delete checkedAmenities[amenityId];
    }

    // update the text of the <h4> element with the names of the checked amenities
    const selectedAmenities = Object.values(checkedAmenities).join(', ');
    $('.amenities h4').text(selectedAmenities);
  });

  const stat = $('div#api_status');

  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:5001/api/v1/status/',
    success: (data, textStatus, jqXHR) => {
      if (jqXHR.status === 200) {
        stat.addClass('available');
      }
    },
    error: () => {
      stat.removeClass('available');
    }
  });
});
