import React, { useState } from 'react';

/**
 * BudgetTab Component - REDESIGNED to match Family Finance aesthetic
 * 
 * Clean, modern budget management with:
 * - Income/Expense tracking
 * - Category management
 * - Real-time balance calculation
 * - Glassmorphic design
 */

const BudgetTab = () => {
  // Sample data - replace with your actual data source
  const [categories, setCategories] = useState([
    { id: 1, name: 'Housing', emoji: '🏠', budget: 1900, spent: 1850, type: 'expense' },
    { id: 2, name: 'Food', emoji: '🍔', budget: 600, spent: 620, type: 'expense' },
    { id: 3, name: 'Transport', emoji: '🚗', budget: 400, spent: 380, type: 'expense' },
    { id: 4, name: 'Shopping', emoji: '🛍️', budget: 400, spent: 445, type: 'expense' },
    { id: 5, name: 'Salary', emoji: '💰', budget: 0, spent: 7200, type: 'income' }
  ]);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '📦', budget: '', type: 'expense' });

  // Calculate totals
  const totalIncome = categories
    .filter(c => c.type === 'income')
    .reduce((sum, c) => sum + c.spent, 0);
  
  const totalExpenses = categories
    .filter(c => c.type === 'expense')
    .reduce((sum, c) => sum + c.spent, 0);
  
  const balance = totalIncome - totalExpenses;

  const addCategory = () => {
    if (!newCategory.name || !newCategory.budget) return;
    
    setCategories([...categories, {
      id: Date.now(),
      name: newCategory.name,
      emoji: newCategory.emoji,
      budget: parseFloat(newCategory.budget),
      spent: 0,
      type: newCategory.type
    }]);
    
    setNewCategory({ name: '', emoji: '📦', budget: '', type: 'expense' });
    setShowAddCategory(false);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div style={{ animation: 'slideIn 0.3s ease' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Income Card */}
        <div style={{
          background: 'linear-gradient(135deg, #10B981, #14B8A6)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>💰 Income</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            ${totalIncome.toLocaleString()}
          </div>
        </div>

        {/* Expenses Card */}
        <div style={{
          background: 'linear-gradient(135deg, #EF4444, #F87171)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>💸 Expenses</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            ${totalExpenses.toLocaleString()}
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          background: balance >= 0 
            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
            : 'linear-gradient(135deg, #F59E0B, #FBBF24)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white'
        }}>
          <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px' }}>
            {balance >= 0 ? '✨ Surplus' : '⚠️ Deficit'}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>
            {balance >= 0 ? '+' : '-'}${Math.abs(balance).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        background: 'rgba(30, 27, 56, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>Categories</h2>
          <button
            onClick={() => setShowAddCategory(true)}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span> Add Category
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCategory && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px auto', gap: '12px', alignItems: 'center' }}>
              <select
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                style={{
                  padding: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                {['📦', '🏠', '🍔', '🚗', '🛍️', '🎬', '💡', '🏥', '✈️', '💰', '💳'].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              
              <input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              
              <input
                type="number"
                placeholder="Budget"
                value={newCategory.budget}
                onChange={(e) => setNewCategory({ ...newCategory, budget: e.target.value })}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={addCategory}
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddCategory(false)}
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map((cat) => {
            const percentage = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
            const isOver = percentage > 100;
            const isIncome = cat.type === 'income';

            return (
              <div
                key={cat.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: isOver ? '1px solid rgba(239, 68, 68, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{cat.emoji}</span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '500', color: 'white' }}>
                        {cat.name}
                      </div>
                      {!isIncome && (
                        <div style={{ fontSize: '13px', color: isOver ? '#EF4444' : 'rgba(255,255,255,0.6)' }}>
                          ${cat.spent} / ${cat.budget}
                        </div>
                      )}
                      {isIncome && (
                        <div style={{ fontSize: '13px', color: '#10B981' }}>
                          ${cat.spent}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      color: '#EF4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
                
                {!isIncome && (
                  <div style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(percentage, 100)}%`,
                      height: '100%',
                      background: isOver ? '#EF4444' : 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                )}
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

export default BudgetTab;
