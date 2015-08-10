(function() {
  var display, i, len, node, ref, write;

  HistoryWard.startBrutally();

  window.addEventListener(HistoryWard.PUSHSTATE, function(e) {
    console.log(e);
    return display.innerHTML = 'pushState: ' + write(e.detail);
  });

  window.addEventListener(HistoryWard.BACKWARD, function(e) {
    console.log(e);
    return display.innerHTML = 'backward: ' + write(e.state);
  });

  window.addEventListener(HistoryWard.FORWARD, function(e) {
    console.log(e);
    return display.innerHTML = 'forward: ' + write(e.state);
  });

  ref = document.querySelectorAll('a');
  for (i = 0, len = ref.length; i < len; i++) {
    node = ref[i];
    node.addEventListener('click', function(e) {
      var a;
      a = e.target;
      e.preventDefault();
      return history.pushState({
        param: a.innerHTML
      }, 'title', a.href);
    });
  }

  write = function(obj) {
    var key, value;
    return ((function() {
      var results;
      results = [];
      for (key in obj) {
        value = obj[key];
        results.push([key, value].join(' = '));
      }
      return results;
    })()).join(', ');
  };

  display = document.querySelector('#state');

}).call(this);
