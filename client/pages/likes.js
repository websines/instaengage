import Layout from '../Components/Layout'
import { useState, useContext, useEffect } from "react";
import { Switch } from "@headlessui/react";
import {AuthContext, MiscContext} from '../context/AuthContext';
import authAxios from '../utils/axios';

export default function LikesPage() {
    const {user} = useContext(AuthContext)
    const {insta} = useContext(MiscContext)
    const [uname, setUname] = useState('')
    const [enabled, setEnabled] = useState(true);
    const [enabledOne, setEnabledOne] = useState(true);
    const [done, setDone] = useState(false)

    const k = 1

    useEffect(() => {
        if (user != null && user.is_allowed_to_like == false){
            setEnabled(false)
        }
        if (user != null && user.excluded_account != ""){
            setEnabledOne(false)
        }
    }, [])


    let dataOne = {
        is_allowed_to_like: enabled
    }

    let dataTwo = {
        excluded_account: uname
    }
    async function handleSubmit(e){
        e.preventDefault()
        // await authAxios.post('/like/allow', JSON.stringify(dataOne))
        // await authAxios.post('/like/exclude', JSON.stringify(dataTwo)).then((res) => {
        //     if (res.status == 200){
        //         setDone(true)
        //     }
        // })
        setDone(true)
    }

    return (
        <div>
            <Layout page={"Likes"} number={k}>
            <div className="mx-auto container px-4 xl:px-0 pt-16 lg:pt-8">
                <div className="flex flex-col w-full items-center justify-center f-f-l">
                    <div className="bg-white w-full xl:w-11/12 px-6 py-8 xl:px-16 lg:py-16 shadow-lg rounded">
                        <div className="lg:flex justify-between w-full">
                            <div>
                                <div className="flex w-full justify-between lg:justify-start items-center">
                                    <h1 className="text-color font-black text-3xl lg:text-4xl  lg:mr-8">Do not Like with this account</h1>
                                </div>
                                <div className="pt-3">
                                    <p className="text-2xl f-f-r lg:w-10/12">For personal use that need advanced sharing &amp; reporting.</p>
                                </div>
                            </div>
                            <div className="pt-8 lg:pt-0 flex items-center flex-col space-y-4">
                                
                                <Switch
                                checked={enabled}
                                onChange={() => setEnabled(!enabled)}
                                className={`${enabled ? "bg-gray-900" : "bg-gray-800"}
                                  relative inline-flex flex-shrink-0 h-9 w-16 border-2 mt-4 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-opacity-20`}
                              >
                                <span className="sr-only">Use setting</span>
                                <span
                                  aria-hidden="true"
                                  className={`${enabled ? "translate-x-7 bg-purple-700" : "translate-x-0"}
                                    pointer-events-none inline-block h-8 w-8 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 `}
                                />
                              </Switch>
                              <p className={`${enabled ? 'text-green-500' : 'text-purple-700'} text-sm tracking-tight font-medium`}>{enabled ? 'Active' : 'Excluded'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white w-full xl:w-11/12 px-6 py-8 xl:px-16 lg:py-16 shadow-lg rounded">
                        <div className="lg:flex justify-between w-full">
                            <div>
                                <div className="flex w-full justify-between lg:justify-start items-center">
                                    <h1 className="text-color font-black text-3xl lg:text-4xl  lg:mr-8">Do not like <span className="text-indigo-600">Posts</span> from this account</h1>
                                </div>
                                <div className="pt-3">
                                    <p className="text-2xl f-f-r lg:w-10/12">For personal use that need advanced sharing &amp; reporting.</p>
                                </div>
                            </div>
                            <div className="pt-8 lg:pt-0 flex items-center flex-col space-y-4">
                                <Switch
                                checked={enabledOne}
                                onChange={setEnabledOne}
                                className={`${enabledOne ? "bg-gray-900" : "bg-gray-800"}
                                  relative inline-flex flex-shrink-0 h-9 w-16 mt-4 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 bg-opacity-20`}
                              >
                                <span className="sr-only">Use setting</span>
                                <span
                                  aria-hidden="true"
                                  className={`${enabledOne ? "translate-x-7 bg-purple-700" : "translate-x-0"}
                                    pointer-events-none inline-block h-8 w-8 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 `}
                                />
                              </Switch>
                              <p className={`${enabledOne ? 'text-green-500' : 'text-purple-700'} text-sm tracking-tight font-medium`}>{enabledOne ? 'Active' : 'Excluded'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-100 w-full xl:w-11/12 px-6 py-4 xl:px-16 lg:py-4 shadow-lg rounded mb-16">
                        <div className="flex justify-end w-full space-x-2">
                            <button onClick={handleSubmit} className="text-white px-6 py-2.5 rounded bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200">
                              Save
                            </button>
                            {done ? (
                                <div>
                                    <p className="text-sm text-indigo-600 tracking-tight">
                                        Updated!
                                    </p>
                                </div>
                            ): ('')}
                        </div>
                        </div>
                    </div>
                    </div>
            </Layout>
        </div>


    )
}
