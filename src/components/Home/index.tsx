import EventBus from "@/utils/eventBus";
import Footer from "../Footer";
import './index.scss'
import { useEffect, useState } from "react";
import starIcon from '@/assets/h-star.png'
import checkIcon from '@/assets/h-right.png'
import friendsIcon from '@/assets/h-friends.png'
import gameIcon from '@/assets/game.png'
import taskIcon from '@/assets/task.png'
import walletIcon from '@/assets/wallet.png'
import No1 from '@/assets/NO.1.png'
import No2 from '@/assets/NO.2.png'
import No3 from '@/assets/NO.3.png'
import gameInfoIcon from '@/assets/gameinfo.png'
import { Button, Toast } from "antd-mobile";
import { formatNumber, formatWalletAddress, judgeIsCheckIn, stringToColor } from '@/utils/common'
import { InfiniteScroll, List } from 'antd-mobile'
import { useDispatch, useSelector } from "react-redux";
import { getSubUserListReq, getUserInfoReq, getUserListReq, userCheckReq, bindWalletReq } from "@/api/common";
import { initUtils } from '@telegram-apps/sdk-react';
import { setUserInfoAction } from "@/redux/slices/userSlice";
import LogoIcon from '@/assets/logo.jpg'
import GameComp from "@/components/Game";
import { TonConnectButton, useTonConnectModal, useTonWallet } from "@tonconnect/ui-react";

export default function () {
  const userInfo = useSelector((state: any) => state.user.info);
  const eventBus = EventBus.getInstance()
  const [currentTab, setCurrentTab] = useState<any>('Home')
  const [showGame, setShowGame] = useState(false)
  const [isLookGameInfo, setIsLookGameInfo] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    const onMessage = (title: string) => {
      setCurrentTab(title)
    }
    eventBus.addListener('changeFooterTab', onMessage)
  }, [])

  const handleGameNext = () => {
    localStorage.setItem('isLookGameInfo', '1')
    setIsLookGameInfo(true)
  }

  useEffect(() => {
    const localIsLookGameInfo = localStorage.getItem('isLookGameInfo')
    if (localIsLookGameInfo == '1') {
      setIsLookGameInfo(true)
    }
  }, [])
  useEffect(() => {
    if (!showGame) {
      getUserInfoReq({}).then(res => {
        if (res.code == 0) {
          dispatch(setUserInfoAction(res.data.userInfo))
        }
      })
    }
  }, [showGame])
  return <main>
    {
      currentTab == 'Home' ? <Home userInfo={userInfo} setShowGame={() => setShowGame(true)} /> : currentTab == 'Leaderboard' ? <LeaderBoard userInfo={userInfo} /> : <Friends userInfo={userInfo} />
    }
    <Footer />
    {
      showGame ? <div className="gameComp">
        {
          isLookGameInfo ?
            <>
              <GameComp />
              <div className={`close ${showGame ? 'close-fadeIn' : ''}`} onClick={() => setShowGame(false)}>
                <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1802" width="30" height="30"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#F55300" p-id="1803"></path><path d="M258.56 358.912l434.432 434.432a51.2 51.2 0 0 0 72.3968-72.3968L330.9568 286.5152A51.2 51.2 0 1 0 258.56 358.912z" fill="#F9F9F9" p-id="1804"></path><path d="M258.56 712.192l434.432-434.432a51.2 51.2 0 0 1 72.448 72.3968l-434.4832 434.432A51.2 51.2 0 1 1 258.56 712.192z" fill="#F9F9F9" p-id="1805"></path></svg>
              </div>
            </>
            : <div className="gameComp-img">
              <img src={gameInfoIcon} alt="gameInfo" />
              <div className="btn-wrapper"><Button onClick={() => handleGameNext()}>Continue</Button></div>
            </div>
        }
      </div> : null
    }
  </main>
}

