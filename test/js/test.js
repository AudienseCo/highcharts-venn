$(function(){
  var aEl = $('#setA'),
      bEl = $('#setB'),
      cEl = $('#setC');
  $('#form').submit(function(e){
    console.log(aEl.val(), bEl.val(), cEl.val())
    $('#chart-form').highcharts({
      chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser market shares at a specific website, 2010'
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage}%</b>',
              percentageDecimals: 1
            },
            plotOptions: {
                venn: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    }
                    ,showInLegend: true

                }
            },
            series: [{
                type: 'venn',
                name: 'Browser share',
                data: [
                    ['Firefox',   +aEl.val()],
                    ['IE',       +bEl.val()],
                    ['Chrome',  +cEl.val()]
                ],
                intersections: [10, 10, 10]
            }]
    });
    return false;
  }).trigger('submit');
})