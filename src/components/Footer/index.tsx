import './index.scss';
import { useEffect, useState } from 'react';
import Link from '../Link';
import { useLocation } from 'react-router-dom';
import { initBackButton } from '@telegram-apps/sdk';
const TaskIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2663" width="32" height="32"><path d="M228.928 320h534.144v64H228.928zM228.928 512h534.144v64H228.928zM228.928 704h534.144v64H228.928z" p-id="2664"></path><path d="M124.48 950.272L124.16 118.016h169.024v34.56c0 38.656 31.296 70.144 69.76 70.144h279.488a70.016 70.016 0 0 0 69.696-70.144v-34.56l168.704-0.32 0.32 832.32-756.672 0.256z m517.824-866.816l0.128 69.44-279.424-0.32v-69.12l-0.128-0.384 279.424 0.384zM880.704 50.56h-178.368c-12.096-22.208-34.24-37.312-59.904-37.312H362.88c-25.6 0-47.808 15.104-59.904 37.312H124.16c-38.4 0-69.504 33.28-69.504 74.24v820.736c0 40.96 31.232 74.24 69.568 74.24h756.928c38.4 0 69.44-33.28 69.504-74.24V124.8c-0.128-41.152-31.488-74.368-69.952-74.24z" p-id="2665"></path></svg>
const LeaderBoard = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4197" width="32" height="32"><path d="M1002.624 981.269333 21.354667 981.269333C9.557333 981.269333 0 990.826667 0 1002.624 0 1014.442667 9.557333 1024 21.354667 1024l981.269333 0C1014.464 1024 1024 1014.442667 1024 1002.624 1024 990.826667 1014.464 981.269333 1002.624 981.269333z" p-id="4198"></path><path d="M757.290667 925.866667l245.333333 0c11.84 0 21.376-9.557333 21.354667-21.376L1023.978667 561.066667c0-11.818667-9.514667-21.376-21.376-21.376L757.290667 539.690667c-11.84 0-21.354667 9.557333-21.354667 21.376l0 343.445333C735.936 916.309333 745.450667 925.866667 757.290667 925.866667zM778.666667 582.421333l202.581333 0 0 300.714667L778.666667 883.136 778.666667 582.421333z" p-id="4199"></path><path d="M389.333333 925.866667l245.312 0c11.861333 0 21.376-9.557333 21.376-21.376L656.021333 21.354667C656.021333 9.557333 646.506667 0 634.645333 0L389.333333 0c-11.797333 0-21.354667 9.557333-21.354667 21.354667l0 883.136C367.978667 916.309333 377.536 925.866667 389.333333 925.866667zM410.709333 42.730667l202.581333 0 0 840.405333-202.581333 0L410.709333 42.730667z" p-id="4200"></path><path d="M21.354667 925.866667l245.333333 0c11.797333 0 21.376-9.557333 21.333333-21.376L288.021333 364.8c0-11.776-9.578667-21.354667-21.354667-21.354667L21.354667 343.445333C9.557333 343.445333 0 353.002667 0 364.8l0 539.690667C0 916.309333 9.557333 925.866667 21.354667 925.866667zM42.730667 386.176l202.581333 0 0 496.938667L42.730667 883.114667 42.730667 386.176z" p-id="4201"></path></svg>
const WalletIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2384" width="32" height="32"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 464H528V448h312v128z m0 264H184V184h656v200H496c-17.7 0-32 14.3-32 32v192c0 17.7 14.3 32 32 32h344v200z" p-id="2385"></path><path d="M620 512m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" p-id="2386"></path></svg>
const HomeIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3670" width="32" height="32"><path d="M979.2 422.4l-448-384h-6.4-6.4H512h-6.4-6.4-6.4-6.4-6.4l-448 384c6.4 6.4 0 19.2 0 25.6 0 6.4 0 12.8 6.4 19.2 6.4 6.4 19.2 12.8 25.6 12.8 6.4 0 12.8 0 19.2-6.4l44.8-38.4v492.8c0 19.2 12.8 32 32 32h704c19.2 0 32-12.8 32-32V435.2l44.8 38.4c6.4 6.4 12.8 6.4 19.2 6.4 6.4 0 19.2-6.4 25.6-12.8 6.4-6.4 6.4-12.8 6.4-19.2 0-6.4-6.4-19.2-12.8-25.6zM832 896H192V377.6l320-275.2 320 275.2V896z" p-id="3671"></path><path d="M326.4 640c0 102.4 83.2 185.6 185.6 185.6s185.6-83.2 185.6-185.6S614.4 454.4 512 454.4 326.4 537.6 326.4 640z m320 0c0 76.8-64 134.4-134.4 134.4-76.8 0-134.4-64-134.4-134.4s64-134.4 134.4-134.4c76.8 0 134.4 57.6 134.4 134.4z" p-id="3672"></path></svg>
const FriendsIcon = <svg className="icon" viewBox="0 0 1230 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20329" xmlnsXlink="http://www.w3.org/1999/xlink" width="76.875" height="64"><path d="M1178.69341 1023.872311a51.075427 51.075427 0 0 1-51.075427-51.075427l-0.459679-4.724477c0-0.868282 0.204302-1.659951 0.255377-2.553771a357.987668 357.987668 0 0 0-204.965689-317.484854c-4.494638-6.409966-9.372341-12.487942-14.122355-18.642531a70.433014 70.433014 0 0 1-87.287905-68.951827l-0.638443-6.58873a70.841617 70.841617 0 0 1 1.430112-14.275582c-1.149197-0.970433-2.221781-2.017479-3.370978-2.962374l6.231202-6.231203a70.662853 70.662853 0 0 1 43.209811-43.209811l3.856195-3.881732A204.020793 204.020793 0 0 0 819.454394 109.341253c-1.813178-3.268827-4.13711-6.180127-6.026901-9.397879a47.985364 47.985364 0 0 1-21.170764 5.107543 48.521656 48.521656 0 0 1-48.521656-48.521656l-0.459679-4.494637A48.521656 48.521656 0 0 1 789.575269 3.742807l2.298394-2.272856a307.218694 307.218694 0 0 1 169.851333 546.328305c0.178764 2.043017 0.612905 4.034959 0.612905 6.154589a460.036371 460.036371 0 0 1 266.15405 407.122229 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-50.973276 51.075427z m-527.711312-472.4477a460.215135 460.215135 0 0 1 271.057291 409.650463 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477c0-1.22581 0.280915-2.375007 0.357528-3.575279a358.447347 358.447347 0 0 0-329.104514-349.866676c-9.678793 0.919358-19.4342 1.481187-29.317295 1.481188s-19.664039-0.56183-29.317296-1.481188a358.651649 358.651649 0 0 0-329.436504 357.323688v0.178764h-0.995971v0.612905a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477a50.845588 50.845588 0 0 1 1.685489-12.385791 460.291748 460.291748 0 0 1 271.772348-404.593995 307.93375 307.93375 0 1 1 377.345255 0.459679zM461.74764 102.599296a204.863538 204.863538 0 1 0 204.914614 205.042302 204.889076 204.889076 0 0 0-204.914614-204.965689z" p-id="20330"></path></svg>

