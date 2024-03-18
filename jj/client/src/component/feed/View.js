import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import Header from '../common/header';
import Sub from '../common/sub';
import UserInfo from '../members/UserInfo';
import Feed from '../feed/feed';

import ImgUser from '../../images/user.png';
import ImgSetting from '../../images/setting.png';

function View() {
    const [feed, setFeed] = useState({});
    const navigate = useNavigate();
    const param = useParams();

    const getFeed = () => {
        axios.post('/api/feeds/getfeedbyid', { id: param.feedid })
            .then(result => {
                setFeed(result.data.feed);

            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(() => {
        getFeed();
        console.log(param);
    }, []);

    return (
        <div className="wrap_main">
            <header><Header /></header>
            <main>
                <UserInfo nickname={param.nickname} />
                <div className='wrap_feeds'>
                    {
                        feed?.id ? (
                            <Feed feed={feed} key={feed.updatedat} />
                        ) : null
                    }
                </div>
            </main>
            <aside id="aside"><Sub /></aside>
        </div>
    )
}

export default View