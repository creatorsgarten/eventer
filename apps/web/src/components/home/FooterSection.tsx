import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export const FooterSection = () => {
	return (
		<footer className="flex flex-col bg-purple-500 text-white px-6 py-12 w-full h-auto min-h-[500px] box-border w-full md:px-4">
			<div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto mt-12 w-full justify-between items-start md:mt-6">
				<div className="w-full">
					<h2 className="text-2xl font-bold mb-4">Eventer</h2>
					<p className="text-[0.95rem] leading-relaxed mb-8">
						จัดการทุกอีเวนต์ได้ครบ จบในที่เดียว
						<br />
						ลดความยุ่งยากจากการใช้หลายอุปกรณ์ด้วย Eventer
					</p>
					<div className="flex gap-4 text-lg">
						<FaTwitter />
						<FaFacebookF />
						<FaInstagram />
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-8 sm:gap-16 lg:gap-32 w-full lg:justify-end mb-12 lg:mb-0">
					<div>
						<h4 className="mb-6 lg:mb-10 opacity-90 font-light">Company</h4>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							About us
						</Link>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Contact us
						</Link>
					</div>
					<div>
						<h4 className="mb-6 lg:mb-10 opacity-90 font-light">Product</h4>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Features
						</Link>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							News
						</Link>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Support
						</Link>
					</div>
					<div>
						<h4 className="mb-6 lg:mb-10 opacity-90 font-light">Legal</h4>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Privacy Policy
						</Link>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Terms & Conditions
						</Link>
						<Link
							href="#"
							className="block text-white no-underline text-base mb-4 transition-colors duration-300 hover:text-gray-300"
						>
							Return Policy
						</Link>
					</div>
				</div>
			</div>
			<div className="border-t border-white/20 text-center pt-6 text-sm opacity-80 mt-8 w-full">
				© 2024 Copyright, All Right Reserved, Eventer
			</div>
		</footer>
	);
};
