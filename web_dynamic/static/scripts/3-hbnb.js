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

  // Requesting api status
  const statusRes = $('#api_status');

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: (data) => {
      if (data.status === 200) {
        console.log('Hello');
        statusRes.addClass('available');
      } else {
        statusRes.removeClass('available');
      }
    },
    fail: (error) => { console.log(error); }
  });

  // To fetch data about Place
  const places = $('section.places');

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    headers: {
      accept: 'application/json'
    },
    success: (data, statuPhrase, resp) => {
      if (resp.status === 200) {
        data.forEach(place => {
          const article = $('<article></article>');
          const price = $(`<div><h2>${place.price_by_night}</h2></div>`).addClass('price_by_night');
          const title = $('<div></div>').addClass('title_box').append(`<h2>${place.name}</h2>`, price);
          const info = $('<div></div>').addClass('information');
          const rooms = $(`<div>${place.number_rooms}</div>`).addClass('number_rooms');
          const bathRooms = $(`<div>${place.number_bathrooms}</div>`).addClass('number_rooms');
          const guests = $(`<div>${place.max_guest}</div>`).addClass('max_guest');
          const description = $(`<div>${place.description}</div>`).addClass('description');
          info.append(guests, rooms, bathRooms);
          article.append(title, info, description);
          places.append(article);
        });
      }
    },
    error: (xhr, staus, error) => { console.log(error); }
  });
});
