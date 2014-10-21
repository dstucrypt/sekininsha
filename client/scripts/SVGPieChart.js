
/** @jsx React.DOM */
'use strict';
var React = require('react/addons');

var SVGPieChart = React.createClass({
	propTypes: {
		radius: React.PropTypes.number,
		border: React.PropTypes.number,
		stats: React.PropTypes.arrayOf(React.PropTypes.number),
		colors: React.PropTypes.arrayOf(React.PropTypes.string)
	},
    getDefaultProps: function() {
        return {
        	radius:120,
        	border:3
        }
    },
    render: function (){
            var stats = this.props.stats;

            var graphR = this.props.radius - this.props.border;

            if (stats === undefined) return <circle fill="white" r={this.props.radius} cx={this.props.radius} cy={this.props.radius} />

            var sectors = stats;

            var colors = this.props.colors ? this.props.colors : ["red", "orange", "yellow", "green", "navy", "blue", "purple", "pink"];


            var newSectors = [];
            var newColors = [];
            for (var i = 0; i < sectors.length; i ++) {
                if (sectors[i] !== 0) {
                    newSectors.push(sectors[i]);
                    newColors.push(colors[i]);
                }
            }

            if (newSectors.length === 1) return <circle fill={newColors[0]} r={graphR} cx={this.props.radius} cy={this.props.radius} />

            sectors = newSectors;
            colors = newColors;

            var paths = [];
            var total = 0,
                col = 0,
                seg = 0,
                radius = graphR,
                startx = this.props.radius,  //The screen x-origin: center of pie chart
                starty = this.props.radius,   //The screen y-origin: center of pie chart
                lastx = radius, //Starting coordinates of 
                lasty = 0;      //the first arc

            
            for (var i = 0; i < sectors.length; i++) {
                total += sectors[i];
            }
            for (var i = 0; i < sectors.length; i++) {
                var n = sectors[i];
                var key = "pie_"+i;
                var arc = "0";                  // default is to draw short arc (< 180 degrees)
                seg = n/total * 360 + seg;      // this angle will be current plus all previous
                if ((n/total * 360) > 180) {
                    arc = "1"               // just in case this piece is > 180 degrees
                }
                var radseg = seg * Math.PI / 180;  // we need to convert to radians for cosine, sine functions
                var nextx = Math.round(Math.cos(radseg) * radius);
                var nexty = Math.round(Math.sin(radseg) * radius);
                var d = 'M ' + startx + ',' + starty + ' l ' + lastx + ',' + (-lasty) + ' a' + radius + ',' + radius + ' 0 ' + arc + ',0 ' + (nextx - lastx) + ',' + (-(nexty - lasty)) + ' z';
                var path = <path d={d} fill={colors[col]} key={key} />;
                paths.push(path);
                lastx = nextx;
                lasty = nexty;
                col++;
            }
            return <svg width={this.props.radius*2} height={this.props.radius*2} xmlns="http://www.w3.org/2000/svg" version="1.1">
                                <circle fill="#ddd" r={this.props.radius} cx={this.props.radius} cy={this.props.radius} />
                                {paths}
                            </svg>;
        }
})

module.exports = SVGPieChart;