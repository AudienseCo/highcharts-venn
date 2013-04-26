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

  cA: {x: null, y: null},
  cB: {x: null, y: null},
  cC: {x: null, y: null},

  //Here we have to calculate all shapes and append them to this.data
  translate: function(){
    var chart = this.chart,
        plotWidth = chart.plotWidth,
        plotHeight = chart.plotHeight,
        followAB = this.options.intersections[0],
        followBC = this.options.intersections[1],
        followAC = this.options.intersections[2] || null,
        followA = this.options.data[0][1],
        followB = this.options.data[1][1],
        followC = this.options.data[2][1] || null;

    var percentageSize=this.sizeContainer(plotWidth, plotHeight); 
    var scale = this.createScale(percentageSize);
    var rA = this.rA = scale(followA/5000);
    var rB = this.rB = scale(followB/5000);
    var rC = this.rC = scale(followC/5000);
    var ab = this.ab = scale(followAB/5000);
    var ac = this.ac = scale(followAC/5000);
    var cb = this.cb = scale(followBC/5000);

    this.cB = {x: this.cA.x+rA+rB-2*ab, y: this.cA.y}; //we set cA in sizeContainer function

    this.calculateC();

    this.calculateIntersections();
    this.data = [
      {
        shapeType: 'circle',
        shapeArgs: {
          x: this.cA.x,
          y: this.cA.y,
          r: rA,
          fill: 'red'
        },
        options: {}
      },{
        shapeType: 'circle',
        shapeArgs: {
          x: this.cB.x,
          y: this.cB.y,
          r: rB,
          fill: 'blue'
        },
        options: {}
      },{
        shapeType: 'circle',
        shapeArgs: {
          x: this.cC.x,
          y: this.cC.y,
          r: rC,
          fill: 'orange'
        },
        options: {}
      }
    ];
    // each(this.data, function(point){
    //   point.shapeType = 'circle';
    //   point.shapeArgs = {
    //     x: point.x,
    //     y: point.y,
    //     r: point.y,
    //     fill: point.color
    //   }
    // });
  },

  calculateC: function(){
    var rAC = this.rAC,
        rC = this.rC,
        rA = this.rA,
        ac = this.ac,
        rCB = this.rCB,
        rB = this.rB,
        cb = this.cb,
        cA = this.cA,
        cB = this.cB;
    if(rC!=null){
      rAC = rA+rC-ac*2;
      rCB = rB+rC-cb*2;
      var intsec = this.intersection(cA.x, cA.y, rAC, cB.x, cB.y, rCB);
      console.log("intsec"+intsec);
      
      if(isNaN(intsec[1])){
          
          intsec[3]=cA.y;
          intsec[1]=cA.x+rAC;
          
      }
      this.cC = {x: intsec[1], y: intsec[3]};

    }
  },

  calculateIntersections: function(){
    var rAC = this.rAC,
        rC = this.rC,
        rA = this.rA,
        ac = this.ac,
        rCB = this.rCB,
        rB = this.rB,
        cb = this.cb,
        ab = this.ab,
        cA = this.cA,
        cB = this.cB,
        cC = this.cC;
    var intsec;
    if(ab!=null){
      //INTERSECTION OF A CIRCLE AND B CIRCLE
      intsec=this.intersection(cA.x, cA.y, rA, cB.x, cB.y, rB);
      this.ABinter={x0: intsec[1], y0: intsec[3], x1: intsec[0], y1: intsec[2]};
    }

    if(ac!=null){
      //INTERSECTION OF A CIRCLE AND C CIRCLE
      intsec=this.intersection(cA.x, cA.y, rA, cC.x, cC.y, rC);
      this.ACinter={x0: intsec[1], y0: intsec[3], x1: intsec[0], y1: intsec[2]};
    }

    if(cb!=null){
      //INTERSECTION OF B CIRCLE AND C CIRCLE
      intsec=this.intersection(cB.x, cB.y, rB, cC.x, cC.y, rC);
      this.BCinter={x0: intsec[1], y0: intsec[3], x1: intsec[0], y1: intsec[2]};
    }

    if((ac!=null) && (cb>0 || cb!=null)){
      //INTERSECTION ABC
      this.ABCinter={x0:this.ABinter.x0, y0:this.ABinter.y0, x1:this.ACinter.x1, y1:this.ACinter.y1, x2:this.BCinter.x0, y2:this.BCinter.y0};
      
    }
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
  },

  sizeContainer: function(width, height){ 
    this.cA.x=(width*0.40);
    this.cA.y=(height*0.60);
    return width/5;
  },

  //scale of circles    
  createScale: function(max){
    var maxArea = Math.pow(max,2)*Math.PI;
    return function scale(n){
      
      if(n>100)
        n=100;
            
      return Math.sqrt(((n*maxArea)/100)/Math.PI);
    } 
  },

  lineInterAC: function(){
    var puntoInterAC={x:ACinter.x0, y:ACinter.y0}; //el punto que se encuentra en mitad de la interseccion
    var flag=0;
    var distancia=Math.sqrt(Math.pow(ACinter.x0-ACinter.x1,2)+Math.pow(ACinter.y0-ACinter.y1,2));
    var pendiente=(ACinter.y1-ACinter.y0)/(ACinter.x1-ACinter.x0);
    var intercepto=ACinter.y0-(pendiente*ACinter.x0); 
   
    mitad=(ACinter.x1-ACinter.x0)/2; //la mitad de la linea de intercepcion
   
   puntoInterAC.x=ACinter.x0+mitad;
   puntoInterAC.y=(pendiente)*(puntoInterAC.x)+intercepto;
   
    if(puntoInterAC.x>cC.x && puntoInterAC.y<cC.y){
      flag=1; 
    }
    return flag;
    /*    
        renderer.circle(ACinter.x0, ACinter.y0, 2, 2).attr({
        fill: 'red',
     
        'stroke-width': 1
    }).add(); 
        
        renderer.circle(ACinter.x0+mitad,  puntoInterAC.y, 2, 2).attr({
        fill: 'green',
     
        'stroke-width': 1
    }).add();

    renderer.circle(cC.x,  cC.y, 2, 2).attr({
        fill: 'black',
     
        'stroke-width': 1
    }).add();

    */ 
  },
  lineInterBC: function(){
    var puntoInterBC={x:BCinter.x0, y:BCinter.y0}; //el punto que se encuentra en mitad de la interseccion
    var flag=0;
    renderer.circle(BCinter.x0, BCinter.y0, 2, 2).attr({
        fill: 'red',
     
        'stroke-width': 1
    }).add(); 
    var pendiente=(BCinter.y1-BCinter.y0)/(BCinter.x1-BCinter.x0);
    var intercepto=BCinter.y0-(pendiente*BCinter.x0); 
   
    mitad=(BCinter.x1-BCinter.x0)/2; //la mitad de la linea de intercepcion
   
   puntoInterBC.x=BCinter.x0+mitad;
   puntoInterBC.y=(pendiente)*(puntoInterBC.x)+intercepto;
   
    if(puntoInterBC.x<cC.x){
      flag=1;      
    }
    
    return flag; 
  },

  interABC: function(){
    flag=true;
    var distancia=Math.sqrt(Math.pow(cC.x-ABinter.x0,2)+Math.pow(cC.y-ABinter.y0,2));
    
    console.log('distancia'+distancia);
    if(distancia>rC || followABC==0 ){
      flag=false;
    }
    console.log(flag);
    return flag;
  },

  intersection: function(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2, i=0;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));
    while(i<0){ //TODO

      /* Check for solvability. */
      if (!( d > (r0 + r1) || d < Math.abs(r0-r1))) {
          /* no solution. circles do not intersect. */
          /* no solution. one circle is contained in the other */
          // return false;
          break;
      }
      d++;
      
      i++;
    }
    if(i===5) return false;

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0*r0) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
  }

});

}(Highcharts));