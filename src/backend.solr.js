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
    var url = dataset.url + '/select';
    var data = makeQueryString(query);

    makeRequest({
      url : url,
      data : data,
      dataType : 'jsonp',
      jsonp : 'json.wrf'
    }).done(function (data) {
      var records = data.response.docs;
      var total = data.response.numFound;
      var facets = getFacets(data);

      dfd.resolve({
        total : total,
        hits : records,
        facets : facets
      });

    }).fail(function () {
      dfd.reject(arguments);
    });

    return dfd;
  };
// ### getFacets
function getFacets(data) {
  var facets = {};
  var out = {};

  if (data.facet_counts) {
    facets = data.facet_counts.facet_fields;
  }

  // Process facets:
  _.each(facets, function (counts, facet) {

    // Process terms;
    var term = null;
    var terms = [];
    _.each(counts, function (value) {
      if (!term) {
        term = value;
      } else {
        out[facet]
        terms.push({
          "term": term,
          "count": value
        });
        term = null;
      }
    });

    out[facet] = {
      terms : terms
    };
  });

  return out;
}

// ### makeQueryString
function makeQueryString(query) {
  var data = [];

  data.push('q=' + encodeURIComponent(query.q));
  data.push('rows=' + encodeURIComponent(query.size));
  data.push('start=' + encodeURIComponent(query.from));
  data.push('wt=json');
  data.push('debugQuery=true');
  data.push('defType=edismax');

  if (query.facets) {
    data.push('facet=true');
    data.push('facet.limit=-1');
    data.push('facet.zeros=false');
    _.each(query.facets, function (facet) {
      data.push('facet.field=' + encodeURIComponent(facet));
    });
  }

  return data.join('&');
}

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
