function TimearoundModel() {
  var self = this;

  self.username = ko.observable("");
  self.isLoggedIn = ko.computed(function() {
    return self.username.length > 0;
  });
}

window.addEvent("domready", function() {
  ko.applyBindings(new TimearoundModel());
});
