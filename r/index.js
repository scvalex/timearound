function TimearoundModel() {
  var self = this;

  self.username = ko.observable("");
  self.isLoggedIn = ko.computed(function() {
    return self.username().length > 0;
  });
  self.enteredUsername = ko.observable("");

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
}

$(function() {
  ko.applyBindings(new TimearoundModel());
});
