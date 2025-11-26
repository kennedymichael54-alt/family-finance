import React, { useState } from 'react';

/**
 * BillsCalendarView Component - REDESIGNED for clean, modern look
 * 
 * Simple list view of bills with:
 * - Color-coded status (upcoming, overdue, paid)
 * - One-click mark as paid
 * - Clean glassmorphic design
 */

const BillsCalendarView = () => {
  const today = new Date();
  
  const [bills, setBills] = useState([
    {
      id: 1,
      name: 'Rent',
      amount: 1850,
      dueDate: new Date(today.getFullYear(), today.getMonth(), 1),
      status: 'paid',
      emoji: '🏠',
      category: 'Housing'
    },
    {
      id: 2,
      name: 'Electric',
      amount: 145,
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      status: 'overdue',
      emoji: '⚡',
      category: 'Utilities'
    },
    {
      id: 3,
      name: 'Internet',
      amount: 79,
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      status: 'upcoming',
      emoji: '📶',
      category: 'Utilities'
    },
    {
      id: 4,
      name: 'Car Insurance',
      amount: 156,
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      status: 'upcoming',
      emoji: '🚗',
      category: 'Transport'
    },
    {
      id: 5,
      name: 'Netflix',
      amount: 15.99,
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8),
      status: 'upcoming',
      emoji: '📺',
      category: 'Entertainment'
    },
    {
      id: 6,
      name: 'Phone',
      amount: 85,
      dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      status: 'upcoming',
      emoji: '📱',
      category: 'Utilities'
    }
  ]);

  const markAsPaid = (id) => {
    setBills(bills.map(bill =>
      bill.id === id
        ? { ...bill, status: bill.status === 'paid' ? 'upcoming' : 'paid' }
        : bill
    ));
  };

  const getDaysUntil = (dueDate) => {
    const days = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#10B981'
        };
      case 'overdue':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#EF4444'
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(59, 130, 246, 0.3)',
          text: '#3B82F6'
        };
    }
  };

  // Calculate summary stats
  const upcomingCount = bills.filter(b => b.status === 'upcoming').length;
  const overdueCount = bills.filter(b => b.status === 'overdue').length;
  const paidCount = bills.filter(b => b.status === 'paid').length;
  const totalDue = bills
    .filter(b => b.status !== 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  // Sort bills: overdue first, then by due date
  const sortedBills = [...bills].sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    if (a.status === 'paid' && b.status !== 'paid') return 1;
    if (b.status === 'paid' && a.status !== 'paid') return -1;
    return a.dueDate - b.dueDate;
  });

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          background: 'rgba(30, 27, 56, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
            📅 Upcoming
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3B82F6' }}>
            {upcomingCount}
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 27, 56, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: overdueCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
            ⚠️ Overdue
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: overdueCount > 0 ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>
            {overdueCount}
          </div>
        </div>

        <div style={{
          background: 'rgba(30, 27, 56, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
            ✅ Paid
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981' }}>
            {paidCount}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
            💸 Total Due
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            ${totalDue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div style={{
        background: 'rgba(30, 27, 56, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '20px' }}>
          Bills & Payments
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedBills.map((bill) => {
            const statusColor = getStatusColor(bill.status);
            const isOverdue = bill.status === 'overdue';
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                style={{
                  background: isPaid ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: isOverdue ? `1px solid ${statusColor.border}` : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: isPaid ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <span style={{ fontSize: '28px' }}>{bill.emoji}</span>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '500', 
                      color: 'white',
                      textDecoration: isPaid ? 'line-through' : 'none'
                    }}>
                      {bill.name}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: statusColor.text,
                      marginTop: '2px'
                    }}>
                      {isPaid ? '✅ Paid' : getDaysUntil(bill.dueDate)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '700', 
                    color: 'white',
                    textDecoration: isPaid ? 'line-through' : 'none'
                  }}>
                    ${bill.amount}
                  </div>

                  <button
                    onClick={() => markAsPaid(bill.id)}
                    style={{
                      padding: '8px 16px',
                      background: isPaid
                        ? 'rgba(255,255,255,0.1)'
                        : 'linear-gradient(135deg, #10B981, #14B8A6)',
                      border: isPaid ? '1px solid rgba(255,255,255,0.2)' : 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isPaid ? 'Undo' : 'Mark Paid'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BillsCalendarView;
