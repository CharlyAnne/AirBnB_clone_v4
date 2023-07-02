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

  // update the api status

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

  // populate the places section with data

  const places = $('section.places');

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: (data, textStatus, jqXHR) => {
      if (jqXHR.status === 200) {
        populate(data);
      }
    }
  });

  function populate (data) {
    data.forEach((place, i, arr) => {
      const article = document.createElement('article');

      const title = document.createElement('div');
      const title_name = document.createElement('h2');
      const title_price = document.createElement('div');

      const info = document.createElement('div');
      const info_guest = document.createElement('div');
      const info_rooms = document.createElement('div');
      const info_brooms = document.createElement('div');

      const user = document.createElement('div');

      const desc = document.createElement('div');
      const section = $('section.places');

      $(title).addClass('title_box');
      $(title_name).text(place.name);
      $(title_price).addClass('price_by_night');
      $(title_price).text(place.price_by_night);

      $(info).addClass('information');
      $(info_guest).addClass('max_guest');
      let pl = place.max_guest === 1 ? '' : 's';
      $(info_guest).text(place.max_guest + 'Guest' + pl);
      pl = place.number_rooms === 1 ? '' : 's';
      $(info_rooms).addClass('number_rooms');
      $(info_rooms).text(place.number_rooms + 'Bedroom' + pl);
      $(info_brooms).addClass('number_bathrooms');
      pl = place.number_bathrooms === 1 ? '' : 's';
      $(info_brooms).text(place.number_bathrooms + 'Bathroom' + pl);

      $(user).addClass('user');
      if (place.user) $(user).append(place.user.first_name + ' ' + place.user.last_name); // todo: check for user.first_name and user.last_name

      $(desc).addClass('description');
      if (place.description) {
        $(desc).html(place.description);
      } else {
        $(desc).text('safe');
      }

      $(title).append(title_name).append(title_price);
      $(info).append(info_guest).append(info_rooms).append(info_brooms);
      $(article).append(title).append(info).append(user).append(desc);
      section.append(article);
    });
  }

// filter places based on checked amenities when button clicked

$('button').on('click', () => {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: JSON.stringify({"amenities": Object.keys(checkedAmenities)}),
    contentType: 'application/json',
    success: (data, textStatus, jqXHR) => {
      if (jqXHR.status === 200) {
	      $('section.places').empty();
        populate(data);
      }
    }
  });		
});
});
