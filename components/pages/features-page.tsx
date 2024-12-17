'use client';

import { motion } from 'framer-motion';
import { FaChartBar, FaEnvelope, FaFileExport, FaWallet, FaChartLine, FaGlobe } from 'react-icons/fa';

const features = [
  {
    title: 'Smart Expense Tracking',
    description: 'Effortlessly track your expenses with our intuitive interface. Categorize, tag, and manage your spending habits.',
    icon: <FaChartBar className="text-white" />,
    color: 'bg-blue-500'
  },
  {
    title: 'Email Reports',
    description: 'Get detailed expense reports delivered straight to your inbox. Stay informed about your spending patterns.',
    icon: <FaEnvelope className="text-white" />,
    color: 'bg-green-500'
  },
  {
    title: 'Data Export',
    description: 'Export your expense data in various formats. Easy sharing and backup of your financial records.',
    icon: <FaFileExport className="text-white" />,
    color: 'bg-purple-500'
  },
  {
    title: 'Budget Management',
    description: 'Set and track budgets for different categories. Get alerts when you\'re approaching your limits.',
    icon: <FaWallet className="text-white" />,
    color: 'bg-yellow-500'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Visual insights into your spending patterns. Interactive charts and graphs for better financial understanding.',
    icon: <FaChartLine className="text-white" />,
    color: 'bg-red-500'
  },
  {
    title: 'Multi-Currency Support',
    description: 'Track expenses in multiple currencies. Automatic conversion at current exchange rates.',
    icon: <FaGlobe className="text-white" />,
    color: 'bg-indigo-500'
  }
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-blue-600"> Smart Money Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover all the tools you need to take control of your finances
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 74" fill="none">
            <path d="M1440 74V0C1440 0 1082.5 74 720 74C357.5 74 0 0 0 0V74H1440Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group rounded-2xl p-6 bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are already managing their expenses smarter
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </motion.div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        </div>
      </section>
    </div>
  );
}
