(function ($) {
module("Backend Solr - Wrapper");

test("query", function() {
  var backend = new recline.Backend.Solr.Wrapper('http://localhost:8983/solr');

  var stub = sinon.stub($, 'ajax', function(options) {
  });


  expect(0);

  $.ajax.restore();

});
})(this.jQuery);
