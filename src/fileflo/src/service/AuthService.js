module.exports = {
  // Retrieve the user object from the session storage
  getUser: function () {
    const user = sessionStorage.getItem('user');
    if (user === 'undefined' || !user) {
      return null;
    } else {
      return JSON.parse(user);
    }
  },

  // Retrieve the token from the session storage
  getToken: function () {
    return sessionStorage.getItem('token');
  },

  // Set the user object and token in the session storage
  setUserSession: function (user, token) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
  },

  // Remove the user object and token from the session storage
  resetUserSession: function () {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  },
};
