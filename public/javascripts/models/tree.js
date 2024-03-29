define(['d3'], function(d3) {
    function Tree(url, svgOptions) {
        this.url = url;
        this.svgOptions = svgOptions;
        this.i = 0;
        this.root;

        this.tree = d3.layout.tree()
            .size([this.svgOptions.height,this.svgOptions.width]);

        this.svgTree = d3.select(svgOptions.svgId).append("svg:g")
            .attr('id', svgOptions.id);

        this.diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });
    }

    Tree.prototype.draw = function() {
        this.root = this.treeJSON;
        this.root.x0 = this.svgOptions.width/2;
        this.root.y0 = 100; 

        var toggle = this.toggle;

        var toggleAll = function(d) {
            if (d.children) {
                d.children.forEach(toggleAll);
                toggle(d);
            }
        }

        this.root.children.forEach(toggleAll);

        this.update(this.root);
        d3.select('#c0').classed('selected', true).classed('open', true);
    }

    Tree.prototype.update = function(source) {
        var _this = this;
        var tree = this.tree;
        var diagonal = this.diagonal;
        var toggle = this.toggle;
        var update = this.update;
        var select = this.select;
        var duration = d3.event && d3.event.altKey ? 5000 : 500;
      
        // Compute the new tree layout.
        var nodes = tree.nodes(this.root).reverse();

      
        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = 60 + d.depth * 180;
            // var dArray = [50, 180, 400, 580];
            // d.y = dArray[d.depth];
        });
      
        // Update the nodes…
        var node = this.svgTree.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++_this.i); });
      
        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .classed('open', _this.isOpen )
            .attr('id', function(d) {return 'c' + d.code; })
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) {
                var n = d3.select(d3.event.target.parentElement);
                if (!n.classed('open')) {
                    // if node is not open, open it
                    n.classed('open', true);
                    toggle.call(_this, d);
                    update.call(_this, d);
                } else {
                    if (!n.classed('selected')) {
                        // unselect all the node's parent nodes
                        _this.unselectParents(d.code);
                        _this.unselectChildren(d.code);
                        // and if the node is not selected, select it
                        n.classed('selected', true);
                        
                    } else {
                        if (d.code !== '0') {
                            // otherwise, close the node and unselect it
                            n.classed('open', _this.isOpen );
                            n.classed('selected', false);
                            toggle.call(_this, d);
                            update.call(_this, d);
                            // selecting the parent node if necessary
                            _this.selectParent(d.code);
                        }
                    }
                }
            });
      
        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
      
        nodeEnter.append("svg:text")
            .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.description; })
            .style("fill-opacity", 1e-6);
      
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      
        nodeUpdate.select("circle")
            .attr("r", 4.5)
      
        nodeUpdate.select("text")
            .style("fill-opacity", 1);
      
        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();
      
        nodeExit.select("circle")
            .attr("r", 1e-6);
      
        nodeExit.select("text")
            .style("fill-opacity", 1e-6);
      
        // Update the links…
        var link = this.svgTree.selectAll("path.link")
            .data(tree.links(nodes), function(d) { return d.target.id; });
      
        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
              var o = {x: source.x0, y: source.y0};
              return diagonal({source: o, target: o});
            })
          .transition()
            .duration(duration)
            .attr("d", diagonal);
      
        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);
      
        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
              var o = {x: source.x, y: source.y};
              return diagonal({source: o, target: o});
            })
            .remove();
      
        // Stash the old positions for transition.
        nodes.forEach(function(d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
    }

    Tree.prototype.toggle = function(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    Tree.prototype.json = function(callback) {
        var _this = this;
        d3.json(this.url, function(d) {
            _this.treeJSON = d;
            _this.draw()
            // if (typeof callback !== 'undefined') callback();
        });
    }

    Tree.prototype.unselectParents = function f (code) {
        var pCode = code.length > 2 ? code.slice(0, code.length - 1) : '0';
        var p = d3.select('#c' + pCode).classed('selected', false);
        if (pCode !== '0') {
            f(pCode);
        }
    }

    Tree.prototype.unselectChildren = function(code) {
        var allSelected = d3.selectAll('.selected');
        if (code === '0') {
            allSelected.classed('selected', false);
        } else {
            allSelected.classed('selected', function(d) {
                if (d.code.slice(0,code.length) === code && d.code !== code) {
                    return false;
                }
                return true;
            })
        }
    }

    Tree.prototype.selectParent = function(code) {
        pCode = code.length > 2 ? code.slice(0, code.length - 1) : '0';
        var p = d3.select('#c' + pCode); // select parent node
        if (!this.hasSelectedChildren(pCode)) {
            // if no siblings or children of sibling are selected, select parent node
            p.classed('selected', true);
        }
    }

    Tree.prototype.hasSelectedChildren = function(code) {
        var allSelected = d3.selectAll('.selected').data();
        if (code === '0') {
            return allSelected.length > 0;
        } else {
            return _.some(allSelected, function(c) {
                return c.code.slice(0, code.length) === code;
            });
        }
    }

    Tree.prototype.isOpen = function(d) {
        if (d._children || d.children) {return false;}
        return true;
    }

    Tree.prototype.hide = function(d) {
        this.svgTree.style('display', 'none');
    }
    
    Tree.prototype.show = function(d) {
        this.svgTree.style('display', 'block');
    }

    return Tree;
});