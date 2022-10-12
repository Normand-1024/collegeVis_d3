function easeTransition() {
    return d3.transition()
            .duration(1000);
}

function createRandomStuff() {
    const svg = d3.select("svg")
    //.attr("transform", `translate(0,${height / 2})`)
    .attr("width", innerWidth / 2)
    .attr("height", innerHeight / 2);

    svg.append("rect")
    .attr("class", "background")
    .attr("fill", "red")
    .attr("pointer-events", "all")
    .attr("width", innerWidth / 2)
    .attr("height", innerHeight / 2)
    .attr("cursor", "pointer")
}