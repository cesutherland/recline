this.recline = this.recline || {};
this.recline.Backend = this.recline.Backend || {};
this.recline.Backend.Solr = this.recline.Backend.Solr || {};

(function($, my) {
  my.Wrapper = function(endpoint, options) {
    var self = this;
    this.endpoint = endpoint;
    this.options = _.extend({
        dataType: 'json'
      },
      options);

    this.mapping = function() {
      var schemaUrl = self.endpoint + '/select';
      var jqxhr = makeRequest({
        url: schemaUrl,
        dataType: this.options.dataType
      });
      return jqxhr;
    };

  };

// ### makeReqest
//
// Factory for the xhr in case we ever need to modify its
// construction.
//
// <pre>
// var jqxhr = this._makeRequest({
//   url : the-url
// });
function makeRequest(data) {
  return $.ajax(data);
}

}(jQuery, this.recline.Backend.Solr));
