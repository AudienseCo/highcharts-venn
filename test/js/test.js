$(function(){
  var aEl = $('#setA'),
      bEl = $('#setB'),
      cEl = $('#setC'),
      abEl = $('#intAB'),
      bcEl = $('#intBC'),
      acEl = $('#intAC');
  $('#form').submit(function(e){
    $('#chart-form').highcharts({
      title: {
          text: 'Browser market shares at a specific website, 2010'
      },
      plotOptions: {
          venn: { showInLegend: true }
      },
      series: [{
          type: 'venn',
          data: [
              ['Firefox',   +aEl.val()],
              ['IE',       +bEl.val()],
              ['Chrome',  +cEl.val()]
          ],
          intersections: [+abEl.val(), +bcEl.val(), +acEl.val()]
      }]
    });
    return false;
  }).trigger('submit');
})