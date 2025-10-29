"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { mockMarkets } from '@/lib/mockData';

interface Node {
  id: string;
  title: string;
  fit: number;
  liquidity: number;
  type: 'central' | 'market';
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

    // Get markets from mock data
    const markets = mockMarkets.slice(0, 8); // Limit to 8 markets for better visualization

    // Create nodes for markets
    const nodes: Node[] = [
      // Central exposure node
      { 
        id: 'exposure', 
        title: 'Exposure Statement', 
        fit: 1, 
        liquidity: 1,
        type: 'central' 
      },
      // Market nodes
      ...markets.map((market, index) => ({
        id: market.id,
        title: market.title,
        fit: 0.7 + (index * 0.05), // Vary fit scores
        liquidity: market.liquidity / 1000000, // Normalize liquidity
        type: 'market' as const
      }))
    ];

    // Create links between exposure and markets
    const links: Link[] = markets.map(market => ({
      source: 'exposure',
      target: market.id
    }));

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

    // Gradient for market nodes
    const marketGradient = defs.append('radialGradient')
      .attr('id', 'market-gradient');
    
    marketGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981'); // Green for good fit
    
    marketGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#059669'); // Darker green

    // Gradient for low fit market nodes
    const lowFitGradient = defs.append('radialGradient')
      .attr('id', 'low-fit-gradient');
    
    lowFitGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ef4444'); // Red for low fit
    
    lowFitGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#dc2626'); // Darker red

    // Create force simulation with reduced alpha decay for stability
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(200)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d: any) => {
          // Calculate size based on fit and liquidity
          const baseSize = d.type === 'central' ? 60 : 40;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        }))
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
      .attr('r', (d: any) => {
        const baseSize = d.type === 'central' ? 54 : 34;
        const fitFactor = d.fit || 0.5;
        return baseSize * (0.5 + 0.5 * fitFactor);
      })
      .attr('fill', (d: any) => {
        if (d.type === 'central') {
          return '#6366f144';
        } else {
          // Color based on fit score
          return d.fit > 0.6 ? '#10b98144' : '#ef444444';
        }
      })
      .attr('class', 'glow-circle');

    // Add main circle with gradient based on fit score
    node.append('circle')
      .attr('r', (d: any) => {
        const baseSize = d.type === 'central' ? 50 : 30;
        const fitFactor = d.fit || 0.5;
        return baseSize * (0.5 + 0.5 * fitFactor);
      })
      .attr('fill', (d: any) => {
        if (d.type === 'central') {
          return 'url(#central-gradient)';
        } else {
          // Use different gradient based on fit score
          return d.fit > 0.6 ? 'url(#market-gradient)' : 'url(#low-fit-gradient)';
        }
      })
      .attr('stroke', (d: any) => d.type === 'central' ? '#e5e7eb' : '#10b981')
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4))')
      .attr('class', 'main-circle');

    // Add inner highlight
    node.append('circle')
      .attr('r', (d: any) => {
        const baseSize = d.type === 'central' ? 48 : 28;
        const fitFactor = d.fit || 0.5;
        return baseSize * (0.5 + 0.5 * fitFactor);
      })
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1.5)
      .attr('class', 'highlight-circle');

    // Add fit score badge
    node.filter((d: any) => d.type === 'market')
      .append('circle')
      .attr('r', 12)
      .attr('cx', (d: any) => {
        const baseSize = 30;
        const fitFactor = d.fit || 0.5;
        return (baseSize * (0.5 + 0.5 * fitFactor)) - 10;
      })
      .attr('cy', (d: any) => {
        const baseSize = 30;
        const fitFactor = d.fit || 0.5;
        return -1 * (baseSize * (0.5 + 0.5 * fitFactor)) + 10;
      })
      .attr('fill', 'rgba(0, 0, 0, 0.7)')
      .attr('stroke', 'rgba(255, 255, 255, 0.4)')
      .attr('stroke-width', 1);

    // Add fit score text
    node.filter((d: any) => d.type === 'market')
      .append('text')
      .text((d: any) => `${Math.round((d.fit || 0) * 100)}%`)
      .attr('x', (d: any) => {
        const baseSize = 30;
        const fitFactor = d.fit || 0.5;
        return (baseSize * (0.5 + 0.5 * fitFactor)) - 10;
      })
      .attr('y', (d: any) => {
        const baseSize = 30;
        const fitFactor = d.fit || 0.5;
        return -1 * (baseSize * (0.5 + 0.5 * fitFactor)) + 14;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('user-select', 'none');

    // Add text labels
    node.append('text')
      .text((d: any) => {
        // Truncate long titles
        const title = d.title;
        return title.length > 20 ? title.substring(0, 17) + '...' : title;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.type === 'central' ? '0.35em' : '1.5em')
      .attr('fill', (d: any) => d.type === 'central' ? '#1f2937' : '#ffffff')
      .attr('font-size', (d: any) => d.type === 'central' ? '14px' : '11px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('user-select', 'none')
      .each(function(d: any) {
        // Wrap text for better display
        if (d.type !== 'central') {
          const text = d3.select(this);
          const words = d.title.split(' ');
          if (words.length > 1) {
            text.text('');
            words.forEach((word: string, i: number) => {
              text.append('tspan')
                .attr('x', 0)
                .attr('dy', i === 0 ? '-0.3em' : '1.1em')
                .text(word.length > 15 ? word.substring(0, 12) + '...' : word);
            });
          }
        }
      });

    // Hover effects
    node.on('mouseenter', function(event, d: any) {
      const nodeGroup = d3.select(this);
      
      nodeGroup.select('.main-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 55 : 35;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        })
        .attr('filter', 'drop-shadow(0px 8px 24px rgba(139, 92, 246, 0.8))');
      
      nodeGroup.select('.glow-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 59 : 39;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        });

      nodeGroup.select('.highlight-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 53 : 33;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        });
      
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
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 50 : 30;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        })
        .attr('filter', 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4))');
      
      nodeGroup.select('.glow-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 54 : 34;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        });

      nodeGroup.select('.highlight-circle')
        .transition()
        .duration(200)
        .attr('r', (d: any) => {
          const baseSize = d.type === 'central' ? 48 : 28;
          const fitFactor = d.fit || 0.5;
          return baseSize * (0.5 + 0.5 * fitFactor);
        });
      
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
