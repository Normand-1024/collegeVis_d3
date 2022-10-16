
// https://bl.ocks.org/guypursey/f47d8cd11a8ff24854305505dbbd8c07
// modified at the end so the text is centered around the center point, instead of being pushed down
function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", "0em")
      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(" "))
          line = [word]
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", `${++lineNumber * lineHeight}em`).text(word)
        }
      }
      var offset_value = lineNumber / 2 * lineHeight;
      text.selectAll("tspan").attr("dy", function(){return `${parseFloat(this.getAttribute("dy"))-offset_value}em`;})
    })
  }