import { FinancialReportData } from '../services/reportDataService';
import { format } from 'date-fns';

export function generateReportHTML(data: FinancialReportData, title: string): string {
  const { period, revenue, payment_status, budget, summary } = data;
  
  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMMM dd, yyyy');
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const generatedDate = format(new Date(), 'MMMM dd, yyyy \'at\' HH:mm:ss');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    
    .header {
      background: linear-gradient(135deg, #6B2C91 0%, #9932CC 50%, #E85D75 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .header .period {
      font-size: 16px;
      opacity: 0.95;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.2);
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-right: 15px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .card {
      background: #f8f9fa;
      border-left: 4px solid #9932CC;
      padding: 20px;
      border-radius: 6px;
    }
    
    .card-title {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .card-value {
      font-size: 20px;
      font-weight: 700;
      color: #9932CC;
    }
    
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #6B2C91;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 3px solid #9932CC;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      background: white;
    }
    
    thead {
      background: linear-gradient(135deg, #6B2C91 0%, #9932CC 100%);
      color: white;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    tbody tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tbody tr:hover {
      background: #f0f4ff;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-paid {
      background: #d4edda;
      color: #155724;
    }
    
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    
    .status-approved {
      background: #d1ecf1;
      color: #0c5460;
    }
    
    .status-rejected {
      background: #f8d7da;
      color: #721c24;
    }
    
    .progress-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 5px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6B2C91 0%, #9932CC 100%);
      transition: width 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 10px;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-success {
      color: #28a745;
      font-weight: 600;
    }
    
    .text-danger {
      color: #dc3545;
      font-weight: 600;
    }
    
    .text-warning {
      color: #ffc107;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-section">
      <div class="logo">🌾</div>
      <div>
        <h1>Official Financial Report</h1>
        <div class="period">${formatDate(period.start_date)} - ${formatDate(period.end_date)}</div>
      </div>
    </div>
  </div>

  <!-- Executive Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-title">Total Revenue</div>
      <div class="card-value">${formatCurrency(revenue.total_revenue)}</div>
    </div>
    <div class="card">
      <div class="card-title">Net Profit</div>
      <div class="card-value ${summary.net_profit >= 0 ? 'text-success' : 'text-danger'}">${formatCurrency(summary.net_profit)}</div>
    </div>
    <div class="card">
      <div class="card-title">Total Farmers</div>
      <div class="card-value">${summary.total_farmers}</div>
    </div>
    <div class="card">
      <div class="card-title">Transactions</div>
      <div class="card-value">${summary.total_transactions}</div>
    </div>
  </div>

  <!-- Revenue & Profit Section -->
  <div class="section">
    <h2 class="section-title">Revenue & Profit Trends</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th class="text-right">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total Revenue</td>
          <td class="text-right">${formatCurrency(revenue.total_revenue)}</td>
        </tr>
        <tr>
          <td>Total Payments Made</td>
          <td class="text-right">${revenue.total_payments}</td>
        </tr>
        <tr>
          <td>Average Payment</td>
          <td class="text-right">${formatCurrency(revenue.average_payment)}</td>
        </tr>
        <tr>
          <td>Total Expenses</td>
          <td class="text-right">${formatCurrency(budget.total_spent)}</td>
        </tr>
        <tr>
          <td><strong>Net Profit</strong></td>
          <td class="text-right ${summary.net_profit >= 0 ? 'text-success' : 'text-danger'}"><strong>${formatCurrency(summary.net_profit)}</strong></td>
        </tr>
        <tr>
          <td>Profit Margin</td>
          <td class="text-right">${formatPercentage(summary.profit_margin)}</td>
        </tr>
      </tbody>
    </table>

    ${revenue.trend_data.length > 0 ? `
    <h3 style="margin-top: 25px; margin-bottom: 10px; font-size: 14px;">Monthly Trend</h3>
    <table>
      <thead>
        <tr>
          <th>Period</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Transactions</th>
        </tr>
      </thead>
      <tbody>
        ${revenue.trend_data.map(trend => `
          <tr>
            <td>${trend.period}</td>
            <td class="text-right">${formatCurrency(trend.amount)}</td>
            <td class="text-right">${trend.count}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
  </div>

  <!-- Payment Status Section -->
  <div class="section">
    <h2 class="section-title">Payment Status Overview</h2>
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th class="text-right">Count</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Percentage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="status-badge status-paid">Paid</span></td>
          <td class="text-right">${payment_status.paid.count}</td>
          <td class="text-right">${formatCurrency(payment_status.paid.amount)}</td>
          <td class="text-right">${formatPercentage((payment_status.paid.amount / payment_status.total.amount) * 100)}</td>
        </tr>
        <tr>
          <td><span class="status-badge status-approved">Approved</span></td>
          <td class="text-right">${payment_status.approved.count}</td>
          <td class="text-right">${formatCurrency(payment_status.approved.amount)}</td>
          <td class="text-right">${formatPercentage((payment_status.approved.amount / payment_status.total.amount) * 100)}</td>
        </tr>
        <tr>
          <td><span class="status-badge status-pending">Pending</span></td>
          <td class="text-right">${payment_status.pending.count}</td>
          <td class="text-right">${formatCurrency(payment_status.pending.amount)}</td>
          <td class="text-right">${formatPercentage((payment_status.pending.amount / payment_status.total.amount) * 100)}</td>
        </tr>
        <tr>
          <td><span class="status-badge status-rejected">Rejected</span></td>
          <td class="text-right">${payment_status.rejected.count}</td>
          <td class="text-right">${formatCurrency(payment_status.rejected.amount)}</td>
          <td class="text-right">${formatPercentage((payment_status.rejected.amount / payment_status.total.amount) * 100)}</td>
        </tr>
        <tr style="font-weight: 700; background: #f0f4ff;">
          <td>TOTAL</td>
          <td class="text-right">${payment_status.total.count}</td>
          <td class="text-right">${formatCurrency(payment_status.total.amount)}</td>
          <td class="text-right">100%</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Budget Allocation Section -->
  <div class="section">
    <h2 class="section-title">Budget Allocation & Utilization</h2>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th class="text-right">Allocated</th>
          <th class="text-right">Spent</th>
          <th class="text-right">Remaining</th>
          <th style="width: 150px;">Utilization</th>
        </tr>
      </thead>
      <tbody>
        ${budget.categories.map(category => `
          <tr>
            <td>${category.name}</td>
            <td class="text-right">${formatCurrency(category.allocated)}</td>
            <td class="text-right">${formatCurrency(category.spent)}</td>
            <td class="text-right ${category.remaining < 0 ? 'text-danger' : 'text-success'}">${formatCurrency(category.remaining)}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(category.utilization_percentage, 100)}%;">
                  ${formatPercentage(category.utilization_percentage)}
                </div>
              </div>
            </td>
          </tr>
        `).join('')}
        <tr style="font-weight: 700; background: #f0f4ff;">
          <td>TOTAL</td>
          <td class="text-right">${formatCurrency(budget.total_allocated)}</td>
          <td class="text-right">${formatCurrency(budget.total_spent)}</td>
          <td class="text-right ${budget.total_remaining < 0 ? 'text-danger' : 'text-success'}">${formatCurrency(budget.total_remaining)}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min((budget.total_spent / budget.total_allocated) * 100, 100)}%;">
                ${formatPercentage((budget.total_spent / budget.total_allocated) * 100)}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>Farmer Management System - Financial Manager Portal</strong></p>
    <p>Generated on ${generatedDate}</p>
    <p style="margin-top: 10px; font-style: italic;">This is an official financial report. All data is confidential and for authorized personnel only.</p>
  </div>
</body>
</html>
  `;
}
