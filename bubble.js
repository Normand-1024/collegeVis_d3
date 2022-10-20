function easeTransition() {
    return d3.transition()
            .duration(1000);
}

// d3.select("#bubble")
// .transition(easeTransition())
// .delay(500)
// .ease(d3.easeLinear)
// .style("background-color", "red");

function createBubbleChart(UC_ONLY, UNI_COLORS) {
    const bubble_svg = d3.select("#bubble");
    //.attr("transform", `translate(0,${height / 2})`)
                        //.attr("width", width / 2)
                        //.attr("height", height / 2);

    // bubble_svg.append("rect")
    // .attr("class", "background")
    // .attr("fill", "red")
    // .attr("pointer-events", "all")
    // .attr("width", innerWidth / 2)
    // .attr("height", innerHeight / 2)
    // .attr("cursor", "pointer")

    var uni_bubbles = bubble_svg.selectAll('g')
        .data(UC_ONLY)
        .join('g')
        .attr('class', 'uni_bubble');
            
    var circles = uni_bubbles.append('circle')
        .attr('cx', function (d, i) {return 40 + i * 50;})
        .attr('cy', function (d, i) {return 40 + i * 50;})
        .attr('r', 150)
        .style('fill', d => UNI_COLORS[d['institution']]);
            
    var texts = uni_bubbles.append('text')
        .attr('x', function (d, i) {return 40 + i * 50;})
        .attr('y', function (d, i) {return 40 + 10 + i * 50;})
        .html(d => d['institution']) // change text
        .style('font-size', 30)
        .style('text-anchor', 'middle')
        .style('color', 'black')
        .call(wrap, 150) // wrap text (second number is the line length), see utility.js
        .style('-webkit-user-select', 'none') // disable selecting text
        .style('-moz-user-select', 'none')
        .style('-ms-user-select', 'none')
        .style('user-select', 'none')
        .raise(); // text will be drawn above their respective circles


    // Create forces simulation
    // const forceStrength = 0.03; 
    // const simulation = d3.forceSimulation()
    //     .force('charge', d3.forceManyBody().strength(charge))
    //     .force('x', d3.forceX().strength(forceStrength).x(centre.x))
    //     .force('y', d3.forceY().strength(forceStrength).y(centre.y))
    //     .force('collision', d3.forceCollide().radius(d => d.radius + 1));

    // // Define tick of simulation
    // simulation.on('tick', () => {
    //     circle
    //         .attr('cx', d => d.x)
    //         .attr('cy', d => d.y)
    // })

    // simulation.restart();

    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    //simulation.stop();
}