'use client';

import { motion } from 'framer-motion';

export default function AIFeaturesPage() {
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
            AI-Powered
            <span className="text-blue-600"> Expense Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let artificial intelligence handle your expense tracking
          </p>
        </motion.div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Smart Categorization</h2>
              <p className="text-lg text-gray-600">
                Our AI automatically categorizes your expenses based on transaction descriptions,
                learning from your patterns to become more accurate over time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">Spending Insights</h2>
              <p className="text-lg text-gray-600">
                Get personalized insights about your spending habits and recommendations
                for better financial management.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-12">See AI in Action</h2>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Add interactive demo content here */}
            <p className="text-gray-600">Interactive AI demo coming soon...</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
