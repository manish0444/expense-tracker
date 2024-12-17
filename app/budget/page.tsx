"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Rename to match potential routing expectations
export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Smart
            <span className="text-blue-600"> Budget Tracking</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Set and manage your budgets with intelligent tracking
          </p>
        </motion.div>
      </section>

      {/* Budget Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-6 flex items-center justify-center text-white text-4xl">
                💰
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Category Budgets</h3>
              <p className="text-gray-600">
                Set specific budgets for different spending categories and track your progress
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg mb-6 flex items-center justify-center text-white text-4xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your spending in real-time and get instant updates on your budget status
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg mb-6 flex items-center justify-center text-white text-4xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Goals</h3>
              <p className="text-gray-600">
                Set and achieve your financial goals with intelligent tracking and recommendations
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Budget Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Try Our Budget Calculator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Income</h3>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your monthly income"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Monthly Expenses</h3>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your monthly expenses"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Calculate Budget
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}