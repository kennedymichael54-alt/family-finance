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

  // User data states
  const [budgetData, setBudgetData] = useState(defaultBudgetData);
  const [billDates, setBillDates] = useState(defaultBillDates);
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [investments, setInvestments] = useState(defaultInvestments);
  const [marketData, setMarketData] = useState(defaultMarketData);
  const [lastImportDate, setLastImportDate] = useState(null);

  // Load user data from Supabase
  const loadUserData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load user profile/settings
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (new user)
        throw profileError;
      }

      // If user exists, load their data
      if (profile) {
        setBudgetData(profile.budget_data || defaultBudgetData);
        setMarketData(profile.market_data || defaultMarketData);
        setLastImportDate(profile.last_import_date ? new Date(profile.last_import_date) : null);
      } else {
        // Create profile for new user
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            budget_data: defaultBudgetData,
            market_data: defaultMarketData
          });
        if (insertError) throw insertError;
      }

      // Load transactions
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (transError) throw transError;
      setTransactions(transactionsData || []);

      // Load bill dates
      const { data: billsData, error: billsError } = await supabase
        .from('bill_dates')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (billsError) throw billsError;
      setBillDates(billsData?.map(b => ({
        id: b.id,
        name: b.name,
        amount: b.amount,
        dueDate: b.due_date
      })) || []);

      // Load investments
      const { data: investmentsData, error: invError } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id);

      if (invError) throw invError;
      setInvestments(investmentsData?.map(i => ({
        id: i.id,
        type: i.type,
        accountType: i.account_type,
        currentValue: i.current_value,
        targetValue: i.target_value
      })) || []);

    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Save budget data
  const saveBudgetData = useCallback(async (newBudgetData) => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ budget_data: newBudgetData, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      
      if (error) throw error;
      setBudgetData(newBudgetData);
    } catch (err) {
      console.error('Error saving budget data:', err);
      setError(err.message);
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

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete transaction
  const deleteTransaction = useCallback(async (transactionId) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', user.id);

      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message);
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

      if (error) throw error;
      setTransactions(prev => [...data, ...prev]);

      // Update last import date
      await supabase
        .from('user_profiles')
        .update({ last_import_date: new Date().toISOString() })
        .eq('user_id', user.id);
      
      setLastImportDate(new Date());
      return data;
    } catch (err) {
      console.error('Error importing transactions:', err);
      setError(err.message);
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

      if (error) throw error;
      setBillDates(prev => [...prev, {
        id: data.id,
        name: data.name,
        amount: data.amount,
        dueDate: data.due_date
      }]);
      return data;
    } catch (err) {
      console.error('Error adding bill:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete bill date
  const deleteBillDate = useCallback(async (billId) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('bill_dates')
        .delete()
        .eq('id', billId)
        .eq('user_id', user.id);

      if (error) throw error;
      setBillDates(prev => prev.filter(b => b.id !== billId));
    } catch (err) {
      console.error('Error deleting bill:', err);
      setError(err.message);
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

      if (error) throw error;
      setInvestments(prev => [...prev, {
        id: data.id,
        type: data.type,
        accountType: data.account_type,
        currentValue: data.current_value,
        targetValue: data.target_value
      }]);
      return data;
    } catch (err) {
      console.error('Error adding investment:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Update investment
  const updateInvestment = useCallback(async (investmentId, updates) => {
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

      if (error) throw error;
      setInvestments(prev => prev.map(i => 
        i.id === investmentId 
          ? { ...i, ...updates }
          : i
      ));
      return data;
    } catch (err) {
      console.error('Error updating investment:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [user]);

  // Delete investment
  const deleteInvestment = useCallback(async (investmentId) => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', investmentId)
        .eq('user_id', user.id);

      if (error) throw error;
      setInvestments(prev => prev.filter(i => i.id !== investmentId));
    } catch (err) {
      console.error('Error deleting investment:', err);
      setError(err.message);
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
    
    // Actions
    setBudgetData: saveBudgetData,
    setBillDates,
    setTransactions,
    setInvestments,
    setMarketData,
    setLastImportDate,
    
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
