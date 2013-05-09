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
          venn: { showInLegend: false }
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
