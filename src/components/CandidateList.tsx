import { useState } from 'react';
import { ExecutionCandidate } from '@/lib/types';
import { mockCandidates } from '@/lib/mockData';

interface CandidateListProps {
  candidates?: ExecutionCandidate[];
  onAddToHedge?: (candidate: ExecutionCandidate) => void;
}

const CandidateList = ({ candidates = mockCandidates, onAddToHedge }: CandidateListProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');

  const handleSelectCandidate = (marketId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(marketId)) {
      newSelected.delete(marketId);
    } else {
      newSelected.add(marketId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map(c => c.marketId)));
    }
  };

  const filteredCandidates = filterType === 'all' 
    ? candidates 
    : candidates.filter(c => c.market.venue === filterType);

  const handleAddSelected = () => {
    if (onAddToHedge) {
      selectedCandidates.forEach(marketId => {
        const candidate = candidates.find(c => c.marketId === marketId);
        if (candidate) {
          onAddToHedge(candidate);
        }
      });
    }
  };

  return (
    <div className="candidate-list-container glass-card">
      <div className="list-header">
        <h3 className="list-title">Hedge Candidates</h3>
        <div className="list-controls">
          <div className="filter-control">
            <label htmlFor="type-filter">Type:</label>
            <select 
              id="type-filter" 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="currency">Currency</option>
              <option value="commodity">Commodity</option>
              <option value="equity">Equity</option>
              <option value="bond">Bond</option>
              <option value="derivative">Derivative</option>
            </select>
          </div>
          <div className="selection-info">
            {selectedCandidates.size} selected
          </div>
          <button 
            className="action-btn small primary"
            onClick={handleAddSelected}
            disabled={selectedCandidates.size === 0}
          >
            Add Selected ({selectedCandidates.size})
          </button>
        </div>
      </div>
      
      <div className="list-content">
        <div className="candidates-grid">
          {filteredCandidates.map((candidate) => (
            <div 
              key={candidate.marketId} 
              className={`candidate-card ${selectedCandidates.has(candidate.marketId) ? 'selected' : ''}`}
              onClick={() => handleSelectCandidate(candidate.marketId)}
            >
              <div className="card-header">
                <div className="selection-indicator">
                  {selectedCandidates.has(candidate.marketId) ? (
                    <div className="checkmark">✓</div>
                  ) : (
                    <div className="empty-circle"></div>
                  )}
                </div>
                <div className="candidate-info">
                  <div className="candidate-symbol">{candidate.market.title}</div>
                  <div className="candidate-name">{candidate.market.venue}</div>
                </div>
                <div className="candidate-type-badge">{candidate.market.tags[0] || 'Market'}</div>
              </div>
              
              <div className="card-body">
                <div className="metric-grid">
                  <div className="metric-item">
                    <div className="metric-label">Current Price</div>
                    <div className="metric-value">${candidate.market.currentPrice.toFixed(4)}</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Fit Score</div>
                    <div className="metric-value">{(candidate.fit * 100).toFixed(1)}%</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Liquidity</div>
                    <div className="metric-value">${(candidate.market.liquidity / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Depth Estimate</div>
                    <div className="metric-value">${(candidate.depthEst / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Cost Estimate</div>
                    <div className="metric-value">${candidate.costEst.toLocaleString()}</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-label">Weight</div>
                    <div className="metric-value">{(candidate.weight * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <div className="estimated-cost">
                  Estimated Cost: <span className="cost-value">${candidate.costEst.toLocaleString()}</span>
                </div>
                <button 
                  className="action-btn small secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToHedge) onAddToHedge(candidate);
                  }}
                >
                  Add to Hedge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateList;