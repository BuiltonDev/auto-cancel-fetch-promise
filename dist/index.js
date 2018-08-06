'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var fetchQueries = {};
var AbortController = window.AbortController;

function smartFetch(componentName) {
  var controller = new AbortController();
  if (!fetchQueries[componentName]) {
    fetchQueries[componentName] = [];
  }
  fetchQueries[componentName].push(controller);

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args[1] = args[1] ? args[1] : {};
  args[1].signal = controller.signal;
  return fetch.apply(undefined, args);
}

function abortFetches(componentName) {
  if (fetchQueries[componentName]) {
    fetchQueries[componentName].forEach(function (controller) {
      controller.abort();
    });
    fetchQueries[componentName] = undefined;
  }
}

var promises = {};

var makeCancelable = function makeCancelable(promise) {
  var cancelError = new Error('Promise has been canceled');
  cancelError.type = 'promiseCanceled';

  var rejectFn = void 0;
  var wrappedPromise = new Promise(function (resolve, reject) {
    rejectFn = reject;
    promise.then(resolve, reject);
  });

  return {
    promise: wrappedPromise,
    cancel: function cancel() {
      rejectFn(cancelError);
    }
  };
};

function smartPromise(componentName, promise) {
  if (!promises[componentName]) {
    promises[componentName] = [];
  }
  var newPromise = makeCancelable(promise);
  promises[componentName].push(newPromise);
  return newPromise.promise;
}

function abortPromises(componentName) {
  if (promises[componentName]) {
    promises[componentName].forEach(function (p) {
      p.cancel();
    });
    promises[componentName] = undefined;
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var index = (function (WrappedComponent) {
  var HOC = function (_React$Component) {
    inherits(HOC, _React$Component);

    function HOC(props) {
      classCallCheck(this, HOC);

      var _this = possibleConstructorReturn(this, (HOC.__proto__ || Object.getPrototypeOf(HOC)).call(this, props));

      _this.name = WrappedComponent.name;
      _this.fetch = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return smartFetch.apply(undefined, [_this.name].concat(args));
      };
      _this.promiseWrapper = function (promise) {
        return smartPromise(_this.name, promise);
      };
      return _this;
    }

    createClass(HOC, [{
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        abortFetches(this.name);
        abortPromises(this.name);
      }
    }, {
      key: "render",
      value: function render() {
        return React.createElement(WrappedComponent, _extends({}, this.props, { fetch: this.fetch, promiseWrapper: this.promiseWrapper }));
      }
    }]);
    return HOC;
  }(React.Component);

  return HOC;
});

module.exports = index;
//# sourceMappingURL=index.js.map
