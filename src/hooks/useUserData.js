import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Default data for new users
const defaultBudgetData = {
  income: [
    { id: 1, name: 'Primary Salary', amount: 0 },
    { id: 2, name: 'Freelance', amount: 0 }
  ],
  expenses: [
    { id: 1, name: 'Housing', amount: 0 },
    { id: 2, name: 'Utilities', amount: 0 },
    { id: 3, name: 'Groceries', amount: 0 },
    { id: 4, name: 'Insurance', amount: 0 }
  ]
};

const defaultBillDates = [];
const defaultTransactions = [];
const defaultInvestments = [];
const defaultMarketData = {
  dow: { value: 0, change: 0 },
  sp500: { value: 0, change: 0 },
  nasdaq: { value: 0, change: 0 }
};

export const useUserData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // User data states
  const [budgetData, setBudgetDataState] = useState(defaultBudgetData);
  const [billDates, setBillDatesState] = useState(defaultBillDates);
  const [transactions, setTransactionsState] = useState(defaultTransactions);
  const [investments, setInvestmentsState] = useState(defaultInvestments);
  const [marketData, setMarketDataState] = useState(defaultMarketData);
  const [lastImportDate, setLastImportDateState] = useState(null);

  // Load user data from Supabase
  const loadUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Loading data for user:', user.id);

      // Try to load user profile/settings
      let profile = null;
      try {
        const { data, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to avoid error when no rows

        if (profileError) {
          console.warn('Profile fetch error:', profileError);
          // Don't throw - table might not exist yet
        } else {
          profile = data;
        }
      } catch (e) {
        console.warn('Could not fetch profile:', e);
      }

      // If user profile exists, load their data
      if (profile) {
        console.log('Found existing profile:', profile);
        setBudgetDataState(profile.budget_data || defaultBudgetData);
        setMarketDataState(profile.market_data || defaultMarketData);
        setLastImportDateState(profile.last_import_date ? new Date(profile.last_import_date) : null);
      } else {
        // Try to create profile for new user
        console.log('No profile found, creating new one...');
        try {
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: user.id,
              budget_data: defaultBudgetData,
              market_data: defaultMarketData
            });
          if (insertError) {
            console.warn('Could not create profile:', insertError);
            // Continue anyway with defaults
          }
        } catch (e) {
          console.warn('Profile creation error:', e);
        }
      }

      // Try to load transactions
      try {
        const { data: transactionsData, error: transError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (transError) {
          console.warn('Transactions fetch error:', transError);
        } else {
          setTransactionsState(transactionsData || []);
        }
      } catch (e) {
        console.warn('Could not fetch transactions:', e);
      }

      // Try to load bill dates
      try {
        const { data: billsData, error: billsError } = await supabase
          .from('bill_dates')
          .select('*')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true });

        if (billsError) {
          console.warn('Bills fetch error:', billsError);
        } else {
          setBillDatesState(billsData?.map(b => ({
            id: b.id,
            name: b.name,
            amount: b.amount,
            dueDate: b.due_date
          })) || []);
        }
      } catch (e) {
        console.warn('Could not fetch bills:', e);
      }

      // Try to load investments
      try {
        const { data: investmentsData, error: invError } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id);

        if (invError) {
          console.warn('Investments fetch error:', invError);
        } else {
          setInvestmentsState(investmentsData?.map(i => ({
            id: i.id,
            type: i.type,
            accountType: i.account_type,
            currentValue: i.current_value,
            targetValue: i.target_value
          })) || []);
        }
      } catch (e) {
        console.warn('Could not fetch investments:', e);
      }

      console.log('Data loading complete');
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  // Save budget data
  const setBudgetData = useCallback(async (newBudgetData) => {
    setBudgetDataState(newBudgetData);
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({ 
          user_id: user.id,
          budget_data: newBudgetData, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'user_id' });
      
      if (error) console.warn('Error saving budget data:', error);
    } catch (err) {
      console.error('Error saving budget data:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Save transaction
  const addTransaction = useCallback(async (transaction) => {
    if (!user) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          date: transaction.date,
          description: transaction.description,
          vendor: transaction.vendor,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          source: transaction.source,
          institution: transaction.institution,
          recurring: transaction.recurring,
          frequency: transaction.frequency
        })
        .select()
        .single();

      if (error) {
        console.warn('Error adding transaction:', error);
        // Still add locally
        const localTransaction = { ...transaction, id: Date.now() };
        setTransactionsState(prev => [localTransaction, ...prev]);
        return localTransaction;
      }
      setTransactionsState(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      // Add locally as fallback
      const localTransaction = { ...transaction, id: Date.now() };
      setTransactionsState(prev => [localTransaction, ...prev]);
      return localTransaction;
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId) => {
    // Remove locally first for instant feedback
    setTransactionsState(prev => prev.filter(t => t.id !== transactionId));
    
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', user.id);

      if (error) console.warn('Error deleting transaction:', error);
    } catch (err) {
      console.error('Error deleting transaction:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Bulk import transactions
  const bulkImportTransactions = useCallback(async (newTransactions) => {
    if (!user) return;
    setSaving(true);

    try {
      const transactionsToInsert = newTransactions.map(t => ({
        user_id: user.id,
        date: t.date,
        description: t.description,
        vendor: t.vendor || '',
        amount: t.amount,
        type: t.type,
        category: t.category,
        source: t.source || '',
        institution: t.institution || '',
        recurring: t.recurring || false,
        frequency: t.frequency || 'once'
      }));

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select();

      if (error) {
        console.warn('Error importing transactions:', error);
        // Add locally as fallback
        const localTransactions = newTransactions.map((t, i) => ({ ...t, id: Date.now() + i }));
        setTransactionsState(prev => [...localTransactions, ...prev]);
        return localTransactions;
      }
      
      setTransactionsState(prev => [...data, ...prev]);

      // Update last import date
      try {
        await supabase
          .from('user_profiles')
          .upsert({ 
            user_id: user.id,
            last_import_date: new Date().toISOString() 
          }, { onConflict: 'user_id' });
      } catch (e) {
        console.warn('Could not update import date:', e);
      }
      
      setLastImportDateState(new Date());
      return data;
    } catch (err) {
      console.error('Error importing transactions:', err);
      // Add locally as fallback
      const localTransactions = newTransactions.map((t, i) => ({ ...t, id: Date.now() + i }));
      setTransactionsState(prev => [...localTransactions, ...prev]);
      return localTransactions;
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Save bill date
  const addBillDate = useCallback(async (bill) => {
    if (!user) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('bill_dates')
        .insert({
          user_id: user.id,
          name: bill.name,
          amount: bill.amount,
          due_date: bill.dueDate
        })
        .select()
        .single();

      if (error) {
        console.warn('Error adding bill:', error);
        const localBill = { ...bill, id: Date.now() };
        setBillDatesState(prev => [...prev, localBill]);
        return localBill;
      }
      
      setBillDatesState(prev => [...prev, {
        id: data.id,
        name: data.name,
        amount: data.amount,
        dueDate: data.due_date
      }]);
      return data;
    } catch (err) {
      console.error('Error adding bill:', err);
      const localBill = { ...bill, id: Date.now() };
      setBillDatesState(prev => [...prev, localBill]);
      return localBill;
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete bill date
  const deleteBillDate = useCallback(async (billId) => {
    setBillDatesState(prev => prev.filter(b => b.id !== billId));
    
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('bill_dates')
        .delete()
        .eq('id', billId)
        .eq('user_id', user.id);

      if (error) console.warn('Error deleting bill:', error);
    } catch (err) {
      console.error('Error deleting bill:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Save investment
  const addInvestment = useCallback(async (investment) => {
    if (!user) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          type: investment.type,
          account_type: investment.accountType,
          current_value: investment.currentValue,
          target_value: investment.targetValue
        })
        .select()
        .single();

      if (error) {
        console.warn('Error adding investment:', error);
        const localInv = { ...investment, id: Date.now() };
        setInvestmentsState(prev => [...prev, localInv]);
        return localInv;
      }
      
      setInvestmentsState(prev => [...prev, {
        id: data.id,
        type: data.type,
        accountType: data.account_type,
        currentValue: data.current_value,
        targetValue: data.target_value
      }]);
      return data;
    } catch (err) {
      console.error('Error adding investment:', err);
      const localInv = { ...investment, id: Date.now() };
      setInvestmentsState(prev => [...prev, localInv]);
      return localInv;
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Update investment
  const updateInvestment = useCallback(async (investmentId, updates) => {
    setInvestmentsState(prev => prev.map(i => 
      i.id === investmentId ? { ...i, ...updates } : i
    ));
    
    if (!user) return;
    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('investments')
        .update({
          type: updates.type,
          account_type: updates.accountType,
          current_value: updates.currentValue,
          target_value: updates.targetValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', investmentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) console.warn('Error updating investment:', error);
      return data;
    } catch (err) {
      console.error('Error updating investment:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete investment
  const deleteInvestment = useCallback(async (investmentId) => {
    setInvestmentsState(prev => prev.filter(i => i.id !== investmentId));
    
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', investmentId)
        .eq('user_id', user.id);

      if (error) console.warn('Error deleting investment:', error);
    } catch (err) {
      console.error('Error deleting investment:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    // Data
    budgetData,
    billDates,
    transactions,
    investments,
    marketData,
    lastImportDate,
    
    // State
    loading,
    saving,
    error,
    initialized,
    
    // Actions
    setBudgetData,
    setBillDates: setBillDatesState,
    setTransactions: setTransactionsState,
    setInvestments: setInvestmentsState,
    setMarketData: setMarketDataState,
    setLastImportDate: setLastImportDateState,
    
    // CRUD operations
    addTransaction,
    deleteTransaction,
    bulkImportTransactions,
    addBillDate,
    deleteBillDate,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    
    // Refresh
    refreshData: loadUserData,
  };
};
