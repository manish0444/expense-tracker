'use client';

import { motion } from 'framer-motion';

export default function AnalyticsPage() {
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
            Powerful
            <span className="text-blue-600"> Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Visualize your spending patterns and make informed decisions
          </p>
        </motion.div>
      </section>

      {/* Analytics Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Spending Trends</h3>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                {/* Add chart component here */}
              </div>
              <p className="text-gray-600">
                Track your spending patterns over time with interactive charts
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Category Analysis</h3>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                {/* Add chart component here */}
              </div>
              <p className="text-gray-600">
                See how your spending breaks down across different categories
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Progress</h3>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                {/* Add chart component here */}
              </div>
              <p className="text-gray-600">
                Monitor your progress towards budget goals in real-time
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Advanced Analytics Features</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Reports</h3>
              <p className="text-gray-600">
                Create customized reports with the metrics that matter most to you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Predictive Analysis</h3>
              <p className="text-gray-600">
                Get insights into future spending patterns based on historical data
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
