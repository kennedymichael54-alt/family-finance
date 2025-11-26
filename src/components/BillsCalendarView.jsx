import React, { useState } from 'react';

const BillsCalendarView = () => {
  // Sample bills data
  const [bills, setBills] = useState([
    { id: 1, name: 'Rent', amount: 1200, dueDate: '2024-01-01', status: 'paid', category: 'Housing', recurring: 'monthly' },
    { id: 2, name: 'Electric', amount: 85, dueDate: '2024-01-05', status: 'upcoming', category: 'Utilities', recurring: 'monthly' },
    { id: 3, name: 'Internet', amount: 60, dueDate: '2024-01-10', status: 'upcoming', category: 'Utilities', recurring: 'monthly' },
    { id: 4, name: 'Car Insurance', amount: 150, dueDate: '2024-01-15', status: 'overdue', category: 'Insurance', recurring: 'monthly' },
    { id: 5, name: 'Phone', amount: 75, dueDate: '2024-01-20', status: 'upcoming', category: 'Utilities', recurring: 'monthly' },
  ]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);

  // Calendar navigation
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get bills for a specific date
  const getBillsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bills.filter(bill => bill.dueDate === dateStr);
  };

  // Mark bill as paid
  const markBillPaid = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'paid' }
        : bill
    ));
    setShowBillModal(false);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate summary stats
  const today = new Date();
  const upcomingBills = bills.filter(b => b.status === 'upcoming');
  const overdueBills = bills.filter(b => b.status === 'overdue');
  const paidBills = bills.filter(b => b.status === 'paid');
  const totalDue = upcomingBills.reduce((sum, b) => sum + b.amount, 0) + 
                   overdueBills.reduce((sum, b) => sum + b.amount, 0);

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayBills = getBillsForDate(day);
    const isToday = today.getDate() === day && 
                    today.getMonth() === currentDate.getMonth() && 
                    today.getFullYear() === currentDate.getFullYear();

    calendarDays.push(
      <div
        key={day}
        className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
          isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-semibold ${
            isToday ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </span>
          {isToday && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          {dayBills.map(bill => (
            <button
              key={bill.id}
              onClick={() => {
                setSelectedBill(bill);
                setShowBillModal(true);
              }}
              className={`w-full text-left text-xs p-1 rounded flex items-center gap-1 ${
                bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              } hover:opacity-80 transition-opacity`}
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(bill.status)}`} />
              <span className="truncate flex-1">{bill.name}</span>
              <span className="font-semibold">${bill.amount}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bills Calendar</h1>
        <p className="text-gray-600">Track and manage your recurring bills</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Upcoming Bills</p>
              <p className="text-2xl font-bold text-blue-700">{upcomingBills.length}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{overdueBills.length}</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Paid This Month</p>
              <p className="text-2xl font-bold text-green-700">{paidBills.length}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Due</p>
              <p className="text-2xl font-bold text-orange-700">
                ${totalDue.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💵</div>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={goToToday}
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
              >
                Today
              </button>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-700">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-700">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-700">Paid</span>
          </div>
        </div>
      </div>

      {/* Bill Detail Modal */}
      {showBillModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedBill.name}</h2>
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full border ${getStatusBadge(selectedBill.status)}`}>
                  {selectedBill.status.charAt(0).toUpperCase() + selectedBill.status.slice(1)}
                </span>
              </div>
              <button
                onClick={() => setShowBillModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-gray-800">
                  ${selectedBill.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium text-gray-800">
                  {new Date(selectedBill.dueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-800">{selectedBill.category}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Frequency</span>
                <span className="font-medium text-gray-800 capitalize">{selectedBill.recurring}</span>
              </div>

              {selectedBill.status !== 'paid' && (
                <button
                  onClick={() => markBillPaid(selectedBill.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Paid
                </button>
              )}

              {selectedBill.status === 'paid' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-800 font-medium">This bill has been paid</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsCalendarView;
