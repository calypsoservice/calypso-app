import { useContext, useEffect, useState } from "react"
import { IMessageContext } from "../Types"
import { ChatContext, UsersContext } from "../Contexts/AppContext"
import axios from "axios"
import { HEADERS, SERVER_URL } from "../constants"
import { logoutHandler, toLocalTime } from "../Hooks/helpers"
import { useLocation, useNavigate, useParams } from "react-router-dom"


export const ChatBlock = () => {
    const [chatOpen, setChatOpen] = useState<boolean>(false)
    const [unread, setUnread] = useState<number>(0)
    // const [messages, setMessages] = useState<IMessageContext[]>()
    // const { appContext } = useContext(AppContext)
    const { chatContext, setChatContext } = useContext(ChatContext)
    const { usersContext } = useContext(UsersContext)
    const { id } = useParams()

    useEffect(() => {
        if (chatContext === undefined && id !== undefined && usersContext !== undefined) {
            usersContext.forEach(us => {
                if (Number(id) == us.id) {
                    setChatContext({ userId: us.id, messages: us.messages })
                }
            })
        }
        if (id === undefined) {
            setChatContext(undefined)
        }
    }, [id, usersContext])

    useEffect(() => {
        if (chatContext === undefined && id !== undefined && usersContext !== undefined) {
            usersContext.forEach(us => {
                if (Number(id) == us.id) {
                    setChatContext({ userId: us.id, messages: us.messages })
                }
            })
        }
        if (id === undefined) {
            setChatContext(undefined)
        }
    }, [])

    useEffect(() => {
        if (!chatContext?.messages) return;
        var idList: number[] = []
        chatContext.messages.forEach((ms: IMessageContext) => {
            if (ms.read == false && ms.admin == false) {
                idList.push(ms.id)
            }
        })
        // console.log(messages)
        setUnread(idList.length)
    }, [chatContext?.messages])

    useEffect(() => {
        if (!chatContext?.messages) return;
        var idList: number[] = []
        chatContext.messages.forEach((ms: IMessageContext) => {
            if (ms.read == false && ms.admin == false) {
                idList.push(ms.id)
            }
        })
        setUnread(idList.length)
    }, [])

    const currentPath = useLocation()

    if (currentPath.pathname == '/') {
        return <></>
    }

    return (
        <div className={`chat-button${chatOpen ? ' closed' : ''}`} data-unread={unread != 0 ? String(unread) : ''}>
            <i className="ri-chat-smile-3-line" onClick={() => setChatOpen(!chatOpen)} />
            <div className={`chat-background${chatOpen ? '' : ' hidden'}`} onClick={() => setChatOpen(false)}></div>
            <ChatComponent isOpen={chatOpen} messages={chatContext?.messages} />
        </div>
    )
}


