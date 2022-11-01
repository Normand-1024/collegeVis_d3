
// =======================
//  Utility functions
// =======================

function scaleAndCenter(val, minVal, maxVal, ratio) {
    var newLength = (maxVal - minVal) * ratio
    var newMin = minVal + (maxVal - newLength) / 2;
    var newMax = newMin + newLength;
    var scaleFunc = d3.scaleLinear().domain([minVal, maxVal]).range([newMin, newMax]);
    return scaleFunc(val);
}

// =======================
//  BubbleChart variables
// =======================

var bubble_selected = false;
var bubble_filtered = false;
var bubble_selected_circles = []; // For storing selected circle, in format d.category

// =======================
//  BubbleChart functions
// =======================

function updateBubbleChart(UC_MAJORS, tooltip, update) {
    d3.select("#bubble").selectAll('g').selectAll('circle')
        .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .style('fill', function(d) {
            if (bubble_selected && !bubble_selected_circles.includes(d.category))
                return mix_hexes(DEPART_COLORS[d.category], '#000000');
            else {return DEPART_COLORS[d.category];}
        })
        .style('stroke', function(d) {
            if (bubble_selected && bubble_selected_circles.includes(d.category))
                return 'gold';
        })
        .duration(100)
        .ease(d3.easeLinear)
        .style('stroke-width', function(d) {
            if (bubble_selected && bubble_selected_circles.includes(d.category))
                return '10px';
            else {return '0px';}
        });
}

function createBubbleChart(UC_MAJORS, tooltip, update) {

    var viewBoxXMin = 0;
    var viewBoxYMin = 0;
    var viewBoxXMax = innerWidth;
    var viewBoxYMax = innerHeight;
    
    // ========================
    // Creating bubbles and text
    // ========================

    var bubble_svg = d3.select("#bubble");
    const UC_MAJOR_CATEGORIES = d3.group(UC_MAJORS,d=>d.Department);//new Set(UC_MAJORS.map(d => d.Department));
    
    var nodes = Array.from(UC_MAJOR_CATEGORIES).map(d => ({
        r: Math.min(innerWidth, innerHeight) * 0.14,//0.12,
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        category: d[0],
        entries: d[1]
    }));
    //console.log(nodes)
    var uni_bubbles = bubble_svg.selectAll('g')
        .data(nodes)
        .join('g')
        .style('pointer-events', 'all')
        .attr('class', 'uni_bubble')
        .on('mouseover', function(event, d) {
            if (!bubble_selected_circles.includes(d.category)){
                d3.select(this).select('circle')
                    .style('stroke', function(d) {
                        if (!bubble_selected_circles.includes(d.category)){
                            return 'grey';
                        }
                    })
                    .transition()
                    .duration(50)
                    .ease(d3.easeLinear)
                    .style('stroke-width', '5px');
            }

            tooltip.style("left", (event.pageX) + 12 + "px")     
            .style("top", (event.pageY - 28) + "px")
            .transition()        
            .duration(200)      
            .style("opacity", .8)
            
            tooltip.select('text').html(d.category + "<br>" + `Program Count: ${d.entries.length}`);
        })
        .on("mouseout", function(event, d) {
            if (!bubble_selected_circles.includes(d.category)){
                d3.select(this).select('circle')
                    .transition()
                    .duration(100)
                    .ease(d3.easeLinear)
                    .style('stroke-width', '0px');
            }

            tooltip.transition()        
            .duration(500)      
            .style("opacity", 0);   
        })
        .on("click", function(event, d){
            if (bubble_selected_circles.includes(d.category)){
                // Cancelling a selection
                bubble_selected_circles = bubble_selected_circles.filter(e => e !== d.category);

                if (bubble_selected_circles.length <= 0) {bubble_selected = false;}
            }
            else {
                // Adding selection
                bubble_selected_circles = bubble_selected_circles.concat(d.category);
                bubble_selected = true; 
            }

            console.log(bubble_selected_circles);
            console.log(bubble_selected);
            update(EVENT_CODE['bubble_click_update'], [bubble_selected_circles]);
        });
            
    var circles = uni_bubbles.append('circle')
        .style('fill', d => DEPART_COLORS[d.category])
        .style('stroke-width', '0px');;
            
    var texts = uni_bubbles.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .html(d => d.category) // change text
        .style('font-size', d => d.r * 0.2)
        .style('font-family', 'arial')
        .style('text-anchor', 'middle')
        .style('color', 'black')
        .call(wrap, 150) // wrap text (second number is the line length), see utility.js
        .style('-webkit-user-select', 'none') // disable selecting text
        .style('-moz-user-select', 'none')
        .style('-ms-user-select', 'none')
        .style('user-select', 'none')
        .raise(); // text will be drawn above their respective circles

    // ========================
    // Create force simulation
    // ========================

    // Initial variables and functions
    var forceStrength = 0.08 
    var centre = [viewBoxXMax / 2, viewBoxYMax / 2]; // WARNING: this is assuming viewBoxMins are 0
    var centreAxisRatio = 0.7;

    function ticked() {
        circles
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.r);
    
        texts
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .selectAll('tspan')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
    }

    function charge(d) {
        // charge is dependent on size of the bubble, so bigger towards the middle
        // https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a
        return Math.pow(d.radius, 2.0) * 0.01
    }

    // Creating Simulation
    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(charge))
        .force('x', d3.forceX().strength(forceStrength).x( function(d) {
            if (viewBoxXMax - viewBoxXMin > viewBoxYMax - viewBoxYMin){
                return scaleAndCenter(d.x, viewBoxXMin, viewBoxXMax, centreAxisRatio);
            }
            else return centre[0];
            }))
        .force('y', d3.forceY().strength(forceStrength).y( function(d) {
            if (viewBoxXMax - viewBoxXMin < viewBoxYMax - viewBoxYMin){
                return scaleAndCenter(d.y, viewBoxYMin, viewBoxYMax, centreAxisRatio);
            }
            else return centre[1];
            }))
        .force('collision', d3.forceCollide().radius(d => d.r + 1))
        .on('tick', ticked);
}