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

  my.fetch = function(dataset) {
    var dfd = new $.Deferred();

    my.query({
      q : 'love',
      size : 1,
      from : 0
    }, dataset).done(function (data) {
      dfd.resolve({
        fields : data.hits[0] ? _.keys(data.hits[0]) : []
      });
    });

    return dfd;
  },

  my.query = function(query, dataset) {
    var dfd = new $.Deferred();
    var url = dataset.url + '/query';
    var data = {
      rows : query.size,
      start : query.from,
      q : query.q,
      wt : 'json',
      debugQuery : true
    };

    makeRequest({
      url : url,
      data : data,
      dataType : 'jsonp',
      jsonp : 'json.wrf'
    }).done(function (data) {
      var records = data.response.docs;
      var total = data.response.numFound;

      console.log(data);

      dfd.resolve({
        total : total,
        hits : records
      });

    }).fail(function () {
      dfd.reject(arguments);
    });

    return dfd;
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
