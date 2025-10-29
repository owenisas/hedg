import { useState } from 'react';
import { HedgePosition } from '@/lib/types';
import { mockPositions } from '@/lib/mockData';

interface PositionsTableProps {
  positions?: HedgePosition[];
}

const PositionsTable = ({ positions = mockPositions }: PositionsTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof HedgePosition; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof HedgePosition) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPositions = [...positions];
  if (sortConfig !== null) {
    sortedPositions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const getSortIndicator = (key: keyof HedgePosition) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const formatPnL = (pnl: number, pnlPercentage: number) => {
    const sign = pnl >= 0 ? '+' : '';
    const colorClass = pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
    return (
      <div className={colorClass}>
        {sign}${pnl.toLocaleString()} ({sign}{pnlPercentage.toFixed(2)}%)
      </div>
    );
  };

  return (
    <div className="positions-table-container glass-card">
      <div className="table-header">
        <h3 className="table-title">Current Positions</h3>
        <div className="table-actions">
          <button className="action-btn small secondary">Add Position</button>
          <button className="action-btn small tertiary">Export</button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')} className="sortable">
                Title {getSortIndicator('title')}
              </th>
              <th onClick={() => handleSort('venue')} className="sortable">
                Venue {getSortIndicator('venue')}
              </th>
              <th onClick={() => handleSort('side')} className="sortable">
                Side {getSortIndicator('side')}
              </th>
              <th onClick={() => handleSort('quantity')} className="sortable text-right">
                Quantity {getSortIndicator('quantity')}
              </th>
              <th onClick={() => handleSort('avgPrice')} className="sortable text-right">
                Avg Price {getSortIndicator('avgPrice')}
              </th>
              <th onClick={() => handleSort('mark')} className="sortable text-right">
                Mark {getSortIndicator('mark')}
              </th>
              <th onClick={() => handleSort('pnl')} className="sortable text-right">
                P&L {getSortIndicator('pnl')}
              </th>
              <th onClick={() => handleSort('coverage')} className="sortable text-right">
                Coverage {getSortIndicator('coverage')}
              </th>
              <th onClick={() => handleSort('residualRisk')} className="sortable text-right">
                Residual Risk {getSortIndicator('residualRisk')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position) => (
              <tr key={position.id}>
                <td className="font-medium">{position.title}</td>
                <td>{position.venue}</td>
                <td>
                  <span className={`type-badge ${position.side}`}>
                    {position.side}
                  </span>
                </td>
                <td className="text-right">{position.quantity.toLocaleString()}</td>
                <td className="text-right">{position.avgPrice.toFixed(4)}</td>
                <td className="text-right">{position.mark.toFixed(4)}</td>
                <td className="text-right">
                  {formatPnL(position.pnl, position.pnlPercentage)}
                </td>
                <td className="text-right">{(position.coverage * 100).toFixed(1)}%</td>
                <td className="text-right">{(position.residualRisk * 100).toFixed(1)}%</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="icon-button">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PositionsTable;