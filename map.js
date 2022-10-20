// Modified code from Michelle Chandra's 'Basic US State Map - D3' | https://gist.github.com/michellechandra/0b2ce4923dc9b5809922

function createMap() {
    var width = window.innerWidth/2; //1500;
    var height = window.innerHeight/2; //900;

    // Will add resize listener later.
    // console.log("hi, we're in createMap")

    // D3 Projection
    var projection = d3.geoAlbersUsa()
                    .translate([width/2 + 40, height/2 + 20])    // translate to center of screen
                    .scale([800]);          // scale things down so see entire US
            
    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                .projection(projection);  // tell path generator to use albersUsa projection

            
    // Define linear scale for output
    // var color = d3.scale.linear()
    //             .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

    // var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

    //Create SVG element and append map to the SVG
    var svg = d3.select("#map")
                .append("svg")
                // .attr("width", width)
                // .attr("height", height);
            
    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

    var divtext = div.append('text');

    // Load in my states data!
    console.log("here1");
    d3.csv("./misc/stateslived.csv").then(function(data) {
        // color.domain([0,1,2,3]); // setting the range of the input data

    // Load GeoJSON data and merge with states data
        d3.json("./us-states.json").then(function(json) {
            console.log("here3");
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

            console.log("here2");
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
    d3.csv("UC-ONLY-data.csv", function(data) {

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
            return d.size * 1.2;
        })
            // .style("fill", "rgb(217,91,67)")	
            // .style("opacity", 0.85)	

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", function(d) { 
            var currentName = JSON.stringify(d.institution); 
            div.transition()        
            .duration(200)      
            .style("opacity", .8);  
            // div.text(d.institution + " " + d.city + ", " + d.state + "<br> <br />" + d.website)
            // // .attr("data-html", "true")
            // .style("left", (d3.event.pageX) + 12 + "px")     
            // .style("top", (d3.event.pageY - 28) + "px")
            // .style("width", 12.5 + "em")
            // // .style("height", 3.2 + "em");
            // // Using adjustable tooltip height based on the amount of characters in text
            // .style("height", function(d) { 
            //     if (currentName.length < 20) {
            //         return 100;
            //     } else if (currentName.length >= 20 && currentName.length < 30) {
            //         return 130;
            //     } else {
            //         return 150;
            //     }
            // });

            divtext.html(d.institution + "<br>" + d.city + ", " + d.state + "<br>" + d.website);
        })   

        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
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