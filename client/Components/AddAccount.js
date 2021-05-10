import {useState, useRef} from 'react'
import authAxios from '../utils/axios';

export default function AddAccount({done}) {
    const [submitted, setSubmitted] = useState(false)
    const [loginError, setLoginError] = useState(false)

    let form = useRef(null);
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true)
        const form_data = new FormData(form.current);
        let payload = {};
        form_data.forEach(function (value, key) {
            payload[key] = value;
        });
        authAxios.post('/login/insta', payload).then((res) => {
            if(res.status == 200){
                done
            }
        }).catch((err) => {
            setLoginError(true)
        })
    };

    return (
        <div>
            <div className="p-4 text-center block rounded outline-none bg-gradient-to-br from-indigo-100 to-indigo-50">
                <h4 className="font-semibold text-xl antialiased text-indigo-700 tracking-wide">Add Your Instagram Account</h4>
            </div>
            {submitted ? (
                <div>
                    <div className="p-6 text-center flex flex-col">
                        <h3 className={`${loginError ? 'text-red-500' : 'text-green-500'} text-xl tracking-tight font-semibold animate-pulse`}>{loginError ? 'Failed to Login' : 'Trying to login...'}</h3>
                        {loginError ? (
                            <div>
                                <div className="flex flex-row md:flex-col space-y-2 justify-between p-4 mx-auto md:w-1/2 items-center">
                                    <p className="text-xs md:text-sm text-indigo-600">Complete any challenges in your IG account first</p>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => handleSubmit}
                                        >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : ('')}
                    </div>
                </div>
            ) : (
                <div>
                <form ref={form} onSubmit={handleSubmit} autoComplete="off" className="w-full flex justify-center bg-white dark:bg-gray-900">
                <div className="w-full sm:w-4/6 md:w-3/6 lg:w-2/3 text-gray-800 dark:text-gray-100 mb-12 sm:mb-0 flex flex-col justify-center px-2 sm:px-0">
                <div className="mt-8 w-full px-2 sm:px-6">
                        <div className="flex flex-col mt-8">
                            <label htmlFor="username" className="text-lg font-semibold leading-tight">
                                Username
                            </label>
                            <input required id="username" name="username" className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow" type="text" />
                        </div>
                        <div className="flex flex-col mt-5">
                            <label htmlFor="password" className="text-lg font-semibold fleading-tight">
                                Password
                            </label>
                            <input required id="password" name="password" className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow" type="password" />
                        </div>
                        <div className="px-2 sm:mb-16 sm:px-6 sm:flex sm:justify-end">
                            <button className="focus:outline-none w-full sm:w-1/2 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm mt-6">
                                Login
                            </button>
                        </div>
                    </div>
                    </div>
                    </form>
            </div>
            )}
        </div>
    )
}
