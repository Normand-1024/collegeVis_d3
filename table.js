
function createTable() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const table_svg = d3.select("#table")
        .attr("transform", `translate(0,${height / 2})`)
        .attr("width", width)
        .attr("height", height / 2);
}