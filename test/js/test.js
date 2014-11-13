$(function(){
  var aEl = $('#setA'),
      bEl = $('#setB'),
      cEl = $('#setC'),
      abEl = $('#intAB'),
      bcEl = $('#intBC'),
      acEl = $('#intAC');
  $('input').change(function(e){
    $('#chart-form').highcharts({
      title: {
          text: 'Account Comparision'
      },
      tooltip: { enabled: true },
      plotOptions: {
          series: {
            showInLegend: false,
            point: {
              events: {
                mouseOver: function(){
                  this.state = 'hover'; // Hack to work with Highchart v4.0.4
                  this.graphic.attr({
                    'stroke-width': 2,
                    'stroke': '#00f'
                  })
                },
                mouseOut: function () {
                  this.state = ''; // Hack to work with Highchart v4.0.4
                  this.graphic.attr({
                    'stroke-width': 0,
                  })
                }
              }
            }
          }
      },
      series: [{
          type: 'venn',
          data: [
              ['A', +aEl.val()],
              ['B', +bEl.val()],
              ['C', +cEl.val()],
              ['A - B', +abEl.val()],
              ['B - C', +bcEl.val()],
              ['A - C', +acEl.val()]
          ]
      }]
    });
    return false;
  }).trigger('change');
})
