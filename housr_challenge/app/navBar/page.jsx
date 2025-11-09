"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	// Navigation items array
	const navItems = [
		{ name: "Housr Prize", href: "/HousrCherryPage" },
		{ name: "Sponsors", href: "/sponsors" },
		{ name: "Payments", href: "/payments" },
		{ name: "Rewards", href: "/rewards" },
		{ name: "Account", href: "/account" },
	];

	return (
		<nav className="w-full bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/account"
						className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
					>
						<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
							<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
						</svg>
						<span className="font-bold text-xl">Housr Cherry</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{navItems.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
							>
								{item.name}
							</Link>
						))}
					</div>

					{/* Desktop Login Button
					<div className="hidden md:block">
						<Link href="/LoginPage">
							<button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
								Login
							</button>
						</Link>
					</div> */}

					{/* Mobile Menu Button */}
					<button
						onClick={toggleMobileMenu}
						className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
						type="button"
						aria-label="Toggle menu"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							{isMobileMenuOpen ? (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							) : (
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-gray-100 bg-white">
					<div className="px-4 py-3 space-y-1">
						{navItems.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
							>
								{item.name}
							</Link>
						))}
						<Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
							<button className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
								Login
							</button>
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}