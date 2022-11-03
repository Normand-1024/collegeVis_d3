function createMap(UC_ONLY, US_STATES, tooltip) {

    // Will add resize listener later.
    // console.log("hi, we're in createMap")
    
    //Create SVG element and append map to the SVG
    var svg = d3.select("#map");

    // D3 Projection
    var projection = d3.geoAlbersUsa()
                    .translate([innerWidth/2 + 1000, innerHeight/2])    // translate to center of screen
                    .scale([4000]);          // scale things down so see entire US
            
    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                .projection(projection);  // tell path generator to use albersUsa projection

    // Load GeoJSON data and merge with states data
    for (var i = 0; i < data.length; i++) {
        

        // Grab State Name
        var dataState = data[i].state;

        // Grab data value 
        var dataValue = data[i].visited;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < US_STATES.features.length; j++)  {
            var jsonState = US_STATES.features[j].properties.name;

            if (dataState == jsonState) {

            // Copy the data value into the JSON
            US_STATES.features[j].properties.visited = dataValue; 

            // Stop looking through the JSON
            break;
            }
        }
    }
    
    // Bind the data to the SVG and create one path per GeoJSON feature

    svg.selectAll("path")
        .data(US_STATES.features)
        .join("path")
        //.enter()
        //.append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", "rgb(79, 218, 206)"); //rgb(213,222,217)

    // Using the UC_ONLY data passed from index.html to label each campus location.

    svg.selectAll("circle")
        .data(UC_ONLY)
        .enter()
        .append("circle")
        .attr("class","cities")
        .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
            // return d.size * 7.0;
            return 15;
        })
        .style('pointer-events', 'all')

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", function(event, d) { 
            var currentName = JSON.stringify(d.institution);
            tooltip.style("left", (event.pageX) + 12 + "px")     
            .style("top", (event.pageY - 28) + "px")
            .transition()        
            .duration(200)      
            .style("opacity", .8)
            tooltip.select('text').html(d.institution + "<br />" + d.city + ", " + d.state + "<br />" + d.website);
        })   

        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            tooltip.transition()        
            .duration(500)      
            .style("opacity", 0);   
        });
}