function linkArc(d) {
  const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}

drag = simulation => {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function newFlowChart (container, data, strength) {
	height = data.nodes.length*10;
	width = data.nodes.length*20;
	
	if (height < 500) { height = 500; }
	else if (height > 2500) { height = 2500; }
	if (width < 1000) { width = 1000; }
	if (width > 2500) { width = 2500; }
	
	const links = data.links.map(d => Object.create(d));
	const nodes = data.nodes.map(d => Object.create(d));
	
	
	const types = Array.from(new Set(links.map(d => d.type)));
	//const color = d3.scaleOrdinal(types, d3.schemeCategory10);
	const color = d3.scaleOrdinal(types, Array.from(new Set(links.map(d => d.color))));
	const img = d3.scaleOrdinal(types, Array.from(new Set(links.map(d => d.img))));
	
	/*console.log(types);
	console.log(color);*/
	
	const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(strength))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  const svg = d3.select('#'+container)
	.append('svg') 
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

  // Per-type markers, as they don't inherit styles.
  svg.append("defs").selectAll("marker")
    .data(types)
    .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", color)
      .attr("d", "M0,-5L10,0L0,5");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
      .attr("stroke", d => color(d.type))
      .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = svg.append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
      .call(drag(simulation));
	  
  node.append("circle")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("r", 10)
	  .attr("fill", "#eee");  
  
  node.append("image")
		.data(nodes)
        .attr("xlink:href", d => d.img)
		.attr("x", function(d) {return -5;})
        .attr("y", function(d) {return -5;})
        .attr("height", 10)
        .attr("width", 10);

  node.append("text")
      .attr("x", 8)
      .attr("y", "0.31em")
      .text(d => d.id)
    .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // invalidation.then(() => simulation.stop());

  return svg.node();
}

function updateFlowChart (container, data, strength) {
	var parent = document.getElementById(container).parentElement;
	var child = document.getElementById(container);
	parent.removeChild(child);
	parent.innerHTML = '<div id="data-flow-chart"></div>'; 
	newFlowChart(container, data, strength);
}
	  