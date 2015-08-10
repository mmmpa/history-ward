(function() {
  var HistoryWard,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  window.HistoryWard = HistoryWard = (function() {
    HistoryWard.PUSHSTATE = 'pushstate';

    HistoryWard.FORWARD = 'popstate:forward';

    HistoryWard.BACKWARD = 'popstate:backword';

    HistoryWard.one = null;

    HistoryWard.start = function(isBrutal) {
      if (HistoryWard.one) {
        return HistoryWard.one;
      }
      return HistoryWard.one = new HistoryWard(isBrutal);
    };

    HistoryWard.startBrutally = function() {
      HistoryWard.start(true);
      History.prototype.pushStatePure = History.prototype.pushState;
      return History.prototype.pushState = function() {
        var args, ref;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (ref = HistoryWard.one).pushState.apply(ref, args);
      };
    };

    function HistoryWard(isBrutal1) {
      this.isBrutal = isBrutal1;
      this.onPopState = bind(this.onPopState, this);
      this.uid = 0;
      this.position = 0;
      window.addEventListener('popstate', this.onPopState);
    }

    HistoryWard.prototype.clean = function(e) {
      return e;
    };

    HistoryWard.prototype.dispatch = function(name, e) {
      return window.dispatchEvent(new e.constructor(name, this.clean(e)));
    };

    HistoryWard.prototype.isBackward = function(e) {
      var ref;
      if (((ref = e.state) != null ? ref.historyWardUID : void 0) == null) {
        return true;
      }
      return e.state.historyWardUID < this.position;
    };

    HistoryWard.prototype.onPopState = function(e) {
      e.preventDefault();
      if (this.isBackward(e)) {
        this.dispatch(HistoryWard.BACKWARD, e);
      } else {
        this.dispatch(HistoryWard.FORWARD, e);
      }
      return this.shift(e);
    };

    HistoryWard.prototype.pushState = function(state, title, url) {
      if (state == null) {
        state = {};
      }
      state.historyWardUID = this.position = this.uid += 1;
      if (this.isBrutal) {
        history.pushStatePure(state, title, url);
      } else {
        history.pushState(state, title, url);
      }
      return window.dispatchEvent(new CustomEvent(HistoryWard.PUSHSTATE, {
        detail: {
          state: state,
          title: title,
          url: url
        }
      }));
    };

    HistoryWard.prototype.resume = function() {
      return window.addEventListener('popstate', this.onPopState);
    };

    HistoryWard.prototype.shift = function(e) {
      var ref;
      return this.position = ((ref = e.state) != null ? ref.historyWardUID : void 0) != null ? e.state.historyWardUID : 0;
    };

    HistoryWard.prototype.stop = function() {
      return window.removeEventListener('popstate', this.onPopState);
    };

    return HistoryWard;

  })();

}).call(this);
