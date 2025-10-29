import { ExecutionSheet as ExecutionSheetType, ExecutionCandidate } from '@/lib/types';
import { mockExecutionSheet } from '@/lib/mockData';

interface ExecutionSheetProps {
  executionSheet?: ExecutionSheetType;
}

const ExecutionSheet = ({ executionSheet = mockExecutionSheet }: ExecutionSheetProps) => {
  const sheet = executionSheet;

  return (
    <div className="execution-sheet glass-card">
      <div className="sheet-header">
        <div className="sheet-title-section">
          <h2 className="sheet-title">Execution Sheet</h2>
          <p className="sheet-description">Orders preview and execution summary</p>
        </div>
        <div className="sheet-metrics">
          <div className="metric-card">
            <div className="metric-label">Total Cost</div>
            <div className="metric-value">${sheet.basket.totalCost.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Expected Coverage</div>
            <div className="metric-value">{(sheet.basket.expectedCoverage * 100).toFixed(1)}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Slippage</div>
            <div className="metric-value">{(sheet.slippage * 100).toFixed(2)}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Fees</div>
            <div className="metric-value">${sheet.fees.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="sheet-summary">
        <div className="summary-item">
          <div className="summary-label">Estimated Cost</div>
          <div className="summary-value">${sheet.estimatedCost.toLocaleString()}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Estimated P&L</div>
          <div className="summary-value pnl-positive">{sheet.estimatedPnL > 0 ? '+' : ''}${sheet.estimatedPnL.toLocaleString()}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Confidence</div>
          <div className="summary-value">{(sheet.confidence * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="sheet-actions">
        <button className="action-btn primary">Execute Hedge</button>
        <button className="action-btn secondary">Save Draft</button>
        <button className="action-btn tertiary">Export</button>
      </div>

      <div className="candidates-section">
        <h3 className="section-title">Basket Items</h3>
        <div className="candidates-list">
          {sheet.basket.items.map((item, index) => (
            <div key={item.marketId} className="candidate-card">
              <div className="candidate-header">
                <div className="candidate-symbol">{item.marketId}</div>
                <div className="candidate-name">Market {index + 1}</div>
                <div className="candidate-type">{item.side}</div>
              </div>
              <div className="candidate-metrics">
                <div className="metric">
                  <div className="metric-label">Weight</div>
                  <div className="metric-value">{(item.weight * 100).toFixed(1)}%</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Order Type</div>
                  <div className="metric-value">{item.orderType}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Max Spend</div>
                  <div className="metric-value">{item.limits.maxSpend?.toLocaleString() || 'N/A'}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Slippage Guard</div>
                  <div className="metric-value">{(item.limits.slippageGuard || 0) * 100}%</div>
                </div>
              </div>
              <div className="candidate-actions">
                <button className="action-btn small primary">View Order</button>
                <button className="action-btn small secondary">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionSheet;