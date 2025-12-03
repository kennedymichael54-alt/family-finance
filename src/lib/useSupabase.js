// ============================================================================
// SUPABASE REACT HOOKS
// ProsperNest - Family Finance Dashboard
// Custom hooks for auth and data management
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUser } from './supabaseClient';
import {
  loadAllUserData,
  updateProfile,
  updateUserSettings,
  getTransactions,
  bulkInsertTransactions,
  clearAllTransactions,
  getRetirementAccounts,
  getRetirementSnapshots,
  getBills,
  addBill,
  updateBill,
  deleteBill,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getBudgets,
  setBudget,
  migrateDefaultDataToDatabase
} from './supabaseHelpers';

// ============================================================================
// AUTH HOOK
// ============================================================================

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email
  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  };

  // Sign in with email
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  // Sign in with OAuth (Google, GitHub, etc.)
  const signInWithOAuth = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Reset password
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  };

  // Update password
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user
  };
}

// ============================================================================
// DATA HOOK - Manages all user data with Supabase
// ============================================================================

export function useSupabaseData(userId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    profile: null,
    settings: null,
    transactions: [],
    retirementAccounts: [],
    retirementSnapshots: [],
    bills: [],
    goals: [],
    tasks: [],
    budgets: []
  });
  const [lastSync, setLastSync] = useState(null);

  // Load all data on mount or when userId changes
  const loadData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allData = await loadAllUserData(userId);
      setData(allData);
      setLastSync(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh specific data type
  const refresh = useCallback(async (dataType = 'all') => {
    if (!userId) return;

    try {
      if (dataType === 'all') {
        await loadData();
      } else {
        switch (dataType) {
          case 'transactions':
            const transactions = await getTransactions(userId);
            setData(prev => ({ ...prev, transactions }));
            break;
          case 'retirement':
            const [retirementAccounts, retirementSnapshots] = await Promise.all([
              getRetirementAccounts(userId),
              getRetirementSnapshots(userId)
            ]);
            setData(prev => ({ ...prev, retirementAccounts, retirementSnapshots }));
            break;
          case 'bills':
            const bills = await getBills(userId);
            setData(prev => ({ ...prev, bills }));
            break;
          case 'goals':
            const goals = await getGoals(userId);
            setData(prev => ({ ...prev, goals }));
            break;
          case 'tasks':
            const tasks = await getTasks(userId);
            setData(prev => ({ ...prev, tasks }));
            break;
          case 'budgets':
            const budgets = await getBudgets(userId);
            setData(prev => ({ ...prev, budgets }));
            break;
        }
        setLastSync(new Date());
      }
    } catch (err) {
      console.error(`Error refreshing ${dataType}:`, err);
      setError(err.message);
    }
  }, [userId, loadData]);

  // Profile operations
  const saveProfile = useCallback(async (profileData) => {
    if (!userId) return;
    try {
      const updated = await updateProfile(userId, profileData);
      setData(prev => ({ ...prev, profile: updated }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Settings operations
  const saveSettings = useCallback(async (settingsData) => {
    if (!userId) return;
    try {
      const updated = await updateUserSettings(userId, settingsData);
      setData(prev => ({ ...prev, settings: updated }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Transaction operations
  const importTransactions = useCallback(async (transactions) => {
    if (!userId) return;
    try {
      await bulkInsertTransactions(userId, transactions);
      await refresh('transactions');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, refresh]);

  const clearTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      await clearAllTransactions(userId);
      setData(prev => ({ ...prev, transactions: [] }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Bill operations
  const createBill = useCallback(async (bill) => {
    if (!userId) return;
    try {
      const newBill = await addBill(userId, bill);
      setData(prev => ({ ...prev, bills: [...prev.bills, newBill] }));
      return newBill;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  const editBill = useCallback(async (billId, updates) => {
    try {
      const updated = await updateBill(billId, updates);
      setData(prev => ({
        ...prev,
        bills: prev.bills.map(b => b.id === billId ? updated : b)
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeBill = useCallback(async (billId) => {
    try {
      await deleteBill(billId);
      setData(prev => ({
        ...prev,
        bills: prev.bills.filter(b => b.id !== billId)
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Goal operations
  const createGoal = useCallback(async (goal) => {
    if (!userId) return;
    try {
      const newGoal = await addGoal(userId, goal);
      setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
      return newGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  const editGoal = useCallback(async (goalId, updates) => {
    try {
      const updated = await updateGoal(goalId, updates);
      setData(prev => ({
        ...prev,
        goals: prev.goals.map(g => g.id === goalId ? updated : g)
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeGoal = useCallback(async (goalId) => {
    try {
      await deleteGoal(goalId);
      setData(prev => ({
        ...prev,
        goals: prev.goals.filter(g => g.id !== goalId)
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Task operations
  const createTask = useCallback(async (task) => {
    if (!userId) return;
    try {
      const newTask = await addTask(userId, task);
      setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  const editTask = useCallback(async (taskId, updates) => {
    try {
      const updated = await updateTask(taskId, updates);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? updated : t)
      }));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const completeTask = useCallback(async (taskId) => {
    return editTask(taskId, { is_completed: true });
  }, [editTask]);

  const removeTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Budget operations
  const saveBudget = useCallback(async (budget) => {
    if (!userId) return;
    try {
      const updated = await setBudget(userId, budget);
      setData(prev => {
        const existing = prev.budgets.findIndex(b => b.category === budget.category);
        if (existing >= 0) {
          const newBudgets = [...prev.budgets];
          newBudgets[existing] = updated;
          return { ...prev, budgets: newBudgets };
        }
        return { ...prev, budgets: [...prev.budgets, updated] };
      });
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Migrate default data
  const migrateData = useCallback(async (defaultTransactions, defaultRetirementData) => {
    if (!userId) return;
    try {
      setLoading(true);
      await migrateDefaultDataToDatabase(userId, defaultTransactions, defaultRetirementData);
      await loadData();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, loadData]);

  return {
    loading,
    error,
    lastSync,
    
    // Data
    profile: data.profile,
    settings: data.settings,
    transactions: data.transactions,
    retirementAccounts: data.retirementAccounts,
    retirementSnapshots: data.retirementSnapshots,
    bills: data.bills,
    goals: data.goals,
    tasks: data.tasks,
    budgets: data.budgets,
    
    // Operations
    refresh,
    saveProfile,
    saveSettings,
    importTransactions,
    clearTransactions,
    createBill,
    editBill,
    removeBill,
    createGoal,
    editGoal,
    removeGoal,
    createTask,
    editTask,
    completeTask,
    removeTask,
    saveBudget,
    migrateData
  };
}

// ============================================================================
// REAL-TIME SUBSCRIPTION HOOK
// Listen for real-time changes to data
// ============================================================================

export function useRealtimeSubscription(userId, table, callback) {
  useEffect(() => {
    if (!userId || !table) return;

    const subscription = supabase
      .channel(`${table}_changes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log(`📡 Realtime ${table} change:`, payload.eventType);
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, table, callback]);
}

export default useSupabaseAuth;
