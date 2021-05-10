import Layout from '../Components/Layout'
import {useState, useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'
import authAxios from '../utils/axios'

export default function CommentPage() {
    const {user} = useContext(AuthContext)
    const [edit, setEdit] = useState(false)
    const [code, setCode] = useState('')
    const [change, setChange] = useState(false)
    const [comment, setComment] = useState('')
    const [working, setWorking] = useState(false)


    useEffect(() => {
        if(user != null && user.comment_text == ""){
            setEdit(true)
        }
    }, [])

    let data = {
        short_id : code
    }
    const k = 2

    async function handleSubmitCode(e){
        e.preventDefault()
        await authAxios.post('/post/comment', data).then((res) => {
            if(res.status == 200){
                setWorking(false)
            }
        })
    }

    let CommentData = {
        comment_text : comment
    }

    async function handleSubmitComment(e){
        e.preventDefault()
        await authAxios.post('/comment', JSON.stringify(CommentData)).then((res) => {
            if(res.status == 200){
                setChange(false)
                setEdit(false)
            }
        })
    }
    return (
        <div>
            <Layout page={"Comments"} number={k}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex flex-row justify-between">
                   <div className="block">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Comments to be posted</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">These comments will be posted in the given post!</p>
                   </div>
                    <button type="button" onClick={() => setEdit(!edit)} className="space-x-2 flex px-2 py-1 md:px-4 md:py-2.5 text-white bg-indigo-600 flex-row items-center rounded hover:bg-indigo-700 transition ease-in-out duration-200 focus:outline-none focus:border-transparent">{edit == false ? (<div className="flex flex-row items-center space-x-2">Edit <span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></span></div>):(<div className="flex flex-row items-center space-x-2"><span><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>Back</div>)}</button>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 md:items-center">
                        <dt className="text-sm font-medium text-gray-500">Active Comments</dt>
                        <dd className="mt-1 md:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {edit == false ? (
                                <div>
                                    {user && user.comment_text}
                                </div>
                            ): (
                                <div className="flex flex-col space-y-2">
                                <form autoComplete="off" onSubmit={handleSubmitComment}>
                                    <div className="space-y-2 flex">
                                        <input 
                                         className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow"
                                         name="comment"
                                         placeholder="Comment1; Comment2; ..."
                                         value={comment}
                                         onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button  onClick={() => setChange(true)} className="px-4 justify-end py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition ease-in-out duration-200">{change ? 'Working': 'Submit'}</button>
                                    </div>
                                </form>
                                </div>
                            )}
                        </dd>
                    </div>
                    </dl>
                </div>
                </div>
                <div className="bg-gray-50 my-16 rounded">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    <span className="block">Ready to recieve comments?</span>
                    <span className="block text-indigo-600">Enter your post's code</span>
                    </h2>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                       <div className="flex flex-col space-y-2">
                       <form autoComplete="off" onSubmit={handleSubmitCode}>
                           <div className="space-y-2 flex">
                               <input 
                                className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow"
                                name="code"
                                placeholder="Short Code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                               />
                               <button onClick={() => setWorking(true)}className="px-4 justify-end py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition ease-in-out duration-200">Start</button>
                           </div>
                       </form>
                       <p className="text-indigo-700 text-sm tracking-tight font-medium">Eg: instagram.com/p/<span className="text-green-500">Code</span>/</p>
                       </div>
                    </div>
                    </div>
                    {working ? (<div className="w-full flex items-center pb-6">
                        <p className="text-purple-700 md:text-lg tracking-tight antialiased animate-bounce mx-auto">Working...</p>   
                    </div>):('')}
                </div>
            </Layout>
        </div>
    )
}