export const ChatComponent = ({ isOpen, messages }: { isOpen: boolean, messages: IMessageContext[] | undefined }) => {

    const [message, setMessage] = useState<string | undefined>()
    const [messagesWithDate, setMessagesWithDate] = useState<{ date: { day: number, month: number, year: number }, messages: IMessageContext[] }[]>()
    const [update, setUpdate] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [supportStatus, setSupportStatus] = useState<boolean>()
    const { id } = useParams()

    const { usersContext } = useContext(UsersContext)
    const { chatContext, setChatContext } = useContext(ChatContext)

    useEffect(() => {
        if (usersContext !== undefined && id !== undefined) {
            usersContext.forEach(us => {
                if (Number(id) == us.id) {
                    setChatContext({ userId: us.id, messages: us.messages })
                    setUpdate(update + 1)
                    messagesWithDateWrapper(us.messages);
                    var a = (document.querySelector('.chat-scroll') as HTMLElement);
                    a.scrollTo({ top: a.scrollHeight, behavior: "smooth" })
                }
            })
        }
        axios.post(SERVER_URL + '/admin/support/get', { systemParameterKey: "support_status" }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(r => {
                console.log(r.data)
                setSupportStatus(Boolean(Number(r.data.systemParameterValue)))
            })
    }, [usersContext])

    const messagesWithDateWrapper = (messages: IMessageContext[]) => {
        var messagesWith: { date: { day: number, month: number, year: number }, messages: IMessageContext[] }[] = []
        messages?.forEach(ms => {
            var pushed = false;
            const dt = new Date(ms.sendingTime)
            messagesWith.forEach(msW => {
                if (msW.date.day == dt.getDate() && msW.date.month == dt.getMonth() + 1 && msW.date.year == dt.getFullYear()) {
                    msW.messages.push(ms)
                    pushed = true
                }
            })
            if (pushed == false) {
                messagesWith.push({
                    date: {
                        day: dt.getDate(),
                        month: dt.getMonth() + 1,
                        year: dt.getFullYear()
                    },
                    messages: [
                        ms
                    ]
                })
            }
        })
        setMessagesWithDate(messagesWith)
    }

    const navigate = useNavigate()

    useEffect(() => {
        if (!chatContext?.userId) return;
        const intervalId = setInterval(() => {
            axios.post(SERVER_URL + '/message/get/by/user', { id: chatContext.userId }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then(r => {
                    if (Number(r.data.length) > Number(messages?.length)) {
                        var a = (document.querySelector('.chat-scroll') as HTMLElement);
                        setTimeout(() => { a.scrollTo({ top: a.scrollHeight, behavior: "smooth" }) }, 1000)
                    }
                    setChatContext({ ...chatContext, messages: r.data })
                    setUpdate(update + 1);
                    messagesWithDateWrapper(r.data)
                })
                .catch(e => {
                    console.log(e)
                    if (e.status == 401 || e.code == "ERR_NETWORK") {
                        console.log("Invalid Token")
                        logoutHandler()
                        navigate('/login/')
                    }
                })
            axios.post(SERVER_URL + '/admin/support/get', { systemParameterKey: "support_status" }, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
                .then(r => {
                    console.log(r.data)
                    setSupportStatus(Boolean(Number(r.data.systemParameterValue)))
                })
        }, 1000);
        return () => clearInterval(intervalId);
    }, [update, chatContext?.userId])


    const onEnterPress = (event: any) => {
        if (event.keyCode == 13) {
            sendMessage()
        }
    }

    const sendMessage = () => {
        // console.log(!appContext.user)
        // console.log(!message);

        if (!chatContext?.userId) return
        if (!message) return
        if (message.length == 0) return
        setIsLoading(true)
        const data = {
            text: message,
            admin: true,
            userId: chatContext.userId
        }
        // console.log(data)
        axios.post(SERVER_URL + '/message/save', data, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
                // console.log(r)
                setMessage('')
                setIsLoading(false)
                var a = (document.querySelector('.chat-scroll') as HTMLElement);
                setTimeout(() => { a.scrollTo({ top: a.scrollHeight, behavior: "smooth" }) }, 1000)
            })
            .catch(e => {
                console.log(e)
                setIsLoading(false)
                if (e.status == 401 || e.code == "ERR_NETWORK") {
                    console.log("Invalid Token")
                    logoutHandler()
                    navigate('/login/')
                }
            })
    }

    const updateUnreadedMessages = () => {
        if (!chatContext?.userId) return;
        var idList: number[] = []
        messages?.forEach((ms: IMessageContext) => {
            if (ms.read == false && ms.admin == false) {
                idList.push(ms.id)
            }
        })
        axios.post(SERVER_URL + '/message/update', idList, { headers: { ...HEADERS, Authorization: `${sessionStorage.getItem("auth-type")} ${sessionStorage.getItem("auth-token")}` } })
            .then(() => {
                // console.log(r)
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401 || e.code == "ERR_NETWORK") {
                    console.log("Invalid Token")
                    logoutHandler()
                    navigate('/login/')
                }
            })
    }

    useEffect(() => {
        if (isOpen) {
            var a = (document.querySelector('.chat-scroll') as HTMLElement);
            setTimeout(() => { a.scrollTo({ top: a.scrollHeight, behavior: "smooth" }) }, 1000)
            updateUnreadedMessages()
        }
    }, [isOpen])

    useEffect(() => {
        // console.log(chatContext)
    }, [chatContext])

    return (
        <div className={`chat${isOpen ? '' : ' hiddenchat'}`}>
            <div className="chat-wrapper">
                <div className="relative h-full outline-none">
                    <div className="relative w-full h-full overflow-hidden">
                        <div className="relative flex flex-col h-full">
                            <div className="chat-topbar px-4 py-2">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="flex-grow-0 flex-shrink-1 w-full">
                                        <div className="flex items-center">
                                            <div className="relative flex-shrink-0 mr-2 ml-0 self-center">
                                                <img className="rounded-full w-6 h-6" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAwICQoJBwwKCQoNDAwOER0TERAQESMZGxUdKiUsKyklKCguNEI4LjE/MigoOk46P0RHSktKLTdRV1FIVkJJSkf/2wBDAQwNDREPESITEyJHMCgwR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wgARCAH0AfQDAREAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAMEBQIBBgf/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAgED/9oADAMBAAIQAxAAAAD9VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIdQajPDolxYx2AAAAAAAAAAAAAAAAAAAAAAAAAACprLtBoAAel2WnCUAAAAAAAAAAAAAAAAAAAAAAAAAzKZlgAAAB2bnNPgAAAAAAAAAAAAAAAAAAAAAAACrrD6AAAAABLjf5ugAAAAAAAAAAAAAAAAAAAAAAAYVq1AAAAAANeF+QAAAAAAAAAAAAAAAAAAAAAAER891AAAAAACzjd5gAAAAAAAAAAAAAAAAAAAAAAKVMawAAAAAA9PpeQAAAAAAAAAAAAAAAAAAAAAADMpmWAAAAAAA+h5JQAAAAAAAAAAAAAAAAAAAAAAZNs+gAAAAAAG9zWMAAAAAAAAAAAAAAAAAAAAAADHtRoAAAAAABu81nAAAAAAAAAAAAAAAAAAAAAAAx7UaAAAAAAAbnNawAAAAAAAAAAAAAAAAAAAAAAMqmdYAAAAAAD6DmmwAAAAAAAAAAAAAAAAAAAAAAKFMiwAAAAAAH0nJ0AAAAAAAAAAAAAAAAAAAAAACI+e6gAAAAABZxu8wAAAAAAAAAAAAAAAAAAAAAAAwrVqAAAAAAa8L8gAAAAAAAAAAAAAAAAAAAAAABU1idAAAAAAkx9BzdAAAAAAAAAAAAAAAAAAAAAAAAGLanQAAAADa5rmAAAAAAAAAAAAAAAAAAAAAAAABwYnRX0AAABqQ0pAAAAAAAAAAAAAAAAAAAAAAAAADgyrUaAADo1YX5AAAAAAAAAAAAAAAAAAAAAAAAAAAVtUqV9cEpalelIAAAAAAAAAAAAAAAAAAAAAAAAAAcFfVnHQAABBrwnx6AAAAAAAAAAAAAAAAAAAAAADwrap0q6h0JsasLWPQDgoUzLeHpYxblclMAAAAAAAAAAAAAAAAAAAAeFKmZSLQAAHZPj04INeAAAFuWpKfAAAAAAAAAAAAAAAAAAA5Ma1SgAAAAAAAAAA9NaF+QAAAAAAAAAAAAAAAAAGLanQAAAAAAAAAAADZhdkAAAAAAAAAAAAAAAABS1jdAAAAAAAAAAAAAkx9BzdAAAAAAAAAAAAAAAAAwuitoAAAAAAAAAAAADXhfkAAAAAAAAAAAAAAABwfO9XgAAAAAAAAAAAABcltQAAAAAAAAAAAAAAAAqaxOgAAAAAAAAAAAAASY+i5gAAAAAAAAAAAAAAAM+mTYAAAAAAAAAAAAAD6Tk6AAAAAAAAAAAAAAABl0zbAAAAAAAAAAAAAAfQc02AAAAAAAAAAAAAAABkWoUAAAAAAAAAAAAAA3eazgAAAAAAAAAAAAAAAY1qVAAAAAAAAAAAAAANvmt4AAAAAAAAAAAAAAAGLanQAAAAAAAAAAAAADb5reAAAAAAAAAAAAAAABiWqUAAAAAAAAAAAAAA2oXJAAAAAAAAAAAAAAADGtSoAAAAAAAAAAAAABtc1zAAAAAAAAAAAAAAAAhMToi0AAAAAAAAAAAABflrQ9AAAAAAAAAAAAAAAAODLtQoAAAAAAAAAAAJMakr0gAAAAAAAAAAAAAAAAAISjalqLQAAAAAAAA9LGL0rsugAAAAAAAAAAAAAAAAAAACHVbUGodREevAAAenRJiXE+J8WcdgAAAAAAAAAAAAAAAAAAAAAAAA8OTw8PTo6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//xAA5EAACAQEEBwUGBAcBAAAAAAABAgMEAAURUBIhMUBBUXETIjAyNCAzQlJhchBikqEjQ1OBgpCxwf/aAAgBAQABPwD/AFoyVMMfnkUWa86YbCzdBY3snCN7C9k4xNYXrDxRxZLxpm+PCySJIMUYN0Ob1VdHBio7z8haesmmxBcgcl1D20ZlbFGKnmLU95SJql74/e0M6TppRnHNLwrSpMMPm4nw4ZXhcMjWpalamLSXURtGZV9R2EHd87al8WknaCYOOjDmLKwZQynEEYg5jeEva1Tck7o8a6pdKAxnamYVD9lA7/KPHux+zrAOD93ML1YrRkc2A8eJjHIrjapBzC+TqjXqdwpzpU8bc1GX3x72MflO4UPo4vty++Pfp9u4UHooumX3x79Pt3C7/RR9D/3L75HfibqNwoxo0kQ/KMvvZMaYN8jeOgLOFG0nCyqFUKNgGAy+pj7WndOY8e7Y9OrXkneOY18PY1TcA2tfGumLRgMh2vs6ZjeMHbU+KjFl1jxaaFp5gi8dp5CyqFQKowAGAzK8aXspO0TyN+x8S76XsItJ/O2ZuiyIyOMVYYEWrKV6Z+aHY3hXfRFcJpvNwGauiyIUdQynaLVV3PFi8OLry4j24onlfRRSxtR0CxYPLgz/ALDOJ6OGfWyYN8y6jaS6nHu3BsaCqXbET0INhR1J/kvZLuqG2qF6m0N1qNcrlulookiXRjQKM2eRE87heps14Uy/Hj0sjK6hlIIOw+BPUxU/vG1myVlO+yVbAgjEEEZhNXU8WovpHkuu0t6vsiQL9Ws9XUPtlboNViSdZP4UtXJTnUcV4qbQV0MvHQPI+y7pGMXYL1Nqi81AKwDE8zZ3eRy7sWY/gkjocUdlP0No7wqU2uHHJhaK9EOqVCv1FoZ4phjG4bK6m8Y4sVj77WmqppydNzh8o2eAk8sfkkZbC8ar5weqixvKp5r+mzV9S22QjoMLFmY4uxY/U+2CQcQcDamvGWLU/fX97U9THULih6g7cnd1RCzHAC1ZXNOSqErHu6MyMGQkMOItQ1wl/hykB8mvCrMzlF8ineQbXfVduhRvOuSXnP2VPor5n1b3TymGYOOBsjh0DLsIxGR3jL2lW3JO6N8umXSpynFDkUjdnEzngCbEliTz3y6n0avR4MDkV5No0T77TNoVMbcmGRXu2ECjm2+g4GyHSQHmAchvk+6Xqd+pDjSxn8oyG+PfRj6b9QHGii6ZDe/ql+if+nfru9DH/f8A7kN7er/xG/XZ6FepyG9fWn7Rv11ejH3HIb1RhVafAgYHfrsRkoxpcSTkM8KTxlHFqimenfBhq4NwO+UFCXIkmGC7QuRvGkiFHUMp4G1Tdjri8BxHy2IIJDAgjeIYJJ2wRCfrwFqW7ki70mDvk01PFMMJEBtNdXGF/wCzWlppovPGwHPaNzVSTgoJP0tFd9Q/w6A5taG7Ik1yEubKqquCgAZU9NA/njU2e64W8jMlnup/gkBsbuqh8APRrGkqF2wtYxuNqMLEEe0FY7FJssErHBY3P+JslFUtsiYddVkuyoPm0Vst0/PLZLupk2qX+42SNE8iBegzMgG3Zp8gsYo/6S/pFuwi/op+kWEUY2RL+kWCINij/Wn/AP/EAB8RAAEEAwEBAQEAAAAAAAAAAAEAAhFQEjBAMSCQEP/aAAgBAgEBPwD80YWJWKxWKxNwBKA0Ftq0bCIsgJ2kTZDc6wG93lg32/bft4D7Xt4D7Xt4D7Xt4DXtvxvPliDudYtO0mzadhNoDOom2DtBNwCslIUhZBZXEHSBKg2IBWKgf0iUR9BvxiFioqw1AaIWIWIUDSWoiKgDoIpgOoiKRo6zSN87HX7qJvvaaJt+3uNC3uPtC3uPtCPO53tCPO53tC3uPtCCgZ7CaQO6i6mBQcgeTILKrlZLJZBSNUhZBZLI/oZ//8QAFBEBAAAAAAAAAAAAAAAAAAAAsP/aAAgBAwEBPwB4H//Z" alt="" />
                                                <span className={`right-0 bottom-0 left-auto absolute rounded-full w-2 h-2 chat-support-status${supportStatus ? " active" : ""}`}></span>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden chat-support-name">
                                                <h5 className="mb-0 text-sm text-truncate">Support</h5>
                                                <p className="text-xs text-truncate"><small>{supportStatus ? "Online" : "Offline"}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:hidden chat-close">
                                        <i className="ri-close-line" />
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-full chat-body">
                                <div className="p-4 h-full">
                                    <div className="h-full">
                                        <div className="m-0 overflow-hidden chat-body-wrapper scroll-">
                                            <div className="top-0 right-0 bottom-0 left-0 absolute w-auto h-auto overflow-hidden">
                                                <div className="top-0 right-0 bottom-0 left-0 absolute m-0">
                                                    <div className="relative box-border flex flex-col p-0 w-auto max-w-full h-full max-h-full overflow-x-hidden overflow-y-scroll chat-scroll visible">
                                                        <div className="mt-auto p-0">
                                                            <ul className="mb-0 pt-2.5 pr-2 pl-2 list-none message-list">
                                                                {messagesWithDate?.map(ms => <ChatBodyDateBlock data={ms} />)}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-2 chat-input-section">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative flex-grow flex-shrink-0 w-auto max-w-full">
                                        <div className="hidden text-xs chat-input-error">
                                            Please Enter a Message
                                        </div>
                                        <input className="text-sm chat-input" type="text" placeholder="Type your message..." value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={onEnterPress} />
                                    </div>
                                    <div className="flex-shrink-0 felx-grow-0 w-auto basis-auto">
                                        <div className="flex ml-2">
                                            <div className="flex justify-center items-center">
                                                <button className="send-btn" type="button" onClick={sendMessage}>
                                                    {
                                                        isLoading == true ?
                                                            <div className='loader'></div>
                                                            :
                                                            <i className="align-bottom ri-send-plane-2-fill" />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChatBodyDateBlock = ({ data }: { data: { date: { day: number, month: number, year: number }, messages: IMessageContext[] } }) => {
    return (
        <div className="chat-date-block">
            <div className="chat-date">
                <span>{`${data.date.day}.${data.date.month}.${data.date.year}`}</span>
            </div>
            {data.messages.map((ms: IMessageContext) => <ChatBodyElement data={ms} />)}
        </div>
    )
}

const ChatBodyElement = ({ data }: { data: IMessageContext }) => {
    const [date] = useState<string>(toLocalTime(data.sendingTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))

    return (
        <li className={`flex m-0${data.admin == true ? ' justify-end' : ''}`}>
            <div className="inline-flex relative items-end max-w-[80%]">
                <div className={`m-0 min-w-6${data.admin == true ? ' ml-2 order-2' : ' mr-2'}`}>
                    <img className="rounded-full w-6 h-6" src="data:image/jpeg;base64,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" alt="" />
                </div>
                <div>
                    <div className="flex mb-2.5">
                        <div className={`relative px-5 py-3 chat-message${data.admin == true ? ' from-user' : ''}`}>
                            <p className="text-pretty text-xs">{data.text}</p>
                        </div>
                    </div>
                    <div className={`flex flex-wrap gap-2 font-medium itmes-center${data.admin == true ? ' justify-end' : ''}`}>
                        <small className="opacity-50 text-white text-xs">{date}</small>
                        <i className={`align-bottom text-xs read-status ri-check-double-line${data.read == true ? ' hidden' : ''}`} />
                    </div>
                </div>
            </div>
        </li>
    )
}