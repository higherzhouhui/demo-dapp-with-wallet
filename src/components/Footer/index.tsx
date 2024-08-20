import './index.scss';
import { useState } from 'react';
import EventBus from '@/utils/eventBus';

export default function () {
    const eventBus = EventBus.getInstance()
    const [currentTab, setCurrentTab] = useState('Home')
    const handleClickTab = (title: string) => {
        setCurrentTab(title)
        eventBus.emit('changeFooterTab', title)
    }
    const [menu, setMenu] = useState([
        {
            title: 'Home',
            icon: HomeIcon
        },
        {
            title: 'Leaderboard',
            icon: LeaderBoardIcon
        },
        {
            title: 'Friends',
            icon: FriendsIcon
        },
    ])
    return <footer className="footer">
        <div className='list'>
            {
                menu.map((item => {
                    return <div className={`menu ${currentTab == item.title ? 'active' : ''}`} key={item.title} onClick={() => handleClickTab(item.title)}>
                        {item.icon}
                        <p>{item.title}</p>
                    </div>
                }))
            }
        </div>
    </footer>
}

var HomeIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2342" width="64" height="64"><path d="M837.456896 946.192384 647.790592 946.192384c-14.997504 0-27.15648-12.158976-27.15648-27.15648L620.634112 647.810048 404.29056 647.810048l-0.90112 271.31904c-0.039936 14.956544-12.1856 27.063296-27.15648 27.063296l-189.679616 0c-14.99648 0-27.15648-12.158976-27.15648-27.15648L159.396864 463.486976c0-14.99648 12.16-27.155456 27.15648-27.155456s27.15648 12.158976 27.15648 27.155456l0 428.393472 135.487488 0 0.862208-271.225856c0.039936-14.969856 12.1856-27.075584 27.155456-27.075584l270.57664 0c14.997504 0 27.15648 12.158976 27.15648 27.155456l0 271.173632 135.327744 0L810.27584 463.486976c0-14.99648 12.158976-27.155456 27.15648-27.155456 14.99648 0 27.15648 12.158976 27.15648 27.155456l0 455.548928C864.586752 934.033408 852.4544 946.179072 837.456896 946.192384zM920.687616 559.141888c-7.399424 0.014336-14.47936-3.009536-19.598336-8.352768L513.05984 144.19456 122.88 550.762496c-10.382336 10.832896-27.580416 11.177984-38.4 0.795648-10.819584-10.38336-11.164672-27.580416-0.782336-38.4l0 0 409.76384-426.98752c5.117952-5.343232 12.198912-8.353792 19.598336-8.367104l0 0c7.3984 0.013312 14.466048 3.023872 19.584 8.367104L940.285952 513.171456c10.395648 10.807296 10.05056 28.004352-0.755712 38.4-5.064704 4.852736-11.800576 7.571456-18.829312 7.571456L920.687616 559.142912z" p-id="2343"></path></svg>
var LeaderBoardIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17560" xmlnsXlink="http://www.w3.org/1999/xlink" width="64" height="64"><path d="M682.666667 469.333333V128H341.333333v256H85.333333v512h853.333334V469.333333h-256z m-256-256h170.666666v597.333334h-170.666666V213.333333z m-256 256h170.666666v341.333334H170.666667v-341.333334z m682.666666 341.333334h-170.666666v-256h170.666666v256z" p-id="17561"></path></svg>
var FriendsIcon = <svg className="icon" viewBox="0 0 1230 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20329" xmlnsXlink="http://www.w3.org/1999/xlink" width="76.875" height="64"><path d="M1178.69341 1023.872311a51.075427 51.075427 0 0 1-51.075427-51.075427l-0.459679-4.724477c0-0.868282 0.204302-1.659951 0.255377-2.553771a357.987668 357.987668 0 0 0-204.965689-317.484854c-4.494638-6.409966-9.372341-12.487942-14.122355-18.642531a70.433014 70.433014 0 0 1-87.287905-68.951827l-0.638443-6.58873a70.841617 70.841617 0 0 1 1.430112-14.275582c-1.149197-0.970433-2.221781-2.017479-3.370978-2.962374l6.231202-6.231203a70.662853 70.662853 0 0 1 43.209811-43.209811l3.856195-3.881732A204.020793 204.020793 0 0 0 819.454394 109.341253c-1.813178-3.268827-4.13711-6.180127-6.026901-9.397879a47.985364 47.985364 0 0 1-21.170764 5.107543 48.521656 48.521656 0 0 1-48.521656-48.521656l-0.459679-4.494637A48.521656 48.521656 0 0 1 789.575269 3.742807l2.298394-2.272856a307.218694 307.218694 0 0 1 169.851333 546.328305c0.178764 2.043017 0.612905 4.034959 0.612905 6.154589a460.036371 460.036371 0 0 1 266.15405 407.122229 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-50.973276 51.075427z m-527.711312-472.4477a460.215135 460.215135 0 0 1 271.057291 409.650463 48.521656 48.521656 0 0 1 0.715056 6.997333l0.459679 4.724477a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477c0-1.22581 0.280915-2.375007 0.357528-3.575279a358.447347 358.447347 0 0 0-329.104514-349.866676c-9.678793 0.919358-19.4342 1.481187-29.317295 1.481188s-19.664039-0.56183-29.317296-1.481188a358.651649 358.651649 0 0 0-329.436504 357.323688v0.178764h-0.995971v0.612905a51.075427 51.075427 0 0 1-102.150854 0l-0.459679-4.724477a50.845588 50.845588 0 0 1 1.685489-12.385791 460.291748 460.291748 0 0 1 271.772348-404.593995 307.93375 307.93375 0 1 1 377.345255 0.459679zM461.74764 102.599296a204.863538 204.863538 0 1 0 204.914614 205.042302 204.889076 204.889076 0 0 0-204.914614-204.965689z" p-id="20330"></path></svg>