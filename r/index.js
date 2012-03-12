function TimearoundModel() {
  var self = this;

  self.username = ko.observable("");
  self.isLoggedIn = ko.computed(function() {
    return self.username().length > 0;
  });
  self.enteredUsername = ko.observable("");
  self.events = ko.observable([]);
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
    for (var i = 0; i < evs.length; i++) {
      if (evs[i]['category'] == cat) {
        selEvs.push(evs[i]);
      }
    }
    return selEvs;
  });

  self.showLogin = function() {
    $("#loginBox").modal();
  }

  self.doLogin = function() {
    console.log("Logging in as", self.enteredUsername());

    if (self.enteredUsername().length > 0) {
      $("#loginBox").modal("hide");
      self.username(self.enteredUsername());
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
}

function populateModel() {
  timearoundModel.events([
    {"category": "Board Games",
     "short": "Let's Scrabble all night, baby",
     "long": "Looking for a scrabble partener!",
    },
    {"category": "Board Games",
     "short": "Vampirology",
     "long": "Looking for six people for a fun game",
    },
    {"category": "Board Games",
     "short": "Strategists wanted!",
     "long": "Army veteran officer with 50 yrs experience kicking bottoms looking for equally qualified partenrs for a game of Risk.  Last man standing wins.",
    },
    {"category": "Cooking",
     "short": "Let's cook some meat!",
     "long": "Experienced german chef looking for an able body to cook with.  Must be fairly lean with a BMI of no more than 25.",
    },
    {"category": "Cooking",
     "short": "Spicy spicy",
     "long": "I love hot food.  Let's cook someting spicy.",
    },
    {"category": "Lunch",
     "short": "Lunch by the river",
     "long": "Let's do lunch by the river and talk politics.",
    },
    {"category": "Walks",
     "short": "Jack the Ripper",
     "long": "Looking for a group of 4-6 people.  Let's walk in the footsteps of London's most famous killer and swap ghost stories!",
    },
    {"category": "Walks",
     "short": "Geocachers",
     "long": "Going Geochaching on Saturday.  Looking for a 1-2 people to come along.  We're going to try to find around half a dozen caches hidden around the power station.  Novices and experienced geocachers welcome.",
    },
  ]);
}

$(function() {
  var timearoundModel = new TimearoundModel();
  window.timearoundModel = timearoundModel;
  ko.applyBindings(timearoundModel);

  populateModel();
});