function Home({ userInfo, setShowGame }: { userInfo: any, setShowGame: () => void }) {
  const eventBus = EventBus.getInstance()
  const utils = initUtils();
  const [loading, setLoading] = useState(false)
  const modal = useTonConnectModal()
  const wallet = useTonWallet()
  const dispatch = useDispatch()
  const handleToScore = async () => {
    eventBus.emit('updateStep', 2)
  }
  const handleCheckIn = async () => {
    if (judgeIsCheckIn(userInfo.check_date)) {
      return
    }
    setLoading(true)
    const res = await userCheckReq()
    if (res.code == 0) {
      Toast.show({
        icon: 'success',
        content: 'Congratulations check-in successful',
        duration: 3000,
      })
      dispatch(setUserInfoAction(res.data))
    }
    setLoading(false)
  }
  const handleConnect = () => {
    if (!wallet?.account) {
      modal.open()
    }
  }
  const handlePlayGame = () => {
    if (userInfo?.playGameTimes) {
      setShowGame()
    } else {
      Toast.show({
        content: 'The number of times today has been used up',
        duration: 3000,
      })
    }
  }
  useEffect(() => {
    if (wallet?.account) {
      bindWalletReq({ wallet: wallet?.account?.address }).then(res => {
        dispatch(setUserInfoAction(res.data))
      })
    }
  }, [wallet])
  return <div className="home fadeIn">
    <div className="top" onClick={() => handleToScore()}>
      <div className="top-inner">
        {videoIcon}
        <span>Your Score</span>
      </div>
    </div>
    <div className="logo">
      <img src={LogoIcon} alt="logo" style={{ width: '30vw', objectFit: 'contain' }} />
      <Button className="sign" onClick={() => handleCheckIn()} size="small" loading={loading}>
        {judgeIsCheckIn(userInfo.check_date) ? 'checked' : 'Check In'}
      </Button>
    </div>
    <div className="score">
      {userInfo.score.toLocaleString()}
      <div style={{ fontSize: '1.5rem', opacity: 0.8, lineHeight: '24px' }}>Hamsters</div>
    </div>
    <div className="wallet">
      {/* <Button color="default" style={{ width: '100%', borderRadius: '10px', fontWeight: 'bold' }} onClick={() => handleConnect()}>

        {
          wallet?.account ? formatWalletAddress(wallet?.account?.publicKey) :
            <div className="connect">
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4695" width="20" height="20"><path d="M128 341.333333C55.466667 341.333333 0 285.866667 0 213.333333s55.466667-128 128-128c25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 170.666667 128 170.666667C102.4 170.666667 85.333333 187.733333 85.333333 213.333333s17.066667 42.666667 42.666667 42.666667c25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 341.333333 128 341.333333z" p-id="4696" fill="#2c2c2c"></path><path d="M128 938.666667c-72.533333 0-128-55.466667-128-128 0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667c0 25.6 17.066667 42.666667 42.666667 42.666667 25.6 0 42.666667 17.066667 42.666667 42.666667S153.6 938.666667 128 938.666667z" p-id="4697" fill="#2c2c2c"></path><path d="M981.333333 938.666667 128 938.666667c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667l810.666667 0L938.666667 341.333333 128 341.333333C102.4 341.333333 85.333333 324.266667 85.333333 298.666667s17.066667-42.666667 42.666667-42.666667l853.333333 0c25.6 0 42.666667 17.066667 42.666667 42.666667l0 597.333333C1024 921.6 1006.933333 938.666667 981.333333 938.666667z" p-id="4698" fill="#2c2c2c"></path><path d="M896 341.333333c-25.6 0-42.666667-17.066667-42.666667-42.666667L853.333333 170.666667 128 170.666667C102.4 170.666667 85.333333 153.6 85.333333 128s17.066667-42.666667 42.666667-42.666667l768 0c25.6 0 42.666667 17.066667 42.666667 42.666667l0 170.666667C938.666667 324.266667 921.6 341.333333 896 341.333333z" p-id="4699" fill="#2c2c2c"></path><path d="M42.666667 853.333333c-25.6 0-42.666667-17.066667-42.666667-42.666667L0 213.333333c0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667l0 597.333333C85.333333 836.266667 68.266667 853.333333 42.666667 853.333333z" p-id="4700" fill="#2c2c2c"></path><path d="M768 597.333333m-85.333333 0a2 2 0 1 0 170.666667 0 2 2 0 1 0-170.666667 0Z" p-id="4701" fill="#2c2c2c"></path></svg>
              Connect Wallet
            </div>
        }
      </Button> */}
      <TonConnectButton className="connect-btn" />
    </div>
    <div className="wrapper">
      <div className="community">
        <div className="Hamsters-com">Hamster COMMUNITY</div>
        <div className="home-tg">Home for Telegram OGs</div>
        <div className="join-btn" onClick={() => {
          utils.openTelegramLink('https://t.me/hamstermemedapp')
        }}>Join 💰</div>
        <div className="heart">💖</div>
      </div>
      <div onClick={() => handlePlayGame()} className="earn-more">
        {/* <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3576" width="24" height="24"><path d="M687.36 260.352c134.101333-0.938667 245.376 99.626667 251.093333 230.997333 0.213333 5.290667 0.256 10.581333 0.128 15.829334v183.765333a239.445333 239.445333 0 0 1-66.986666 171.733333 239.786667 239.786667 0 0 1-185.130667 74.325334 9757.866667 9757.866667 0 0 1-176.725333 1.536c-58.453333 0-116.736-0.469333-173.952-1.493334-131.626667 6.528-244.394667-97.792-250.24-230.912a278.698667 278.698667 0 0 1-0.170667-15.786666v-183.893334c-2.901333-132.608 103.168-243.370667 236.373333-246.272 5.205333-0.085333 10.496 0 15.829334 0.213334l168.96-0.042667v-9.813333a53.589333 53.589333 0 0 0-53.589334-52.437334H410.453333c-22.058667-0.938667-43.050667-8.234667-59.008-23.936a83.029333 83.029333 0 0 1-25.045333-58.752A29.781333 29.781333 0 0 1 355.84 85.333333h0.341333c16.256 0 29.568 13.141333 29.738667 29.482667a23.466667 23.466667 0 0 0 7.253333 16.853333 23.722667 23.722667 0 0 0 16.682667 6.869334h43.349333a113.365333 113.365333 0 0 1 112.896 111.658666v39.893334a29.781333 29.781333 0 0 1-29.781333 29.781333H334.677333a182.314667 182.314667 0 0 0-189.781333 185.941333v185.130667a181.845333 181.845333 0 0 0 190.08 186.624c115.968 1.962667 233.856 1.962667 352.256-0.042667a180.736 180.736 0 0 0 141.354667-56.021333 180.650667 180.650667 0 0 0 50.474666-129.92V506.453333a151.04 151.04 0 0 0-0.128-12.586666c-4.394667-100.565333-86.4-176.085333-190.805333-173.994667a29.525333 29.525333 0 0 1-30.122667-29.354667 29.781333 29.781333 0 0 1 29.354667-30.165333z m-267.264 410.88a32.768 32.768 0 0 1-32.512 32.256h-0.384a32.384 32.384 0 0 1-32.085333-32.256V628.48h-43.093334a32.554667 32.554667 0 0 1-31.018666-14.933333 32.042667 32.042667 0 0 1 0-34.261334 32.554667 32.554667 0 0 1 31.018666-14.933333h43.093334v-42.410667c0-17.834667 14.506667-32.256 32.469333-32.256 17.92 0 32.512 14.421333 32.512 32.256v42.368h43.093333a32.554667 32.554667 0 0 1 31.018667 14.933334 32.085333 32.085333 0 0 1 0 34.261333 32.597333 32.597333 0 0 1-31.061333 14.933333h-43.093334v42.794667z m197.589333-166.186667a29.141333 29.141333 0 0 1 10.24-7.125333 32 32 0 0 1 24.149334 0c4.053333 1.706667 7.765333 4.138667 10.965333 7.125333a32.128 32.128 0 0 1 7.168 34.901334 26.282667 26.282667 0 0 1-7.168 10.496 33.066667 33.066667 0 0 1-45.354667 0 31.018667 31.018667 0 0 1 0-45.397334z m72.192 142.933334a31.701333 31.701333 0 0 0 0.170667 44.970666c12.544 12.373333 32.810667 12.373333 45.354667 0a31.701333 31.701333 0 0 0-10.410667-52.096 32.682667 32.682667 0 0 0-35.114667 7.125334z" fill="#200E32" p-id="3577"></path></svg> */}
        <span>Play</span>
        <span>
          {userInfo?.playGameTimes}
        </span>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9591" width="20" height="20"><path d="M639.298 382.771c-17.203-17.174-37.83-30.954-60.328-40.258a186.727 186.727 0 0 0-71.154-14.13c-24.342 0-48.684 4.827-71.153 14.13-22.499 9.304-43.125 23.055-60.328 40.258-17.204 17.174-30.984 37.8-40.317 60.24-9.303 22.47-14.16 46.754-14.16 71.066 0 24.313 4.827 48.596 14.16 71.066a185.483 185.483 0 0 0 40.317 60.24c17.203 17.174 37.83 30.954 60.328 40.258 22.47 9.304 46.811 14.131 71.153 14.131 24.342 0 48.655-4.827 71.154-14.13 22.47-9.305 43.125-23.055 60.328-40.259 17.203-17.174 30.983-37.77 40.287-60.24 9.304-22.44 14.16-46.753 14.16-71.066 0-24.312-4.856-48.596-14.16-71.065-9.275-22.44-23.055-43.038-40.287-60.24z m279.26 84.758c-16.648-199.534-162.963-348.365-362.79-362.203V0h-85.4v106.7c-194.24 17.994-348.278 165.45-364.925 360.83H0v87.127h105.443c16.647 195.38 168.843 343.245 363.08 362.642V1024h87.216V918.674c199.797-13.868 346.142-164.513 362.789-364.046H1024v-87.099H918.557zM512 847.082c-184.525 0-334.848-151.464-334.848-334.38C177.152 329.787 328.85 176.48 512 176.48c184.554 0 334.848 153.308 334.848 336.223 0 182.887-150.323 334.38-334.848 334.38z" fill="#000000" p-id="9592"></path></svg>      </div>
      <div className="reward">
        Your rewards
      </div>
      <div className="list">
        <div className="left">
          <div className="img-wrapper"><img src={starIcon} alt="star" /></div>
          <span>Account Age</span></div>
        <div className="right">+{userInfo.account_age_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
      </div>
      {
        userInfo.invite_friends_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={friendsIcon} alt="star" /></div>
            <span>Invited Friends</span></div>
          <div className="right">+{userInfo.invite_friends_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo.game_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={gameIcon} alt="star" /></div>
            <span>Play Game</span></div>
          <div className="right">{userInfo.game_score > 0 ? `+${userInfo.game_score}` : userInfo.game_score}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo.check_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={taskIcon} alt="star" /></div>
            <span>Daily Check-in</span></div>
          <div className="right">+{userInfo.check_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      {
        userInfo.bind_wallet_score ? <div className="list">
          <div className="left">
            <div className="img-wrapper"><img src={walletIcon} alt="star" /></div>
            <span>Connect Wallet</span></div>
          <div className="right">+{userInfo.bind_wallet_score || 0}&nbsp;<span className="unit">Hamsters</span></div>
        </div> : ''
      }
      <div className="list">
        <div className="left">
          <div className="img-wrapper"><img src={checkIcon} alt="star" /></div>
          <span>Telegram Premium</span></div>
        <div className="right">{userInfo.telegram_premium ? `+${userInfo.telegram_premium}` : 0}&nbsp;<span className="unit">Hamsters</span></div>
      </div>
    </div>
  </div>
}

function LeaderBoard({ userInfo }: { userInfo: any }) {
  const [total, setTotal] = useState('10.00M')
  const [holderList, setHolderList] = useState<any[]>([])
  const [rank, setRank] = useState(1)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()

  async function loadMore() {
    const append = await getList()
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setHolderList(append)
    } else {
      setHolderList(val => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  const getList = async () => {
    const res = await getUserListReq({ page })
    setTotal(formatNumber(res.data.count))
    setPage((page => page + 1))
    setRank(res.data.rank)
    return res.data.rows
  }

  useEffect(() => {
    getUserInfoReq({}).then(res => {
      if (res.code == 0) {
        dispatch(setUserInfoAction(res.data.userInfo))
      }
    })
  }, [])

  return <div className="LeaderBoard fadeIn">
    <div className="title">Telegram Wall of Fame</div>
    <div className="myself">
      <div className="left">
        <div className="icon" style={{ background: stringToColor(userInfo.username) }}>
          {userInfo.username.slice(0, 2)}
        </div>
        <div className="name-score-warpper">
          <div className="name">{userInfo.username}</div>
          <div className="name-score">{userInfo.score.toLocaleString()}&nbsp;Hamsters</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src={No1} alt="no1" /> : rank == 2 ? <img src={No2} alt="no2" /> : rank == 3 ? <img src={No3} alt="no3" /> : `#${rank}`
        }
      </div>
    </div>
    {/* <Button color="primary" style={{ margin: '1rem 0', width: '100%', fontWeight: 'bold' }}>
      <img src={bIcon} alt="star" width={16} height={16} style={{ marginRight: '1rem' }} />
      Boost score
    </Button> */}
    <div className="holders">
      <div className="holder-title">{total}&nbsp;holders</div>
      <List>
        {
          holderList.map((item, index) => {
            return <List.Item key={index}>
              <ListItem {...{ ...item, rank: index + 1 }} />
            </List.Item>
          })
        }
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  </div>
}

function ListItem({ username, score, rank }: { username: string, score: number, rank: number }) {
  return <div className="holders-item">
    <div className="holders-left">
      <div className="icon" style={{ background: stringToColor(username) }}>
        {
          username.slice(0, 2)
        }
      </div>
      <div className="name-score-wrapper">
        <div className="name">{username}</div>
        <div className="name-score">{score.toLocaleString()}&nbsp;Hamsters</div>
      </div>
    </div>
    <div className="right">
      {
        rank == 1 ? <img src={No1} alt="no1" /> : rank == 2 ? <img src={No2} alt="no2" /> : rank == 3 ? <img src={No3} alt="no3" /> : `#${rank}`
      }
    </div>
  </div>
}

function Friends({ userInfo }: { userInfo: any }) {
  const utils = initUtils()
  const [isCopy, setIsCopy] = useState(false)
  const link = `https://t.me/HamstersTon_bot/Hamster?startapp=${btoa(userInfo.user_id)}`;
  const [friendsList, setFriendsList] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  async function loadMore() {
    const append = await getList()
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setFriendsList(append)
    } else {
      setFriendsList(val => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  const getList = async () => {
    const res = await getSubUserListReq({ page })
    setTotal(res.data.count)
    setPage((page => page + 1))
    return res.data.rows
  }
  const handleShare = () => {
    utils.shareURL(link, ``)
  }
  const copy = () => {
    const textToCopy = link; // 替换为你想要复制的内容  
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setIsCopy(true)
    setTimeout(() => {
      setIsCopy(false)
    }, 3000);
  }
  return <div className="friends fadeIn">
    <div className="friends-title">
      <div>Invite friends</div>
      <div>and get more Hamsters</div>
    </div>
    <div className="logo">
      <img src={LogoIcon} alt="logo" style={{ width: '40vw', objectFit: 'contain' }} />
    </div>
    <div className="friends-list-wrapper">

      {
        !total ? <div className="tap-desc">Tap on the button to invite your friends</div> : <div className="friends-list-title">{total}&nbsp;&nbsp;friends</div>
      }
      <List>
        {
          friendsList.map((item, index) => {
            return <List.Item key={index}>
              <div className="friends-list" key={index}>
                <div className="fl-left">
                  <div className="icon" style={{ background: stringToColor(item.from_username || 'cc') }}>
                    {
                      (item.from_username || 'cc').slice(0, 2)
                    }
                  </div>
                  <div className="name">{item.from_username || 'cc'}</div>
                </div>
                <div className="fl-right">
                  +{item.score}&nbsp;Hamsters
                </div>
              </div>
            </List.Item>
          })
        }
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} children={<div></div>} />
    </div>
    <div className="invite-btn">
      <Button color="default" style={{ fontWeight: 'bold', flex: 1 }} onClick={() => handleShare()}>👆🏻 Invite friends</Button>
      <Button color="default" className="copy" onClick={() => copy()}>
        {
          isCopy ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3786" width="18" height="18"><path d="M416.832 798.08C400.64 798.08 384.512 791.872 372.16 779.52L119.424 525.76C94.784 500.992 94.784 460.8 119.424 436.032 144.128 411.264 184.128 411.264 208.768 436.032L416.832 644.928 814.4 245.76C839.04 220.928 879.04 220.928 903.744 245.76 928.384 270.528 928.384 310.656 903.744 335.424L461.504 779.52C449.152 791.872 432.96 798.08 416.832 798.08Z" fill="#272636" p-id="3787"></path></svg> : <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="18" height="18"><path d="M878.272 981.312H375.36a104.64 104.64 0 0 1-104.64-104.64V375.36c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v502.912c-1.6 56.192-48.448 103.04-104.64 103.04z m-502.912-616.96a10.688 10.688 0 0 0-10.944 11.008v502.912c0 6.208 4.672 10.88 10.88 10.88h502.976c6.208 0 10.88-4.672 10.88-10.88V375.36a10.688 10.688 0 0 0-10.88-10.944H375.36z" fill="#2c2c2c" p-id="2453"></path><path d="M192.64 753.28h-45.312a104.64 104.64 0 0 1-104.64-104.64V147.328c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v49.92a46.016 46.016 0 0 1-46.848 46.912 46.08 46.08 0 0 1-46.848-46.848v-49.984a10.688 10.688 0 0 0-10.944-10.944H147.328a10.688 10.688 0 0 0-10.944 10.88v502.976c0 6.208 4.672 10.88 10.88 10.88h45.312a46.08 46.08 0 0 1 46.848 46.912c0 26.496-21.824 45.248-46.848 45.248z" fill="#2c2c2c" p-id="2454"></path></svg>
        }
      </Button>
    </div>
  </div>
}








var LOGO = <svg id="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 237 242" fill="none" className="readyToFadeOut">
  <path d="M106.886 26.7252C106.899 26.7042 106.907 26.6807 106.91 26.6547C106.911 26.6263 106.926 26.6102 106.954 26.6065C108.102 26.4495 109.072 26.3635 109.864 26.3487C110.801 26.3302 112.066 26.4 113.657 26.5583C113.732 26.5657 113.791 26.6009 113.833 26.664C113.892 26.7549 113.987 26.8086 114.096 26.8142C115.618 26.8884 116.83 27.0027 117.733 27.1573C119.61 27.4781 121.542 27.8101 123.439 28.3293C124.969 28.7503 126.447 29.2269 127.992 29.3382C131.488 29.5904 134.921 28.8709 138.214 27.7044C141.337 26.5991 144.38 25.3003 147.342 23.808C149.682 22.6285 151.966 21.4657 154.195 20.3196C155.321 19.7398 156.412 19.1581 157.466 18.5745C163.344 15.3229 168.573 12.5683 173.152 10.3107C174.951 9.42424 177.144 8.39992 179.73 7.23775C182.874 5.82459 186.126 4.5425 189.485 3.39145C190.517 3.03785 191.697 2.67313 193.025 2.29727C198.741 0.678267 204.905 -0.328744 210.838 0.181253C214.587 0.502705 218.121 1.41884 221.44 2.92967C223.569 3.89897 225.702 5.22187 227.838 6.89837C230.257 8.79617 232.613 11.1885 234.908 14.0754C235.754 15.1374 236.329 16.3336 236.634 17.6639C236.863 18.6629 236.984 19.8745 236.998 21.2988C237.018 23.3363 236.887 25.0827 236.605 26.5379C235.429 32.617 232.814 38.494 229.344 43.4419C225.571 48.825 220.992 53.2741 215.606 56.789C214.604 57.443 213.52 58.1014 212.353 58.7641C210.604 59.7563 208.933 60.7577 207.136 61.7035C201.482 64.6763 197.074 66.8387 191.953 69.3646C191.569 69.5538 191.177 69.767 190.777 70.0044C189.902 70.5255 188.977 70.9354 188.246 71.6364C187.827 72.0394 187.461 72.4833 187.148 72.9679C186.317 74.2575 185.614 75.848 185.04 77.7397C184.428 79.7524 184.031 81.1328 183.849 81.8808C183.103 84.9359 182.399 88.2116 181.735 91.708C181.086 95.1253 180.476 98.4894 179.904 101.8C178.819 108.092 177.803 113.812 176.855 118.959C176.588 120.411 176.344 121.866 176.056 123.302C175.793 124.622 175.626 125.956 175.344 127.252C175.075 128.504 174.869 129.798 174.604 131.013C174.388 132.011 174.201 132.98 174.044 133.921C173.985 134.278 173.902 134.645 173.797 135.021C173.478 136.144 173.382 137.341 173.067 138.435C172.776 139.447 172.716 140.512 172.432 141.523C172.316 141.938 172.214 142.363 172.125 142.797C172.033 143.25 171.941 143.683 171.848 144.095C171.282 146.623 170.65 149.338 169.951 152.24C169.41 154.484 168.907 156.164 168.262 158.671C168.008 159.657 167.729 160.656 167.425 161.67C167.141 162.612 166.932 163.554 166.639 164.495C166.433 165.153 166.296 165.839 166.07 166.494C165.979 166.755 165.894 167.018 165.814 167.284C163.582 174.577 161.218 181.264 158.722 187.344C156.771 192.099 154.41 197.036 151.639 202.153C151.294 202.791 150.912 203.408 150.566 204.05C149.769 205.515 148.772 207.193 147.574 209.083C145.783 211.91 143.737 214.759 141.438 217.631C140.405 218.921 139.246 220.214 138.144 221.436C134.52 225.461 130.48 228.979 126.023 231.99C123.974 233.375 121.827 234.616 119.582 235.714C114.345 238.274 108.892 239.975 103.223 240.818C101.642 241.053 100.687 241.189 100.358 241.226C99.3861 241.334 98.4205 241.399 97.4611 241.423C95.8328 241.461 94.4382 241.369 92.8767 240.905C91.4796 240.49 90.3286 240.065 89.4236 239.631C88.2737 239.08 87.1128 238.535 86.0168 237.895C82.6316 235.923 79.3788 233.551 76.2582 230.779C76.1618 230.695 76.0555 230.613 75.9392 230.533C75.726 230.39 75.6351 230.13 75.4107 229.976C75.3031 229.902 75.1987 229.82 75.0973 229.73C74.5681 229.256 74.0482 228.76 73.5376 228.242C73.4356 228.139 73.3652 227.975 73.2353 227.905C72.9831 227.765 72.8088 227.575 72.7124 227.336C72.6753 227.243 72.6091 227.182 72.5139 227.152C72.2432 227.064 72.0787 226.879 72.0206 226.597C71.9934 226.469 71.9155 226.395 71.7869 226.377C71.5224 226.337 71.374 226.179 71.3419 225.902C71.3355 225.851 71.3181 225.801 71.2909 225.757C71.2637 225.713 71.2273 225.675 71.1842 225.646C71.1348 225.614 71.0798 225.597 71.0192 225.594C70.9733 225.592 70.9285 225.58 70.8878 225.558C70.8472 225.537 70.8116 225.507 70.7836 225.47C70.7181 225.381 70.6668 225.281 70.6297 225.169C70.5296 224.869 70.2941 224.8 70.1105 224.582C68.2275 222.334 66.7877 220.283 65.7912 218.428C64.7564 216.499 63.8904 214.335 62.9241 212.308C60.1219 206.442 57.5534 200.269 55.7415 194.082C55.3966 192.904 54.97 191.274 54.4619 189.191C54.2653 188.382 54.1077 187.586 53.989 186.805C53.8277 185.733 53.5291 184.696 53.4011 183.62C53.2738 182.544 53.131 181.449 52.9727 180.338C52.4034 176.353 52.4052 172.36 52.3922 168.354C52.3898 167.413 52.3273 166.408 52.2049 165.339C51.975 163.329 51.7735 161.257 51.6004 159.122C51.1948 154.104 50.7837 149.03 50.3671 143.9C50.2645 142.627 50.1514 141.377 50.0277 140.152C49.7699 137.591 49.5752 135.069 49.2618 132.519C49.0151 130.509 48.8223 128.591 48.494 126.588C48.3531 125.737 48.2109 124.863 48.0675 123.964C47.8116 122.362 47.4716 120.848 47.0475 119.422C46.6469 118.072 46.3347 116.902 46.1109 115.912C45.3456 112.512 44.5099 108.957 43.6036 105.248C43.0139 102.835 42.4272 100.395 41.8437 97.93C41.6866 97.266 41.5179 96.6145 41.3374 95.9753C41.1853 95.4387 41.0196 94.8045 40.8404 94.0725C39.1676 87.2355 37.4707 80.4059 35.7497 73.5837C35.2119 71.4522 34.7414 69.6632 34.3384 68.2166C34.2642 67.9533 34.1634 67.7011 34.0361 67.46C33.6516 66.7355 33.2541 66.0097 32.8436 65.2828C32.6718 64.9811 32.4727 64.6992 32.2465 64.4371C29.5537 61.3308 26.3453 58.6973 23.1518 56.1177C20.6161 54.069 18.0747 51.992 15.5279 49.8864C12.8017 47.6301 10.2703 45.1759 7.93355 42.5239C7.34937 41.86 6.79857 41.1386 6.25148 40.4339C5.66298 39.676 4.98546 38.6659 4.21892 37.4036C1.43835 32.8303 0.319452 27.8583 0.862212 22.4876C0.933921 21.7816 1.0421 21.0886 1.18676 20.4086C1.37406 19.5277 1.46679 18.6524 1.71344 17.7863C2.36871 15.4855 3.24281 13.2056 4.33575 10.9468C5.59498 8.34861 7.26591 6.37354 9.72131 4.96409C11.1567 4.14068 12.8536 3.50272 14.5654 3.18374C16.0304 2.91112 17.4751 2.53651 18.9606 2.56618C20.3045 2.59462 21.5841 2.60451 22.7995 2.59585C23.6266 2.58967 24.4333 2.64469 25.2196 2.76091C26.5463 2.95625 27.79 3.13614 28.951 3.30058C30.3196 3.49345 31.8032 3.91072 33.1607 4.26493C35.673 4.91897 38.1686 5.8042 40.6475 6.92062C41.2286 7.18397 41.7658 7.45535 42.2591 7.73476C42.9916 8.15203 43.7575 8.48399 44.4715 8.93835C47.0926 10.6062 49.5857 12.3569 51.9509 14.1904C53.6645 15.5182 55.4708 17.0025 57.3698 18.6431C59.8907 20.8228 62.28 22.924 64.5376 24.9467C66.8619 27.0287 69.1999 29.0557 71.5514 31.0277C71.8482 31.2743 72.169 31.5785 72.5621 31.6508C73.2149 31.7707 73.728 31.8103 74.1014 31.7695C75.747 31.5915 77.4006 31.419 79.0623 31.2521C79.997 31.1594 80.8612 30.9294 81.794 30.7847C83.0106 30.5968 84.2092 30.3805 85.3899 30.1357C88.2113 29.5496 91.5124 28.8876 95.2931 28.1495C96.9622 27.8231 98.5794 27.6524 100.211 27.352C102.366 26.9588 104.482 26.9051 106.628 26.8772C106.678 26.8767 106.727 26.8625 106.772 26.8359C106.817 26.8094 106.856 26.7713 106.886 26.7252ZM157.285 49.5285C157.394 49.537 157.498 49.5824 157.578 49.6572C157.658 49.7321 157.71 49.8319 157.726 49.9402C157.892 51.0999 158.405 52.0983 159.267 52.9353C159.721 53.3785 160.335 53.7439 160.981 53.5751C161.671 53.3958 162.339 53.1504 162.985 52.8388C163.983 52.3585 164.456 51.2959 164.673 50.2777C165.04 48.5697 165.064 46.7486 165.064 45.0109C165.064 42.1159 165.719 38.4736 169.085 37.7207C169.954 37.5254 170.872 37.3251 171.837 37.1198C171.898 37.1067 171.955 37.0781 172.002 37.0368C172.049 36.9956 172.085 36.943 172.106 36.8842C172.126 36.8254 172.132 36.7623 172.121 36.7009C172.11 36.6396 172.084 36.582 172.045 36.5338C171.342 35.6714 170.845 34.7108 169.855 34.0858C169.525 33.8781 169.534 33.4942 169.793 33.2364C170.293 32.7419 170.826 32.2838 171.392 31.8622C171.691 31.6397 172.731 30.7903 172.084 30.3823C171.32 29.9001 170.548 29.3598 169.769 28.7615C169.052 28.2088 168.36 28.4221 167.577 28.7077C166.887 28.9599 166.359 29.3543 165.993 29.8909C165.619 30.438 165.369 31.0796 164.829 31.4821C164.415 31.7899 163.962 31.9642 163.469 32.005C162.108 32.1163 160.671 32.3092 159.3 32.2851C158.206 32.2647 157.138 32.1423 156.085 32.4909C155.789 32.5886 155.508 32.7901 155.241 33.0955C154.596 33.8355 153.59 34.9482 154.805 35.716C155.293 36.025 155.795 36.3088 156.309 36.5672C157.108 36.9678 157.748 37.5315 158.297 38.1862C159.291 39.3712 160.027 41.5818 158.622 42.715C157.218 43.8444 155.289 44.2524 153.436 44.3043C152.83 44.3228 152.229 44.4341 151.625 44.4972C151.534 44.5061 151.451 44.5495 151.391 44.6185C151.332 44.6876 151.301 44.7769 151.306 44.8681C151.393 46.4389 152.194 47.9948 153.622 48.7144C154.749 49.2819 156.014 49.4358 157.285 49.5285ZM125.24 122.074C125.595 122.522 126.052 122.985 126.612 123.465C129.007 125.516 131.876 126.634 134.976 127.226C135.42 127.309 135.831 127.487 136.271 127.564C137.782 127.821 139.223 128.248 140.753 128.469C141.463 128.571 142.176 128.669 142.893 128.763C144.534 128.979 146.136 128.946 147.699 128.665C148.735 128.48 149.674 128.226 150.517 127.903C152.817 127.026 154.803 124.975 155.979 122.909C157.215 120.738 158.234 118.367 159.033 115.797C159.548 114.144 159.904 112.507 160.102 110.888C160.345 108.901 160.317 106.698 159.703 104.782C158.924 102.346 158.599 99.8568 158.206 97.2716C157.948 95.563 157.441 93.9421 156.686 92.409C155.458 89.9128 154.121 87.7844 152.676 86.0239C151.146 84.1619 149.106 82.5114 146.821 81.6175C145.856 81.2392 144.948 81.0197 144.099 80.9591C142.961 80.8763 141.933 80.9171 141.015 81.0815C139.223 81.4005 137.418 82.1473 135.598 83.3218C133.51 84.6682 131.635 86.3552 129.975 88.3828C127.35 91.5875 125.32 95.095 123.884 98.9054C123.446 100.073 123.049 101.267 122.696 102.488C121.693 105.958 121.339 109.472 121.635 113.031C121.9 116.21 122.964 119.084 124.828 121.653C124.947 121.816 125.108 121.911 125.24 122.074ZM82.5043 92.3311C81.1282 90.777 79.4468 89.5444 77.46 88.6332C75.1195 87.5613 72.3674 87.2775 69.8638 87.6447C65.756 88.2493 62.2417 90.9959 60.415 94.6196C58.4862 98.4486 57.7605 102.587 58.2377 107.036C58.5678 110.122 59.6268 113.438 61.4535 115.843C63.1782 118.115 65.5668 119.925 68.3412 120.685C69.1696 120.911 70.0925 121.049 71.11 121.099C72.2463 121.153 73.2403 121.118 74.0921 120.993C75.8552 120.735 77.5434 120.124 79.1569 119.161C79.8338 118.756 80.4699 118.243 81.0837 117.733C82.7083 116.379 83.97 114.704 84.8688 112.707C85.5711 111.149 86.0458 109.801 86.2931 108.662C87.2921 104.068 86.7166 99.6268 84.5665 95.3392C84.0473 94.3019 83.3599 93.2992 82.5043 92.3311ZM129.103 208.558C129.708 204.287 129.239 199.679 127.532 195.803C126.331 193.072 124.728 190.693 122.724 188.667C117.729 183.617 110.879 180.423 103.767 180.141C98.2159 179.919 92.554 181.536 87.9455 184.824C86.1726 186.089 84.4961 187.585 82.916 189.314C81.4299 190.94 80.3159 192.504 79.5741 194.006C79.0586 195.051 78.5702 196.24 78.109 197.574C77.8717 198.256 77.74 198.957 77.5212 199.645C77.3641 200.14 77.23 200.657 77.1187 201.198C76.9197 202.174 76.7305 203.153 76.5512 204.133C76.299 205.517 76.082 207.507 75.9003 210.103C75.6777 213.276 75.9195 216.469 76.6254 219.682C76.8195 220.567 77.222 221.727 77.8327 223.161C77.944 223.422 78.0701 223.661 78.211 223.879C78.5745 224.439 78.823 225.036 79.2255 225.585C80.8228 227.76 82.7979 229.446 85.1507 230.644C88.0994 232.148 91.5711 232.871 94.8814 232.936C96.9202 232.976 98.8229 232.871 100.59 232.621C101.837 232.445 103.292 232.141 104.953 231.708C109.896 230.42 114.536 228.129 118.634 225.036C119.499 224.383 120.305 223.626 121.099 222.892C123.71 220.474 125.734 217.737 127.171 214.682C128.187 212.52 128.831 210.478 129.103 208.558Z" fill="white"></path>
</svg>
var videoIcon = <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22188" xmlnsXlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M509.866667 32C245.333333 32 32 247.466667 32 512s213.333333 480 477.866667 480c264.533333 0 477.866667-215.466667 477.866666-480S774.4 32 509.866667 32z m0 896C281.6 928 96 742.4 96 512S281.6 96 509.866667 96 923.733333 281.6 923.733333 512s-185.6 416-413.866666 416z" fill="#ffffff" p-id="22189"></path><path d="M433.066667 354.133333c-6.4-4.266667-17.066667 0-17.066667 10.666667V661.333333c0 8.533333 8.533333 14.933333 17.066667 10.666667l234.666666-149.333333c6.4-4.266667 6.4-14.933333 0-19.2l-234.666666-149.333334z" fill="#ffffff" p-id="22190"></path></svg>

