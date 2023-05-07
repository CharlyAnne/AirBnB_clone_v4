$(function (e) {
  // task 3
  const checkbox = $(".amenity_checkbox");
  const stateBox = $(".stateCheckout");
  const cityBox = $(".cityCheckout");

  cityBox.on("change", (e) => {
    handleEvent(e, "city");
  });
  stateBox.on("change", (e) => {
    handleEvent(e, "state");
  });
  checkbox.on("change", (e) => {
    handleEvent(e, "amenity");
  });

  // Requesting api status || task 4
  const statusRes = $("#api_status");

  $.ajax({
    url: "http://0.0.0.0:5001/api/v1/status/",
    type: "GET",
    success: (data) => {
      if (data.status === 200) {
        console.log("Hello");
        statusRes.addClass("available");
      } else {
        statusRes.removeClass("available");
      }
    },
    fail: (error) => {
      console.log(error);
    },
  });
  handleEvent(e, "all");

  // To fetch data about Place || task 5
  function requestPlaces(filter) {
    const places = $("section.places");
    places.empty();

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5001/api/v1/places_search/",
      data: JSON.stringify(filter),
      contentType: "application/json",
      headers: {
        accept: "application/json",
      },
      success: (data, statuPhrase, resp) => {
        console.log(data);
        if (resp.status === 200) {
          data.forEach((place) => {
            const article = $("<article></article>");
            const price = $(
              `<div><h2>$${place.price_by_night}</h2></div>`
            ).addClass("price_by_night");
            const title = $("<div></div>")
              .addClass("title_box")
              .append(`<h2>${place.name}</h2>`, price);
            const info = $("<div></div>").addClass("information");
            const rooms = $(`<div>${place.number_rooms}</div>`).addClass(
              "number_rooms"
            );
            const bathRooms = $(
              `<div>${place.number_bathrooms}</div>`
            ).addClass("number_rooms");
            const guests = $(`<div>${place.max_guest}</div>`).addClass(
              "max_guest"
            );
            const description = $(`<div>${place.description}</div>`).addClass(
              "description"
            );
            info.append(guests, rooms, bathRooms);
            article.append(title, info, description);
            places.append(article);
          });
        }
      },
      error: (xhr, staus, error) => {
        console.log(error);
      },
    });
  }
  // Task 6
  function registerChecked(e, collection) {
    const itemId = $(e.target).data("id");

    if (e.target.checked) {
      // Add amenity id and name to object if checkbox is checked
      collection.push(itemId);
    } else {
      // Remove amenity id and name from object if checkbox is unchecked
      collection.splice(collection.indexOf(itemId), 1);
    }
    return collection;
  }
  /*
  $('.stateCheckbox').click(function () {
    if ($(this).prop('checked')) {
      stateIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete stateIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(stateIds).concat(
                          Object.values(cityIds)).join(', '));
    }
  });
  $('.cityCheckBox').click(function () {
    if ($(this).prop('checked')) {
      cityIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if
      (!$(this).prop('checked')) {
        delete cityIds[$(this).attr('data-id')];
    }
    if (Object.keys(stateIds).length === 0 && Object.keys(cityIds).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(cityIds).concat(Object.values(
                                                  stateIds)).join(', '));
    }
  }); */
  function handleEvent(e, boxType) {
    let cityBoxes = localStorage.getItem("checkedCities")
      ? localStorage.getItem("checkedCities").split(",")
      : [];
    let stateBoxes = localStorage.getItem("checkedStates")
      ? localStorage.getItem("checkedStates").split(",")
      : [];
    let checkedAmenities = localStorage.getItem("checkedAms")
      ? localStorage.getItem("checkedAms").split(",")
      : [];
    if (boxType === "city") {
      cityBoxes = registerChecked(e, cityBoxes);
      localStorage.setItem("checkedCities", cityBoxes);
    } else if (boxType === "state") {
      stateBoxes = registerChecked(e, stateBoxes);
      localStorage.setItem("checkedStates", stateBoxes);
    } else if (boxType === "amenity") {
      checkedAmenities = registerChecked(e, checkedAmenities);
      localStorage.setItem("checkedAms", checkedAmenities);
    }
    requestPlaces({
      states: stateBoxes,
      cities: cityBoxes,
      amenities: checkedAmenities,
    });
  }

  //task 7 || Reviews
  function displayReviews(i, p_a) {
    const place_id = place_id[i];
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:5001/api/v1/places/" + place_id + "/reviews",
      success: (data, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          let usernames = getUsers(data);
          const list = $("<ul>");
          data.forEach((rvw, ix, jx) => {
            const userDate = $("<h3>").text(
              usernames[ix] + " " + rvw.updated_at
            );
            const p = $("<p>").html(rvw.text);
            const li = $("<li>").append(userDate).append(p);
            list.append(li);
          });
          p_a.find(".reviews").append(list);
        }
      },
      error: (error) => {
        console.log(error.status);
      },
    });
  }
  // getUsers reviews
  function getUsers(reviews) {
    let users = [];
    reviews.forEach((review, ix, arr) => {
      $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5001/api/v1/users/" + review.user_id,
        success: (u_data, stat, jX) => {
          users.push(u_data.first_name + " " + u_data.last_name);
        },
      });
    });
    return users;
  }
  // remove reviews
  function removeReviews(p_a) {
    p_a.find(".reviews ul").remove();
  }
});
