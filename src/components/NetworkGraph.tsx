"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  label: string;
  type: 'central' | 'metric';
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface NetworkGraphProps {
  onNodeClick?: (node: Node) => void;
}

export default function NetworkGraph({ onNodeClick }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  
  // Store the callback in a ref to avoid recreating the simulation
  const onNodeClickRef = useRef(onNodeClick);
  
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  useEffect(() => {
    console.log('🔵 [NetworkGraph] useEffect triggered - creating simulation');
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Define nodes
    const nodes: Node[] = [
      // Central nodes
      { id: 'volatility', label: 'Volatility', type: 'central' },
      { id: 'exposure', label: 'Exposure', type: 'central' },
      
      // Metric nodes
      { id: 'sharpe-ratio', label: 'Sharpe Ratio', type: 'metric' },
      { id: 'max-drawdown', label: 'Max Drawdown', type: 'metric' },
      { id: 'beta', label: 'Beta', type: 'metric' },
      { id: 'var', label: 'VaR (95%)', type: 'metric' },
      { id: 'risk-score', label: 'Risk Score', type: 'metric' },
      { id: 'correlation', label: 'Correlation', type: 'metric' },
      { id: 'duration', label: 'Duration', type: 'metric' },
      { id: 'hedge-ratio', label: 'Hedge Ratio', type: 'metric' },
      { id: 'liquidity', label: 'Liquidity', type: 'metric' },
      { id: 'cost-basis', label: 'Cost Basis', type: 'metric' },
    ];

    // Define links
    const links: Link[] = [
      // Volatility connections
      { source: 'volatility', target: 'sharpe-ratio' },
      { source: 'volatility', target: 'max-drawdown' },
      { source: 'volatility', target: 'beta' },
      { source: 'volatility', target: 'var' },
      { source: 'volatility', target: 'risk-score' },
      
      // Exposure connections
      { source: 'exposure', target: 'risk-score' },
      { source: 'exposure', target: 'hedge-ratio' },
      { source: 'exposure', target: 'liquidity' },
      { source: 'exposure', target: 'cost-basis' },
      
      // Cross connections
      { source: 'correlation', target: 'duration' },
      { source: 'hedge-ratio', target: 'correlation' },
      { source: 'risk-score', target: 'correlation' },
    ];

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add gradient and filter definitions
    const defs = svg.append('defs');
    
    // Gradient for links
    const linkGradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');
    
    linkGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.6);
    
    linkGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.3);

    // Glow filter for nodes
    const glow = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glow.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradient for central nodes
    const centralGradient = defs.append('radialGradient')
      .attr('id', 'central-gradient');
    
    centralGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff');
    
    centralGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f0f0f0');

    // Gradient for metric nodes
    const metricGradient = defs.append('radialGradient')
      .attr('id', 'metric-gradient');
    
    metricGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a78bfa');
    
    metricGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#7c3aed');

    // Create force simulation with reduced alpha decay for stability
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d: any) => d.type === 'central' ? 65 : 45))
      .alphaDecay(0.02); // Slower decay for smoother settling

    simulationRef.current = simulation;

    // Create container group
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4);

    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add outer glow circle
    node.append('circle')
      .attr('r', (d: any) => d.type === 'central' ? 54 : 34)
      .attr('fill', (d: any) => d.type === 'central' ? '#6366f144' : '#8b5cf644')
      .attr('class', 'glow-circle');

    // Add main circle with gradient
    node.append('circle')
      .attr('r', (d: any) => d.type === 'central' ? 50 : 30)
      .attr('fill', (d: any) => d.type === 'central' ? 'url(#central-gradient)' : 'url(#metric-gradient)')
      .attr('stroke', (d: any) => d.type === 'central' ? '#e5e7eb' : '#a78bfa')
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4))')
      .attr('class', 'main-circle');

    // Add inner highlight
    node.append('circle')
      .attr('r', (d: any) => d.type === 'central' ? 48 : 28)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1.5)
      .attr('class', 'highlight-circle');

    // Add text labels
    node.append('text')
      .text((d: any) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', (d: any) => d.type === 'central' ? '#1f2937' : '#ffffff')
      .attr('font-size', (d: any) => d.type === 'central' ? '14px' : '11px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')
      .each(function(d: any) {
        // Wrap text for better display
        const text = d3.select(this);
        const words = d.label.split(' ');
        if (words.length > 1) {
          text.text('');
          words.forEach((word: string, i: number) => {
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', i === 0 ? '-0.3em' : '1.1em')
              .text(word);
          });
        }
      });

    // Hover effects
    node.on('mouseenter', function(event, d: any) {
      const nodeGroup = d3.select(this);
      
      nodeGroup.select('.main-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 55 : 35)
        .attr('filter', 'drop-shadow(0px 8px 24px rgba(139, 92, 246, 0.8))');
      
      nodeGroup.select('.glow-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 59 : 39);

      nodeGroup.select('.highlight-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 53 : 33);
      
      // Highlight connected links
      link.transition()
        .duration(200)
        .attr('stroke-opacity', (l: any) => 
          (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
        )
        .attr('stroke-width', (l: any) => 
          (l.source.id === d.id || l.target.id === d.id) ? 3 : 2
        );
    })
    .on('mouseleave', function(event, d: any) {
      const nodeGroup = d3.select(this);
      
      nodeGroup.select('.main-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 50 : 30)
        .attr('filter', 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4))');
      
      nodeGroup.select('.glow-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 54 : 34);

      nodeGroup.select('.highlight-circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'central' ? 48 : 28);
      
      link.transition()
        .duration(200)
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 2);
    })
    .on('click', function(event, d: any) {
      event.stopPropagation();
      if (onNodeClickRef.current) {
        onNodeClickRef.current(d);
      }
    });

    // Update positions on each tick - no animations, just update
    let tickCount = 0;
    simulation.on('tick', () => {
      tickCount++;
      if (tickCount % 50 === 0) {
        console.log('🔄 [NetworkGraph] Simulation tick', {
          tickCount,
          alpha: simulation.alpha(),
          alphaTarget: simulation.alphaTarget()
        });
      }
      
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions - prevent restart on drag
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.1).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      // Keep nodes fixed after drag to prevent movement
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []); // Empty dependency array - only create simulation once!

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #0f0f1e, #1a1a2e)',
        position: 'relative',
      }}
    >
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
