$(function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};
  const places_id = [];

  // Add amenity to list
  const amenityCheckbox = $('.amenity_checkbox');
  amenityCheckbox.on('change', function () {
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

  // Add states to list
  const stateCheckbox = $('.state_checkbox');
  stateCheckbox.on('change', function() {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');

    if ($(this).is(':checked')) {
      checkedStates[stateId] = stateName;
    } else {
      delete checkedStates[stateId];
    }
    const selectedStates = Object.values(checkedStates).join(', ');
    $('.locations h4').text(selectedStates);
  });

  // Add cities to list
  const cityCheckbox = $('.city_checkbox');
  cityCheckbox.on('change', function() {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');

    if ($(this).is(':checked')) {
      checkedCities[cityId] = cityName;
    } else {
      delete checkedCities[cityId];
    }
    const selectedCities = Object.values(checkedCities).join(', ');
    $('.locations h4').text(selectedCities);
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
  }).promise().done(() => {
    // add reviews
  $("article span").on('click', function() {
      if ($(this).text() === 'show'){
			displayReviews($(this).closest('article'));
			$(this).text('hide');
		  } else {
			  removeReviews($(this).closest('article'));
			  $(this).text('show');
		}
    });
    });

  function populate (data) {
    data.forEach((place, i, arr) => {
      const article = document.createElement('article');
      $(article).attr('id', place.id);

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

	const reviews = $('<div>');
	const reviews_title = $('<h2>');
	const reviews_title_span = $('<span>');
	
	places_id.push(place.id);
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
	$(reviews).addClass('reviews');
	$(reviews_title).text('Reviews');
	$(reviews_title_span).text('show');
	$(reviews_title).append(reviews_title_span);
	$(reviews).append(reviews_title);

      $(title).append(title_name).append(title_price);
      $(info).append(info_guest).append(info_rooms).append(info_brooms);
      $(article).append(title).append(info).append(user).append(desc).append(reviews);
      section.append(article);
    });
  }

// display reviews

  function displayReviews(p_a){
	const place_id = $(p_a).attr('id');
	$.ajax({
    	  type: 'GET',
    	  url: 'http://127.0.0.1:5001/api/v1/places/'+place_id+'/reviews',
    	  success: (data, textStatus, jqXHR) => {
      	  	if (jqXHR.status === 200) {
      			let usernames = getUsers(data);
            console.log(usernames);
			const list = $('<ul>');
			data.forEach((rvw, ix, jx) => {
        console.log(usernames);
				const userDate = $('<h3>').text(usernames[ix]+ ' ' + rvw.updated_at);
				const p = $('<p>').html(rvw.text);
				const li = $('<li>').append(userDate).append(p);
				list.append(li);
			});
			p_a.find('.reviews').append(list);
		}
	  },
    	  error: (error) => {
      		console.log(error.status);
    	  }
  	});		
  }
// getUsers
function getUsers(reviews){
  let users = [];
  reviews.forEach((review, ix, arr) => {
	$.ajax({
          type: 'GET',
          url: 'http://127.0.0.1:5001/api/v1/users/'+review.user_id,
          success: (u_data, stat, jX) => {
          	users.push(u_data.first_name + ' ' + u_data.last_name);
            	}
          });
    //console.log(users);
  	});
  return users;
}
// remove_reviews
function removeReviews(p_a){
	p_a.find('.reviews').find('ul').remove();
}
// filter places based on checked amenities when button clicked

$('button').on('click', () => {
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    data: JSON.stringify({"amenities": Object.keys(checkedAmenities), "states":Object.keys(checkedStates), "cities":Object.keys(checkedCities)}),
    contentType: 'application/json',
    success: (data, textStatus, jqXHR) => {
      if (jqXHR.status === 200) {
	      $('section.places').empty();
        populate(data);
      }
    }
  }).promise().done(() => {
    // add reviews
  $("article span").on('click', function() {
      if ($(this).text() === 'show'){
			displayReviews($(this).closest('article'));
			$(this).text('hide');
		  } else {
			  removeReviews($(this).closest('article'));
			  $(this).text('show');
		}
    });
    });
});
});
