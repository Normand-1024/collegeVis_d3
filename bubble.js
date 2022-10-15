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
    const bubble_svg = d3.select("#bubble")
    //.attr("transform", `translate(0,${height / 2})`)
    .attr("width", innerWidth / 2)
    .attr("height", innerHeight / 2);

    // bubble_svg.append("rect")
    // .attr("class", "background")
    // .attr("fill", "red")
    // .attr("pointer-events", "all")
    // .attr("width", innerWidth / 2)
    // .attr("height", innerHeight / 2)
    // .attr("cursor", "pointer")

    bubble_svg.selectAll('circle')
        .data(UC_ONLY)
        .join('circle')
            .attr('cx', function (d, i) {return i * 10;})
            .attr('cy', 50)
            .attr('r', 30)
            .style('fill', 'orange');
}