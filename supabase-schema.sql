-- =============================================
-- FAMILY FINANCE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USER PROFILES TABLE
-- Stores user settings and budget data
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    budget_data JSONB DEFAULT '{"income": [], "expenses": []}',
    market_data JSONB DEFAULT '{"dow": {"value": 0, "change": 0}, "sp500": {"value": 0, "change": 0}, "nasdaq": {"value": 0, "change": 0}}',
    last_import_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. TRANSACTIONS TABLE
-- Stores all user transactions
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    vendor TEXT DEFAULT '',
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT DEFAULT '',
    source TEXT DEFAULT '',
    institution TEXT DEFAULT '',
    recurring BOOLEAN DEFAULT FALSE,
    frequency TEXT DEFAULT 'once',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. BILL DATES TABLE
-- Stores recurring bill reminders
-- =============================================
CREATE TABLE IF NOT EXISTS bill_dates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. INVESTMENTS TABLE
-- Stores retirement and investment accounts
-- =============================================
CREATE TABLE IF NOT EXISTS investments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    account_type TEXT NOT NULL,
    current_value DECIMAL(14, 2) DEFAULT 0,
    target_value DECIMAL(14, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. NET WORTH ASSETS TABLE (for NetWorthDashboard)
-- =============================================
CREATE TABLE IF NOT EXISTS net_worth_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    value DECIMAL(14, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. NET WORTH LIABILITIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS net_worth_liabilities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    value DECIMAL(14, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. FINANCIAL GOALS TABLE (for GoalsTracker)
-- =============================================
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(14, 2) NOT NULL,
    current_amount DECIMAL(14, 2) DEFAULT 0,
    target_date DATE,
    category TEXT DEFAULT 'savings',
    priority TEXT DEFAULT 'medium',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_bill_dates_user_id ON bill_dates(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_net_worth_assets_user_id ON net_worth_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_net_worth_liabilities_user_id ON net_worth_liabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_user_id ON financial_goals(user_id);

-- =============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- This ensures users can only see their own data
-- =============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE net_worth_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE net_worth_liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- Each user can only CRUD their own data
-- =============================================

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Bill Dates Policies
CREATE POLICY "Users can view own bills" ON bill_dates
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own bills" ON bill_dates
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own bills" ON bill_dates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills" ON bill_dates
    FOR DELETE USING (auth.uid() = user_id);

-- Investments Policies
CREATE POLICY "Users can view own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own investments" ON investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own investments" ON investments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments" ON investments
    FOR DELETE USING (auth.uid() = user_id);

-- Net Worth Assets Policies
CREATE POLICY "Users can view own assets" ON net_worth_assets
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own assets" ON net_worth_assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own assets" ON net_worth_assets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets" ON net_worth_assets
    FOR DELETE USING (auth.uid() = user_id);

-- Net Worth Liabilities Policies
CREATE POLICY "Users can view own liabilities" ON net_worth_liabilities
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own liabilities" ON net_worth_liabilities
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own liabilities" ON net_worth_liabilities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own liabilities" ON net_worth_liabilities
    FOR DELETE USING (auth.uid() = user_id);

-- Financial Goals Policies
CREATE POLICY "Users can view own goals" ON financial_goals
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own goals" ON financial_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own goals" ON financial_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON financial_goals
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTION: Auto-create user profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DONE! Your database is ready.
-- =============================================
