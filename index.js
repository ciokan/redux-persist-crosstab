"use strict";

var _constants = require("redux-persist/lib/constants");

var _types = require("redux-persist/es/types");

var _redux = require("redux");

module.exports = function (store, persistConfig) {
  var crosstabConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var blacklist = crosstabConfig.blacklist || null;
  var whitelist = crosstabConfig.whitelist || null;
  var keyPrefix = crosstabConfig.keyPrefix || _constants.KEY_PREFIX;
  var key = persistConfig.key;
  window.addEventListener('storage', handleStorageEvent, false);

  function handleStorageEvent(e) {
    if (e.key && e.key.indexOf(keyPrefix) === 0) {
      if (e.oldValue === e.newValue) {
        return;
      }

      var statePartial = JSON.parse(e.newValue);
      var state = Object.keys(statePartial).reduce(function (state, reducerKey) {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return state;
        }

        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return state;
        }

        state[reducerKey] = JSON.parse(statePartial[reducerKey]);
        return state;
      }, {});
      store.dispatch({
        key: key,
        payload: state,
        type: _constants.REHYDRATE
      });
    }
  }
};
