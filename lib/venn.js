(function (Highcharts){

'use strict';
var defaultOptions = Highcharts.getOptions(),
  defaultPlotOptions = defaultOptions.plotOptions,
  seriesTypes = Highcharts.seriesTypes,
  merge = Highcharts.merge,
  noop = function () {},
  each = Highcharts.each;

defaultPlotOptions.venn = merge(defaultPlotOptions.pie, {
  borderWidth: 0
});

seriesTypes.venn = Highcharts.extendClass(Highcharts.Series, {
  type: 'venn',
  isCartesian: false,
  pointClass: Highcharts.seriesTypes.pie.prototype.pointClass,
  trackerGroups: ['group'],
  animate: noop,
  getSymbol: noop,
  getCenter: noop,
  drawGraph: noop,
  getColor: noop,
  drawTracker: seriesTypes.column.prototype.drawTracker,
  drawLegendSymbol: seriesTypes.pie.prototype.drawLegendSymbol,
  setData: seriesTypes.pie.prototype.setData,
  //Here we have to calculate all shapes and append them to this.data
  translate: function(){
    var chart = this.chart,
        plotWidth = chart.plotWidth,
        plotHeight = chart.plotHeight;

    each(this.data, function(point){
      point.shapeType = 'circle';
      point.shapeArgs = {
        x: point.x,
        y: point.y,
        r: point.y,
        fill: point.color
      }
    });
  },

  //Draw the points defined in translate method
  drawPoints: function(){
    var renderer = this.chart.renderer;
    var series = this;
    each(this.data, function (point) {
      var graphic = point.graphic,
        shapeArgs = point.shapeArgs;
      if(graphic){
        graphic.attr({ // Since the marker group isn't clipped, each individual marker must be toggled
          visibility: point.options.visibility===false? 'hidden' : 'visible'
        })
      }else{
        point.graphic = renderer.circle(shapeArgs).add(series.group);
      }
      if(point.options.visible === false) point.setVisible(false);
      
      
    });
  }
});

}(Highcharts));