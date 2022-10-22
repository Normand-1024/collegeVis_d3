function createMap(tooltip) {

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

            
    // Define linear scale for output
    // var color = d3.scale.linear()
    //             .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

    // var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

    // Load in my states data!
    d3.csv("./misc/stateslived.csv").then(function(data) {
        // color.domain([0,1,2,3]); // setting the range of the input data

        // Load GeoJSON data and merge with states data
        d3.json("./us-states.json").then(function(json) {
            // Loop through each state data value in the .csv file
            for (var i = 0; i < data.length; i++) {
                

                // Grab State Name
                var dataState = data[i].state;

                // Grab data value 
                var dataValue = data[i].visited;

                // Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++)  {
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.visited = dataValue; 

                    // Stop looking through the JSON
                    break;
                    }
                }
            }
            
            // Bind the data to the SVG and create one path per GeoJSON feature

            svg.selectAll("path")
                .data(json.features)
                .join("path")
                //.enter()
                //.append("path")
                .attr("d", path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .style("fill", "rgb(79, 218, 206)"); //rgb(213,222,217)
            //     .style("fill", function(d) {

            //     // Get data value
            //     var value = d.properties.visited;

            //     if (value) {
            //     //If value exists…
            //     return color(value);
            //     } else {
            //     //If value is undefined…
            //     return "rgb(213,222,217)";
            //     }
            // });

                    
            // Map the cities I have lived in!
            d3.csv("UC-ONLY-data.csv").then(function(data) {

                svg.selectAll("circle")
                    .data(data)
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
                        return d.size * 7.0;
                    })
                    .style('pointer-events', 'all')
                        // .style("fill", "rgb(217,91,67)")	
                        // .style("opacity", 0.85)	

                    // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
                    // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                    .on("mouseover", function(event, d) { 
                        var currentName = JSON.stringify(d.institution);
                        tooltip.style("left", (event.pageX) + 12 + "px")     
                        .style("top", (event.pageY - 28) + "px")
                        .transition()        
                        .duration(200)      
                        .style("opacity", .8)
                        // div.text(d.institution + " " + d.city + ", " + d.state + "<br> <br />" + d.website)
                        // .attr("data-html", "true")
                        //.style("width", 12.5 + "em")
                        //.style("height", 3.2 + "em")
                        // Using adjustable tooltip height based on the amount of characters in text
                        // .style("height", function(d) { 
                        //     if (currentName.length < 20) {
                        //         return 100;
                        //     } else if (currentName.length >= 20 && currentName.length < 30) {
                        //         return 130;
                        //     } else {
                        //         return 150;
                        //     }
                        // });

                        tooltip.select('text').html(d.institution + "<br>" + d.city + ", " + d.state + "<br>" + d.website);
                    })   

                    // fade out tooltip on mouse out               
                    .on("mouseout", function(d) {       
                        tooltip.transition()        
                        .duration(500)      
                        .style("opacity", 0);   
                    });
            });  

            // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
            // var legend = d3.select("body").append("svg")
            //                 .attr("class", "legend")
            //                 .attr("width", 250)
            //                 .attr("height", 160)
            //                 .selectAll("g")
            //                 // .data(color.domain().slice().reverse())
            //                 .enter()
            //                 .append("g")
            //                 .attr("transform", function(d, i) { return "translate(0," + i * 42 + ")"; });

            //     legend.append("rect")
            //         .attr("width", 28)
            //         .attr("height", 28)
            //         .style("fill", color);

            //     legend.append("text")
            //         .data(legendText)
            //         .attr("x", 44)
            //         .attr("y", 15)
            //         .attr("dy", ".35em")
            //         .style("font-size", 1.5 +"em")
            //         .text(function(d) { return d; });

        });

    });

}