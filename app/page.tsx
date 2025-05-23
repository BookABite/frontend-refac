'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { HomeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
            <nav className="w-full p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                        priority
                    />
                    <h1 className="font-bold text-xl text-gray-800 dark:text-white">BOOKABITE</h1>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-12">
                {/* Left Section - Text */}
                <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                            Simplifique suas reservas
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto md:mx-0">
                            Gerencie mesas, clientes e reservas em um só lugar. A solução completa
                            para seu restaurante ou bar.
                        </p>
                        <Link href="/login">
                            <Button variant="destructive" className="w-[200px] group">
                                <HomeIcon className="group-hover:animate-bounce" />
                                Começar
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Section - Image */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative w-full h-64 md:h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-3 p-4 w-full">
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                                <div className="bg-rose-100 dark:bg-gray-700 h-16 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-rose-100/80 to-transparent dark:from-rose-900/20 dark:to-transparent pointer-events-none"></div>
                    </div>
                </motion.div>
            </main>

            {/* Features */}
            <section className="py-12 px-4 md:px-8 bg-white dark:bg-gray-800/30 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="p-6 rounded-lg bg-red-50 dark:bg-gray-800 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="w-12 h-12 bg-rose-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-rose-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                                Reservas Simplificadas
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sistema intuitivo para gerenciar todas as reservas do seu
                                estabelecimento
                            </p>
                        </motion.div>

                        <motion.div
                            className="p-6 rounded-lg bg-red-50 dark:bg-gray-800 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="w-12 h-12 bg-rose-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-rose-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                                Gestão de Clientes
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Mantenha os dados dos seus clientes organizados e maximize o
                                relacionamento
                            </p>
                        </motion.div>

                        <motion.div
                            className="p-6 rounded-lg bg-red-50 dark:bg-gray-800 shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <div className="w-12 h-12 bg-rose-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-rose-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                                Relatórios Detalhados
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Análise completa do desempenho do seu negócio para melhores decisões
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-6 px-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
                        © 2025 BOOKABITE. Todos os direitos reservados.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                            <span className="sr-only">Twitter</span>
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                            <span className="sr-only">Facebook</span>
                            <svg
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
