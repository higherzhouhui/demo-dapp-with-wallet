import './index.scss'
import { getUserListReq, getUserInfoReq } from '@/api/common'
import { setUserInfoAction } from '@/redux/slices/userSlice'
import { formatNumber, stringToColor } from '@/utils/common'
import { List, InfiniteScroll } from 'antd-mobile'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BackTop from '@/components/BackTop'
import { useNavigate } from 'react-router-dom'

export default function LeaderBoardPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const [total, setTotal] = useState('10.00M')
  const [holderList, setHolderList] = useState<any[]>([])
  const [rank, setRank] = useState(1)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    <div className="title">𝓣𝓮𝓵𝓮𝓰𝓻𝓪𝓶 𝓦𝓪𝓵𝓵 𝓸𝓯 𝓕𝓪𝓶𝓮</div>
    <div className="myself" onClick={() => navigate('/detail?myself=true')}>
      <div className="left">
        <div className="icon" style={{ background: stringToColor(userInfo?.username) }}>
          {userInfo?.username?.slice(0, 2)}
        </div>
        <div className="name-score-warpper">
          <div className="name">{userInfo?.username}</div>
          <div className="name-score">{userInfo?.score?.toLocaleString()}&nbsp;$HMSTR</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src='/assets/common/NO1.png' alt="no1" /> : rank == 2 ? <img src='/assets/common/NO2.png' alt="no2" /> : rank == 3 ? <img src='/assets/common/NO3.png' alt="no3" /> : rank == 4 ? <img src='/assets/common/NO4.png' alt="no4" /> : rank == 5 ? <img src='/assets/common/NO5.png' alt="no5" /> : <span>#{rank}</span>
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

  function ListItem({ username, score, rank }: { username: string, score: number, rank: number }) {
    return <div className="holders-item">
      <div className="holders-left">
        <div className="icon" style={{ background: stringToColor(username) }}>
          {
            username?.slice(0, 2)
          }
        </div>
        <div className="name-score-wrapper">
          <div className="name">{username}</div>
          <div className="name-score">{score.toLocaleString()}&nbsp;$HMSTR</div>
        </div>
      </div>
      <div className="right">
        {
          rank == 1 ? <img src='/assets/common/NO1.png' alt="no1" /> : rank == 2 ? <img src='/assets/common/NO2.png' alt="no2" /> : rank == 3 ? <img src='/assets/common/NO3.png' alt="no3" /> : rank == 4 ? <img src='/assets/common/NO4.png' alt="no4" /> : rank == 5 ? <img src='/assets/common/NO5.png' alt="no5" /> : <span>#{rank}</span>
        }
      </div>
      <BackTop />
    </div>
  }
}