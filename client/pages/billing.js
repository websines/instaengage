import Layout from '../Components/Layout'
import Link from 'next/link'
import { useState } from "react";
import PaypalModal from '../Components/modals/paypal-modal';

const basicText = ['Hello', 'World', 'Monthly']
const YearlyText = ['Hello', 'World', 'Yearly']
const BusinessText = ['Something', 'Here']

export default function BillingPage() {
    const k = 3
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [open, setOpen] = useState(false)
    const [plan, setPlan] = useState('')

    function openModal(){
        setOpen(true)
    }

    return (
        <div>
            <Layout page={"Billing"} number={k}>
            <div className="flex flex-col w-full items-center justify-center pt-10 lg:pt-28 f-f-l">
                <h1 className="text-2xl md:text-6xl xl:text-6xl font-black text-center text-indigo-700 md:leading-tight">
                    You get more than what <br /> you pay for {":) "}
                </h1>
            </div>
            <div className="mx-auto container px-4 xl:px-0 pt-16 lg:pt-36">
                <div className="flex flex-col w-full items-center justify-center f-f-l">
                    <div className="bg-white w-full xl:w-11/12 px-6 py-8 xl:px-16 lg:py-16 shadow-lg">
                        <div className="lg:flex justify-between w-full">
                            <div>
                                <div className="flex w-full justify-between lg:justify-start items-center">
                                    <h1 className="text-color font-black text-3xl lg:text-5xl  lg:mr-8">Monthly</h1>
                                    <button className="w-10 h-10 bg-gray-100 focus:outline-none  flex items-center justify-center rounded-full" onClick={() => setShow1(!show1)}>
                                        {show1 ? (
                                            <svg id="andicators1" xmlns="http://www.w3.org/2000/svg" width={18} height={12} viewBox="0 0 18 12" fill="none">
                                                <path d="M9.00002 4.73399L2.40001 11.334L0.514683 9.44865L9.00002 0.963319L17.4854 9.44865L15.6 11.334L9.00002 4.73399Z" fill="#4A5568" />
                                            </svg>
                                        ) : (
                                            <svg id="andicators" className xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" fill="none">
                                                <path d="M16 17.5626L22.6 10.9626L24.4853 12.848L16 21.3333L7.51465 12.848L9.39998 10.9626L16 17.5626Z" fill="#4A5568" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="pt-3">
                                    <p className="text-2xl f-f-r lg:w-10/12">For personal use that need advanced sharing &amp; reporting.</p>
                                </div>
                                {show1 && (
                                    <div id="listHolder" className=" pt-12">
                                        {basicText.map((txt) => (
                                            <div className="flex items-center space-y-3">
                                            <div className="pr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12L10 17L20 7" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="text-2xl f-f-r">{`${txt}`}</div>
                                        </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="pt-8 lg:pt-0 flex items-center flex-col">
                                <h1 className="f-f-l font-black text-color text-4xl lg:text-7xl">$20/mo</h1>
                                <button className="rounded py-4 px-4 xl:px-10 bg-gray-100 hover:bg-gray-200 transition ease-in-out duration-200 focus:outline-none f-f-r text-xl font-bold text-color mt-7" onClick={() => {openModal(); setPlan('P-8UD12865C25170016MCKCGOY')}}>Start Free Trial</button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white w-full xl:w-11/12 px-6 py-8 xl:px-16 lg:py-16 mt-12 shadow-lg">
                        <div className="lg:flex justify-between w-full">
                            <div>
                                <div className="flex w-full justify-between lg:justify-start items-center">
                                    <h1 className="text-color font-black text-3xl lg:text-5xl  lg:mr-8">Yearly</h1>

                                    <button className="w-10 h-10 bg-gray-100 focus:outline-none  flex items-center justify-center rounded-full" onClick={() => setShow(!show)}>
                                        {show ? (
                                            <svg id="andicators1" xmlns="http://www.w3.org/2000/svg" width={18} height={12} viewBox="0 0 18 12" fill="none">
                                                <path d="M9.00002 4.73399L2.40001 11.334L0.514683 9.44865L9.00002 0.963319L17.4854 9.44865L15.6 11.334L9.00002 4.73399Z" fill="#4A5568" />
                                            </svg>
                                        ) : (
                                            <svg id="andicators" className xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" fill="none">
                                                <path d="M16 17.5626L22.6 10.9626L24.4853 12.848L16 21.3333L7.51465 12.848L9.39998 10.9626L16 17.5626Z" fill="#4A5568" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="pt-3">
                                    <p className="text-2xl f-f-r lg:w-10/12">For teams that need advanced sharing &amp; reporting.</p>
                                </div>
                                {show && (
                                    <div id="listHolder" className=" pt-12">
                                        {BusinessText.map((txt) => (
                                            <div className="flex items-center space-y-3">
                                            <div className="pr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12L10 17L20 7" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="text-2xl f-f-r">{`${txt}`}</div>
                                        </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="pt-8 lg:pt-0 flex items-center flex-col">
                                <h1 className="f-f-l font-black text-color text-4xl lg:text-7xl">$160/yr</h1>
                                <button className="rounded py-4 px-4 xl:px-10 bg-indigo-700 hover:bg-indigo-800 transition ease-in-out duration-200 f-f-r text-xl font-bold text-white mt-7" onClick={() => {openModal(); setPlan('P-1N2104435T520134RMCKCJQY')}}>Start Free Trial</button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white w-full xl:w-11/12 px-6 py-8 xl:px-16 lg:py-16 mt-12 shadow-lg">
                        <div className="lg:flex justify-between w-full">
                            <div>
                                <div className="flex w-full justify-between lg:justify-start items-center">
                                    <h1 className="text-color font-black text-3xl lg:text-5xl  lg:mr-8">Business</h1>
                                    <button className="w-10 h-10 bg-gray-100 focus:outline-none  flex items-center justify-center rounded-full" onClick={() => setShow2(!show2)}>
                                        {show2 ? (
                                            <svg id="andicators1" xmlns="http://www.w3.org/2000/svg" width={18} height={12} viewBox="0 0 18 12" fill="none">
                                                <path d="M9.00002 4.73399L2.40001 11.334L0.514683 9.44865L9.00002 0.963319L17.4854 9.44865L15.6 11.334L9.00002 4.73399Z" fill="#4A5568" />
                                            </svg>
                                        ) : (
                                            <svg id="andicators" className xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32" fill="none">
                                                <path d="M16 17.5626L22.6 10.9626L24.4853 12.848L16 21.3333L7.51465 12.848L9.39998 10.9626L16 17.5626Z" fill="#4A5568" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="pt-3">
                                    <p className="text-2xl f-f-r lg:w-10/12">For personal use that need advanced sharing &amp; reporting.</p>
                                </div>
                                {show2 && (
                                    <div id="listHolder" className=" pt-12">
                                       {YearlyText.map((txt) => (
                                            <div className="flex items-center space-y-3">
                                            <div className="pr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12L10 17L20 7" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="text-2xl f-f-r">{`${txt}`}</div>
                                        </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="pt-8 lg:pt-0 flex items-center flex-col">
                                <h1 className="f-f-l font-black text-color text-4xl lg:text-6xl">Custom</h1>
                                <Link href="/contact-us">
                                <a className="rounded py-4 px-4 xl:px-10 bg-gray-100 focus:outline-none f-f-r text-xl font-bold text-color mt-7">Contact Us</a>
                                </Link>  
                            </div>
                        </div>
                    </div>
                    <div className="mb-16">
                        <p className="text-xl f-f-r pt-10 text-center">Aren’t completely satisfied? Get your money back, no</p>
                        <p className="text-xl f-f-r  text-center">questions asked</p>
                    </div>
                </div>
            </div>
            <PaypalModal open={open} closeModal={() => setOpen(false)} plan={plan}/>
            </Layout>
        </div>
    );
}

