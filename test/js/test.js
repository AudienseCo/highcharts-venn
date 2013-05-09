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
                  this.graphic.element.setAttribute('stroke-width', 2);
                  this.graphic.element.setAttribute('stroke', '#00f');
                },
                mouseOut: function () {
                  this.graphic.element.setAttribute('stroke-width', 0);
                }
              }
            }
           }
      },
      series: [{
          type: 'venn',
          data: [
              ['@ivanguardado', +aEl.val()],
              ['@igayoso',       +bEl.val()],
              ['Otro',  +cEl.val()],
              ['@igayoso - @ivanguardado', +abEl.val()],
              ['@igayoso - otro', +bcEl.val()],
              ['@ivanguardado - otro', +acEl.val()]
          ]
      }]
    });
    return false;
  }).trigger('submit');
})
