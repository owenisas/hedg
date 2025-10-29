import { useState } from 'react';
import { exposureFormSchema, ExposureFormValues } from '@/lib/schemas';
import { z } from 'zod';

interface ExposureFormProps {
  onSubmit: (data: ExposureFormValues) => void;
}

const ExposureForm = ({ onSubmit }: ExposureFormProps) => {
  const [formData, setFormData] = useState<ExposureFormValues>({
    statement: '',
    horizon: '30d',
    budget: 10000,
    venuesAllowed: ['Polymarket'],
    jurisdiction: 'US',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverage, setCoverage] = useState<number | null>(null);
  const [residualRisk, setResidualRisk] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'venuesAllowed') {
      const selectElement = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      exposureFormSchema.parse(formData);
      
      // Simulate API call to get coverage and residual risk
      // In a real implementation, this would call the backend API
      setTimeout(() => {
        setCoverage(0.75);
        setResidualRisk(0.25);
      }, 500);
      
      // Submit form
      onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(issue => {
          if (issue.path) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="exposure-form glass-card">
      <h3 className="form-title">Define Your Exposure</h3>
      <p className="form-description">
        Describe your risk exposure to get tailored hedging recommendations
      </p>
      
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label htmlFor="statement" className="form-label">
            Risk Statement *
          </label>
          <textarea
            id="statement"
            name="statement"
            value={formData.statement}
            onChange={handleChange}
            placeholder="e.g., We have significant exposure to EUR/USD fluctuations due to our European operations and USD-denominated debt"
            className={`form-input textarea ${errors.statement ? 'error' : ''}`}
            rows={4}
          />
          {errors.statement && <span className="error-message">{errors.statement}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="horizon" className="form-label">
              Time Horizon *
            </label>
            <select
              id="horizon"
              name="horizon"
              value={formData.horizon}
              onChange={handleChange}
              className={`form-input ${errors.horizon ? 'error' : ''}`}
            >
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
              <option value="180d">180 days</option>
              <option value="1y">1 year</option>
            </select>
            {errors.horizon && <span className="error-message">{errors.horizon}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="budget" className="form-label">
              Budget *
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your hedging budget"
              className={`form-input ${errors.budget ? 'error' : ''}`}
              min="1000"
            />
            {errors.budget && <span className="error-message">{errors.budget}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Allowed Venues *
          </label>
          <div className="checkbox-group">
            {['Polymarket', 'Kalshi', 'Other'].map((venue) => (
              <label key={venue} className="checkbox-label">
                <input
                  type="checkbox"
                  name="venuesAllowed"
                  value={venue}
                  checked={formData.venuesAllowed.includes(venue)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        venuesAllowed: [...prev.venuesAllowed, venue]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        venuesAllowed: prev.venuesAllowed.filter(v => v !== venue)
                      }));
                    }
                  }}
                  className="checkbox-input"
                />
                {venue}
              </label>
            ))}
          </div>
          {errors.venuesAllowed && <span className="error-message">{errors.venuesAllowed}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="jurisdiction" className="form-label">
            Jurisdiction *
          </label>
          <select
            id="jurisdiction"
            name="jurisdiction"
            value={formData.jurisdiction}
            onChange={handleChange}
            className={`form-input ${errors.jurisdiction ? 'error' : ''}`}
          >
            <option value="US">United States</option>
            <option value="EU">European Union</option>
            <option value="UK">United Kingdom</option>
            <option value="JP">Japan</option>
            <option value="SG">Singapore</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.jurisdiction && <span className="error-message">{errors.jurisdiction}</span>}
        </div>
        
        {(coverage !== null || residualRisk !== null) && (
          <div className="risk-summary">
            <div className="summary-item">
              <div className="summary-label">Expected Coverage</div>
              <div className="summary-value">{(coverage! * 100).toFixed(1)}%</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Residual Risk</div>
              <div className="summary-value">{(residualRisk! * 100).toFixed(1)}%</div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="action-btn primary submit-btn"
        >
          {isSubmitting ? 'Processing...' : 'Find Hedging Options'}
        </button>
      </form>
    </div>
  );
};

export default ExposureForm;