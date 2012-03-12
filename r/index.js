function TimearoundModel() {
  var self = this;

  self.username = ko.observable("");
  self.isLoggedIn = ko.computed(function() {
    return self.username().length > 0;
  });
  self.enteredUsername = ko.observable("");
  self.events = ko.observableArray([]);
  self.ads = ko.observableArray([]);
  self.categories = ko.computed(function() {
    var cats = {};
    var evs = self.events();
    for (var i = 0; i < evs.length; i++) {
      if (typeof cats[evs[i]["category"]] == "undefined") {
        cats[evs[i]["category"]] = 0;
      }
      cats[evs[i]["category"]] += 1;
    }
    var cats2 = [];
    for (var c in cats) {
      cats2.push({"name": c, "count": cats[c]});
    }
    return cats2;
  });
  self.categoryNames = ko.computed(function() {
    var cats = self.categories();
    var cats2 = [];
    for (var i = 0; i < cats.length; i++) {
      cats2.push(cats[i]['name']);
    }
    return cats2;
  });
  self.selectedCategory = ko.observable(undefined);
  self.selectedElement = $("#homeNavElement");
  self.selectedEvents = ko.computed(function() {
    var cat = self.selectedCategory();
    if (typeof cat == "undefined") {
      return [];
    }
    var evs = self.events();
    if (cat == "All") {
      return evs;
    }
    var selEvs = [];
    if (cat == "My") {
      for (var i = 0; i < evs.length; i++) {
        if (evs[i]['attending']()) {
          selEvs.push(evs[i]);
        }
      }
    } else {
      for (var i = 0; i < evs.length; i++) {
        if (evs[i]['category'] == cat) {
          selEvs.push(evs[i]);
        }
      }
    }
    return selEvs;
  });
  self.currentEvent = ko.observable({"category":"",
                                     "short": "",
                                     "long": "",
                                     "date": "",
                                     "place": "",
                                     "reviews": [],
                                     "attending": ko.observable(false),
                                    });
  self.loginContinuation = function() { };

  self.aeCategory = ko.observable("");
  self.aeShort = ko.observable("");
  self.aeLong = ko.observable("");
  self.aeDate = ko.observable("");
  self.aePlace = ko.observable("");

  function assertLogin(cont) {
    if (!self.isLoggedIn()) {
      self.loginContinuation = cont;
      self.showLogin();
      throw "not_logged_in";
    }
  }

  self.showLogin = function() {
    $("#loginBox").modal();
    $("#loginBox")[0].style.zIndex = "2060";
    $("#usernameText").focus();
  }

  self.doLogin = function() {
    console.log("Logging in as", self.enteredUsername());

    if (self.enteredUsername().length > 0) {
      $("#loginBox").modal("hide");
      self.username(self.enteredUsername());
      self.loginContinuation();
    }
  }

  function toggleActive(event) {
    var li = $(event.currentTarget).parent();
    li.toggleClass("active");
    self.selectedElement.toggleClass("active");
    self.selectedElement = li;
  }

  self.selectAllCategories = function(data, event) {
    console.log("Selecting all");
    toggleActive(event);
    self.selectedCategory("All");
  }

  self.selectCategory = function(source, event) {
    console.log("Selecting category", source['name']);
    toggleActive(event);
    self.selectedCategory(source['name']);
  }

  self.unselectCategory = function(data, event) {
    console.log("Back to home");
    toggleActive(event);
    self.selectedCategory(undefined);
  }

  self.selectMyEvents = function(data, event) {
    console.log("Showing only my event");
    toggleActive(event);
    self.selectedCategory("My");
  }

  self.showEventDetails = function(what) {
    console.log("Showing event detail for", what);
    self.currentEvent(what);
    $("#eventBox").modal();

    geocoder.geocode(
      {'address': what['place'] + ", London, UK"},
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var loc = results[0].geometry.location;
          loc = new google.maps.LatLng(loc.lat() + 0.001, loc.lng() - 0.001);
          map.setCenter(loc);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
          google.maps.event.trigger(map, 'resize');
        } else {
          console.log("Geocode was unsuccessful: ", status);
        }
      });
  }

  self.attendCurrentEvent = function() {
    self.attendEvent(self.currentEvent());
  }

  self.attendEvent = function(ev) {
    assertLogin(function() { self.attendEvent(ev); });
    console.log("Attending", ev);
    ev.attending(!ev.attending());
  }

  self.showAnnounceEvent = function() {
    assertLogin(function () { self.showAnnounceEvent(); });
    $("#newEventBox").modal();
  }

  self.announceEvent = function() {
    if (self.aeShort().length > 0 &&
        self.aeLong().length > 0 &&
        self.aeDate().length > 0 &&
        self.aePlace().length > 0 &&
        self.aeCategory().length > 0)
    {
      console.log("Announcing a new event");
      self.events.push(
        {'short': self.aeShort(),
         'long': self.aeLong(),
         'date': self.aeDate(),
         'place': self.aePlace(),
         'category': self.aeCategory(),
         'owner': self.username(),
         'attending': ko.observable(false),
         'reviews': [],
        });
      $("#newEventBox").modal("hide");
    }
  }
}

