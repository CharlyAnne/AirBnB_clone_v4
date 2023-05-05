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
  
  //Requesting api status
  const statusRes = $('div#api_status');
  
  $.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
		if (data.status === 200) {
			statusRes.addClass("available");
		} else {
			statusRes.removeClass("available");
		}
	});
  
  //To fetch data about Place
  const places = $('section.places');
  
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_serch/',
    data: JSON.stringify({}),
    headers: {
      contentType: 'application/json',
    },
    success: (data) => {
      if (data.status === 200) {
      
      }
    }
  });
});
