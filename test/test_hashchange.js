QUnit.asyncTest('update window.location.hash', function(assert) {
  var onhashchange = null,
      wait_time = 14; // a reasonable wait time

  expect(1);

  // first reset hash in case we are re-running test
  // this can be removed without affecting test results
  // as long as you load the page fresh
  window.location.hash = '';

  setTimeout(function() {
    window.addEventListener('hashchange', function(e) {
      onhashchange = e;
    }, false);

    window.location.hash = "#/path";

    // allow onhashchange to fire
    setTimeout(function() {
      assert.ok(onhashchange != null, "hashchange event was not fired!"); 
      QUnit.start();
    }, wait_time);
  }, wait_time);
});