function populateModel() {
  var events = [
    {"category": "Board Games",
     "short": "Let's Scrabble all night, baby",
     "long": "Looking for a scrabble partener!",
     "date": "Today at 2pm",
     "place": "Jessica Rd",
     "owner": "Jessica",
     "attending": ko.observable(false),
    },
    {"category": "Board Games",
     "short": "Vampirology",
     "long": "Looking for six people for a fun game",
     "date": "Friday at 7pm",
     "place": "Quarry Rd",
     "owner": "Ingrid",
     "attending": ko.observable(false),
    },
    {"category": "Board Games",
     "short": "Strategists wanted!",
     "long": "Army veteran officer with 50 yrs experience kicking bottoms looking for equally qualified partenrs for a game of Risk.  Last man standing wins.",
     "date": "Sunday at 4pm",
     "place": "Cicada Rd",
     "owner": "John",
     "attending": ko.observable(false),
    },
    {"category": "Cooking",
     "short": "Let's cook some meat!",
     "long": "Experienced german chef looking for an able body to cook with.  Must be fairly lean with a BMI of no more than 25.",
     "date": "Friday at 6pm",
     "place": "Aspley Rd",
     "owner": "Hans",
     "attending": ko.observable(false),
    },
    {"category": "Cooking",
     "short": "Spicy spicy",
     "long": "I love hot food.  Let's cook someting spicy.",
     "date": "Saturday at 1pm",
     "place": "St. Ann's Crescent",
     "owner": "Laxshmi",
     "attending": ko.observable(false),
    },
    {"category": "Lunch",
     "short": "Lunch by the river",
     "long": "Let's do lunch by the river and talk politics.",
     "date": "Saturday at 12.30am",
     "place": "Tonsley Pl",
     "owner": "Gabrielle",
     "attending": ko.observable(false),
    },
    {"category": "Lunch",
     "short": "Stroll to Tate Modern",
     "long": "Fancy a walk to Tate Modern?",
     "date": "Friday at 2am",
     "place": "Battersea Park",
     "owner": "Alex",
     "attending": ko.observable(false),
    },
    {"category": "Walks",
     "short": "Jack the Ripper",
     "long": "Looking for a group of 4-6 people.  Let's walk in the footsteps of London's most famous killer and swap ghost stories!",
     "date": "Friday at 11pm",
     "place": "Spencer Park",
     "owner": "'Jack'",
     "attending": ko.observable(true),
    },
    {"category": "Walks",
     "short": "Geocachers",
     "long": "Going Geochaching on Saturday.  Looking for a 1-2 people to come along.  We're going to try to find around half a dozen caches hidden around the power station.  Novices and experienced geocachers welcome.",
     "date": "Sunday at 10am",
     "place": "Battersea Power Station",
     "owner": "Alex",
     "attending": ko.observable(false),
    },
  ];

  timearoundModel.ads([
    {"short": "Live well, Work out",
     "long": "Here at the Super Gym you can finally get the body you wanted (and impress all the ladies)."
    },
    {"short": "Fresh fruit. Always.",
     "long": "Authentic farmers selling fresh produce.  Market open every day.  Affordable prices!"
    },
  ]);

  var someReviews = [
    {"positive": true,
     "short": "Excellent!  I haven't had so much fun in ages.",
     "owner": "Paul"},
    {"positive": true,
     "short": "Incredible.  Simply, incredible.",
     "owner": "Shahin"},
    {"positive": true,
     "short": "Words do not exist to describe the sheer awesomeness of this.  It's really a once-in-a-lifetime opportunity.",
     "owner": "Rhea"},
    {"positive": false,
     "short": "Lives on the 5th floor and there's no elevator!",
     "owner": "Caitlin"},
    {"positive": true,
     "short": "I'll definitely come again!",
     "owner": "Masha"},
    {"positive": false,
     "short": "Could've been worse; at least they had tea.",
     "owner": "Corina"},
    {"positive": true,
     "short": "Started off badly, but we ended up playing card games, so all's well that ends well.",
     "owner": "Silvia"},
  ];

  function rand(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  for (var i = 0; i < events.length; i++) {
    events[i].reviews = [];
    var numReviews = rand(1, 6);
    for (var j = 0; j < numReviews; j++) {
      var r = someReviews[rand(0, someReviews.length - 1)];
      if (events[i].reviews.indexOf(r) == -1) {
        events[i].reviews.push(r);
      }
    }
  }

  timearoundModel.events(events);
}

$(function() {
  var map =
    new google.maps.Map(document.getElementById("mapCanvas"),
                        {center: new google.maps.LatLng(-34.397, 150.644),
                         zoom: 16,
                         disableDefaultUI: true,
                         mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
  window.map = map;

  window.geocoder = new google.maps.Geocoder();

  var timearoundModel = new TimearoundModel();
  window.timearoundModel = timearoundModel;
  ko.applyBindings(timearoundModel);

  populateModel();
});
