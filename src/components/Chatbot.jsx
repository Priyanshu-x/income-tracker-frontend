import React, { useState, useRef, useEffect } from 'react';
import { useTransaction } from '../context/TransactionContext';
import { useTheme } from '../context/ThemeContext';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { transactions, loading, error } = useTransaction();
  const { isDarkMode } = useTheme();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    // Simulate AI response based on transaction data
    const botResponse = await getBotResponse(input, transactions);
    setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
  };

  const getBotResponse = async (query, transactionsData) => {
    const lowerQuery = query.toLowerCase();

    if (loading) return "I'm still loading your transaction data. Please wait a moment.";
    if (error) return "I'm having trouble accessing your transaction data. Please check your connection.";
    if (transactionsData.length === 0) return "You don't have any transactions yet. Add some to get insights!";

    // Basic analysis functions
    const getTotalIncome = () => transactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
    const getHighestIncome = () => Math.max(...transactionsData.map(t => Number(t.amount)));
    const getLowestIncome = () => Math.min(...transactionsData.map(t => Number(t.amount)));
    const getAverageIncome = () => getTotalIncome() / transactionsData.length;
    const getIncomeByCategory = () => {
      const categoryMap = {};
      transactionsData.forEach(t => {
        const amount = Number(t.amount);
        if (!isNaN(amount) && amount > 0) {
          const category = t.category || "Other";
          categoryMap[category] = (categoryMap[category] || 0) + amount;
        }
      });
      return Object.entries(categoryMap).map(([category, income]) => `${category}: ₹${income.toFixed(2)}`).join(', ');
    };

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hello! How can I help you with your income data today?";
    } else if (lowerQuery.includes('total income')) {
      return `Your total recorded income is ₹${getTotalIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('highest income')) {
      return `Your highest single income amount is ₹${getHighestIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('lowest income')) {
      return `Your lowest single income amount is ₹${getLowestIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('average income')) {
      return `Your average income per transaction is ₹${getAverageIncome().toFixed(2)}.`;
    } else if (lowerQuery.includes('income by category')) {
      const categories = getIncomeByCategory();
      return `Here's your income by category: ${categories}.`;
    } else if (lowerQuery.includes('all transactions')) {
      const transactionList = transactionsData.map(t => `${t.description} (₹${Number(t.amount).toFixed(2)}) on ${new Date(t.date).toLocaleDateString()}`).join('; ');
      return `Here are all your transactions: ${transactionList}.`;
    } else if (lowerQuery.includes('thank you') || lowerQuery.includes('thanks')) {
      return "You're welcome! Let me know if you have more questions.";
    } else {
      return "I can help you with questions about your total income, highest/lowest/average income, income by category, or list all transactions. What would you like to know?";
    }
  };

  const chatContainerClasses = `fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col transition-all duration-300 z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`;
  const chatHeaderClasses = `p-4 bg-indigo-600 dark:bg-indigo-800 text-white rounded-t-lg flex justify-between items-center`;
  const messageContainerClasses = `flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-b-lg`;
  const messageBubbleClasses = (sender) => `mb-2 p-2 rounded-lg max-w-[80%] ${sender === 'user' ? 'bg-indigo-500 text-white self-end ml-auto' : `${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} ${isDarkMode ? 'text-white' : 'text-gray-900'} self-start mr-auto`}`;
  const inputContainerClasses = `p-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} flex`;
  const inputFieldClasses = `flex-1 p-2 rounded-l-lg border ${isDarkMode ? 'bg-gray-900 border-gray-600 text-white' : 'border-gray-300'} focus:outline-none`;
  const sendButtonClasses = `p-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-900 transition-colors`;
  const toggleButtonClasses = `fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:bg-indigo-800 dark:hover:bg-indigo-900 transition-colors z-50`;

  return (
    <>
      {isOpen && (
        <div className={chatContainerClasses}>
          <div className={chatHeaderClasses}>
            <h3 className="text-lg font-semibold">Income Bot</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={messageContainerClasses}>
            {messages.map((msg, index) => (
              <div key={index} className={messageBubbleClasses(msg.sender)}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={inputContainerClasses}>
            <input
              type="text"
              className={inputFieldClasses}
              placeholder="Ask about your income..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} className={sendButtonClasses}>
              Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={toggleButtonClasses}>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}