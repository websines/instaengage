import FAQ from '../Components/faq'
import Image from 'next/image'
import Layout from '../Components/Layout'
import authAxios from '../utils/axios'
import {useState, useEffect, useContext} from 'react'
import AddAccount from '../Components/AddAccount'
import {MiscContext} from '../context/AuthContext'

export default function Dashboard() {
    //const {setInsta} = useContext(MiscContext)
    const [account, setAccount] = useState(null)
    const [exists, setExists] = useState(true)

    useEffect(() => {
        async function fetch(){
            await authAxios.get('/user/insta').then((res) => {
                setAccount(res.data.data)
            })
        }

        async function verify(){
            await authAxios.get('/insta/verify').then((res) => {
                console.log(res.status)
                if(res.status == 200){
                    setExists(true)
                    fetch()
                }
            }).catch((err) => {
                setExists(false)
            })
        }
        verify()
    }, [])

    const k = 0
    return (
        <div>
            <Layout page={"Dashboard"} number={k}>
                {exists? (
                    <div>
                    <div className="p-4 text-center block rounded outline-none bg-gradient-to-br from-indigo-100 to-indigo-50">
                    <h4 className="font-semibold text-xl antialiased text-indigo-700 tracking-wide">Connected Account</h4>
                    </div>
                    <div className="ml-16 flex flex-col md:flex-row justify-between p-4">
                        <div className="flex flex-row items-center space-x-2 md:block md:space-y-2">
                           {account && account.profile_url != "" &&  <Image src= {`${account ? account.profile_url : ''}`}
                            height={144}
                            width={144}
                            className="rounded-full w-36 h-36 border-4 border-green-600"
                            alt="urekmazino"
                            />}
                            <div className="p-4 text-center">
                                <p className="text-extrabold tracking-wide text-lg">{account ? account.username : ''}</p>
                            </div>
                        </div>
                        <div className="mr-16 flex flex-row justify-evenly space-x-12 my-6 md:my-0">
                        <div className="shadow-lg rounded-2xl w-36 p-4 bg-white dark:bg-gray-800 max-h-36">
                        <div className="flex items-center">
                            <span className="bg-green-500 p-2 h-4 w-4 rounded-full relative">
                            <svg width="20" fill="currentColor" height="20" className="text-white h-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </span>
                            <p className="text-md text-gray-700 dark:text-gray-50 ml-2">
                                Followers
                            </p>
                        </div>
                        <div className="flex flex-col justify-start">
                            <p className="text-gray-800 text-4xl text-left dark:text-white font-bold my-4">
                            {account ? account.follower_count : ''}
                            </p>
                            <div className="relative w-28 h-2 bg-gray-200 rounded">
                                <div className="absolute top-0 h-2  left-0 rounded bg-green-500 w-2/3">
                                </div>
                            </div>
                                </div>
                            </div>
                            
                            <div className="shadow-lg rounded-2xl w-36 p-4 bg-white dark:bg-gray-800 max-h-36">
                        <div className="flex items-center">
                            <span className="bg-indigo-700 p-2 h-4 w-4 rounded-full relative">
                            <svg width="20" fill="currentColor" height="20" className="text-white h-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </span>
                            <p className="text-md text-gray-700 dark:text-gray-50 ml-2">
                                Following
                            </p>
                        </div>
                        <div className="flex flex-col justify-start">
                            <p className="text-gray-800 text-4xl text-left dark:text-white font-bold my-4">
                                {account ? account.following_count : ''}
                            </p>
                            <div className="relative w-28 h-2 bg-gray-200 rounded">
                                <div className="absolute top-0 h-2  left-0 rounded bg-indigo-700 w-2/3">
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                ):(
                    <AddAccount done={() => setExists(true)}/>
                )}
                <div className="flex flex-col md:flex-row p-4 mt-8 mb-16 justify-between">
                 <div className="text-center md:w-1/2 font-Inter">
                    <h2 className="text-2xl lg:text-6xl md:leading-snug tracking-wide font-black text-purple-700">
                        About InstaEngage
                    </h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 ">
                    <FAQ question={"Lorem Ipsum lon established?"} answer={"it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letter"}/>
                    <FAQ question={"Lorem Ipsum lon established?"} answer={"it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letter"}/>
                    <FAQ question={"Lorem Ipsum lon established?"} answer={"it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letter"}/>
                    <FAQ question={"Lorem Ipsum lon established?"} answer={"it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letter"}/>
                 </div>
                </div>
            </Layout>
        </div>
    )
}
