import './index.scss';
import { useEffect, useState } from 'react';
import EventBus from '@/utils/eventBus';
import { useLocation, useNavigate } from 'react-router-dom';
import { initBackButton } from '@telegram-apps/sdk';

export default function () {
    const eventBus = EventBus.getInstance()
    const [currentTab, setCurrentTab] = useState('Home')
    const myLocation = useLocation()
    const [isShowFooter, setShowFooter] = useState(true)
    const [backButton] = initBackButton()
    const navigate = useNavigate()
    const handleClickTab = (item: any) => {
        navigate(item.to)
    }
    const [menu, setMenu] = useState([
        {
            title: '𝗛𝗼𝗺𝗲',
            icon: HomeIcon,
            to: '/'
        },
        {
            title: '𝗟𝗲𝗮𝗱𝗲𝗿𝗯𝗼𝗮𝗿𝗱',
            icon: LeaderBoardIcon,
            to: '/leaderBoard',
        },
        {
            title: '𝗙𝗿𝗶𝗲𝗻𝗱𝘀',
            icon: FriendsIcon,
            to: '/frens'
        },
        {
            title: '𝗚𝗮𝗺𝗲',
            icon: gameIcon,
            to: '/game',
        },
    ])
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
                    return <div className={`menu ${myLocation.pathname == item.to ? 'active' : ''}`} key={item.title} onClick={() => handleClickTab(item)}>
                        {item.icon}
                        <p>{item.title}</p>
                    </div>
                }))
            }
        </div>
    </footer>
}
var gameIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16356" width="32" height="32"><path d="M324.6 307.2c-70.9 0-128.5 57.7-128.5 128.5s57.6 128.5 128.5 128.5 128.5-57.6 128.5-128.5-57.6-128.5-128.5-128.5z m0 203.2c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zM801.9 408.8h-74.7v-74.7c0-14.9-12-26.9-26.9-26.9-14.9 0-26.9 12-26.9 26.9v74.7h-74.7c-14.9 0-26.9 12-26.9 26.9s12 26.9 26.9 26.9h74.7v74.7c0 14.9 12 26.9 26.9 26.9 14.9 0 26.9-12 26.9-26.9v-74.7h74.7c14.9 0 26.9-12 26.9-26.9s-12-26.9-26.9-26.9z" p-id="16357"></path><path d="M959.3 306.8c0-89-72.4-161.4-161.4-161.4H681.5c-25.1 0-47.9 14.2-58 36.3-11.1 24.1-35.3 39.7-61.6 39.7h-99.7c-23.5 0-46.8-16.1-59.3-41.1-10.6-21.2-33.2-34.9-57.7-34.9H225.9c-89 0-161.4 72.4-161.4 161.4v186c0 0.8 0 1.5 0.1 2.1 0 0.7-0.1 1.4-0.1 2.2v248c0 38 14.9 73.8 41.9 100.7 27.1 27 63 41.8 101.2 41.8h0.5c79-0.3 114.4-32 139.9-125.6l29.6-89.8h268.6l29.9 90.8c27.5 80.9 58.1 124.7 140.9 124.7 78.5 0 142.3-63.9 142.3-142.3V497.1c0-0.8 0-1.5-0.1-2.1 0-0.7 0.1-1.4 0.1-2.2v-186z m-53.8 185.5c-0.1 0.8-0.1 1.6-0.1 3.2 0 0.7 0 1.4 0.1 2.2v247.7c0 48.8-39.7 88.5-88.5 88.5-45.7 0-64.1-12.2-89.9-88l-35.9-109c-3.6-11-13.9-18.5-25.5-18.5H358.2c-11.6 0-21.9 7.5-25.5 18.5l-35.9 109c-0.1 0.5-0.3 0.9-0.4 1.4-22.4 82.9-43.3 86.4-88.4 86.6h-0.3c-23.9 0-46.3-9.3-63.2-26.1-16.8-16.8-26.1-39-26.1-62.6V497.8c0.1-0.7 0.1-1.5 0.1-2.2v-1c0-0.7 0-1.4-0.1-2.2V306.8c0-59.3 48.3-107.6 107.6-107.6h119.2c4.2 0 8 2.1 9.6 5.2 21.9 43.7 63 70.8 107.4 70.8h99.7c47.3 0 90.6-27.9 110.5-71 1.4-2.9 5.1-5 9.2-5h116.5c59.3 0 107.6 48.3 107.6 107.6v185.5z" p-id="16358"></path></svg>
var HomeIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2342" width="64" height="64"><path d="M837.456896 946.192384 647.790592 946.192384c-14.997504 0-27.15648-12.158976-27.15648-27.15648L620.634112 647.810048 404.29056 647.810048l-0.90112 271.31904c-0.039936 14.956544-12.1856 27.063296-27.15648 27.063296l-189.679616 0c-14.99648 0-27.15648-12.158976-27.15648-27.15648L159.396864 463.486976c0-14.99648 12.16-27.155456 27.15648-27.155456s27.15648 12.158976 27.15648 27.155456l0 428.393472 135.487488 0 0.862208-271.225856c0.039936-14.969856 12.1856-27.075584 27.155456-27.075584l270.57664 0c14.997504 0 27.15648 12.158976 27.15648 27.155456l0 271.173632 135.327744 0L810.27584 463.486976c0-14.99648 12.158976-27.155456 27.15648-27.155456 14.99648 0 27.15648 12.158976 27.15648 27.155456l0 455.548928C864.586752 934.033408 852.4544 946.179072 837.456896 946.192384zM920.687616 559.141888c-7.399424 0.014336-14.47936-3.009536-19.598336-8.352768L513.05984 144.19456 122.88 550.762496c-10.382336 10.832896-27.580416 11.177984-38.4 0.795648-10.819584-10.38336-11.164672-27.580416-0.782336-38.4l0 0 409.76384-426.98752c5.117952-5.343232 12.198912-8.353792 19.598336-8.367104l0 0c7.3984 0.013312 14.466048 3.023872 19.584 8.367104L940.285952 513.171456c10.395648 10.807296 10.05056 28.004352-0.755712 38.4-5.064704 4.852736-11.800576 7.571456-18.829312 7.571456L920.687616 559.142912z" p-id="2343"></path></svg>
var LeaderBoardIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17560" xmlnsXlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M682.666667 469.333333V128H341.333333v256H85.333333v512h853.333334V469.333333h-256z m-256-256h170.666666v597.333334h-170.666666V213.333333z m-256 256h170.666666v341.333334H170.666667v-341.333334z m682.666666 341.333334h-170.666666v-256h170.666666v256z" p-id="17561"></path></svg>
var FriendsIcon = <svg className="icon" viewBox="0 0 1230 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20329" xmlnsXlink="http://www.w3.org/1999/xlink" width="76.875" height="64"><path d="M1178.69341 1023.872311a51.075427 51.075427 0 0 1-51.075427-51.075427l-0.459679-4.724477c0-0.868282 0.204302-1.659951 0.255377-2.553771a357.987668 357.987668 0 0 0-204.965689-317.484854c-4.494638-6.409966-9.372341-12.487942-14.122355-18.642531a70.433014 70.433014 0 0 1-87.287905-68.951827l-0.638443-6.58873a70.841617 70.841617 0 0 1 1.430112-14.275582c-1.149197-0.970433-2.221781-2.017479-3.370978-2.962374l6.231202-6.231203a70.662853 70.662853 0 0 1 43.209811-43.209811l3.856195-3.881732A204.020793 204.020793 0 0 0 819.454394 109.341253c-1.813178-3.268827-4.13711-6.180127-6.026901-9.397879a47.985364 47.985364 0 0 1-21.170764 5.107543 48.521656 48.521656 0 0 1-48.521656-48.521656l-0.459679-4.494637A48.521656 48.521656 0 0 1 789.575269 3.742807l2.298394-2.272856a307.218694 307.218694 0 0 1 169.851333 546.328305c0.178764 2.043017 0.612905 4.034959 0.612905 6.154589a460.036371 460.036371 0 0 1 266.15405 407.122229 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-50.973276 51.075427z m-527.711312-472.4477a460.215135 460.215135 0 0 1 271.057291 409.650463 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477c0-1.22581 0.280915-2.375007 0.357528-3.575279a358.447347 358.447347 0 0 0-329.104514-349.866676c-9.678793 0.919358-19.4342 1.481187-29.317295 1.481188s-19.664039-0.56183-29.317296-1.481188a358.651649 358.651649 0 0 0-329.436504 357.323688v0.178764h-0.995971v0.612905a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477a50.845588 50.845588 0 0 1 1.685489-12.385791 460.291748 460.291748 0 0 1 271.772348-404.593995 307.93375 307.93375 0 1 1 377.345255 0.459679zM461.74764 102.599296a204.863538 204.863538 0 1 0 204.914614 205.042302 204.889076 204.889076 0 0 0-204.914614-204.965689z" p-id="20330"></path></svg>