function FooterComp() {
    const [backButton] = initBackButton()
    const myLocation = useLocation()
    const [isShowFooter, setShowFooter] = useState(true)
    const menu = [
        {
            title: 'Home',
            icon: HomeIcon,
            to: '/',
        },
        {
            title: 'Task',
            icon: TaskIcon,
            to: '/task',
        },
        {
            title: 'Frens',
            icon: FriendsIcon,
            to: '/frens',
        },
        {
            title: 'LeaderBoard',
            icon: LeaderBoard,
            to: '/leaderboard',
        },
        {
            title: 'Wallet',
            icon: WalletIcon,
            to: '/wallet',
        }
    ]
    useEffect(() => {
        let flag = true
        if (myLocation.pathname) {
            flag = menu.map((item) => { return item.to }).includes(myLocation.pathname)
            setShowFooter(flag)
        } else {
            setShowFooter(true)
        }
        if (flag) {
            backButton.hide()
        } else {
            backButton.show();
        }
    }, [myLocation.pathname])
    return <footer className="footer" style={{ display: isShowFooter ? 'block' : 'none' }}>
        <div className='list'>
            {
                menu.map((item => {
                    return <Link to={item.to} key={item.title} className='menu-wrapper'>
                        <div className={`menu ${myLocation.pathname == item.to ? 'active' : ''}`} key={item.title}>
                            {item.icon}
                            <div className='title'>{item.title}</div>
                        </div>
                    </Link>
                }))
            }
        </div>
    </footer>
}

export default FooterComp;