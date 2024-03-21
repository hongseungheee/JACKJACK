import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Header from '../common/header';
import Sub from '../common/sub';
import Feed from './feed';

function Feeds({ newFeed, setNewFeed }) {
    const [feeds, setFeeds] = useState([]);
    const [page, setPage] = useState(0);
    const scrollAside = useRef();;
    const loginUser = useSelector(state => state.user);

    const getFeeds = () => {
        axios.post('/api/feeds/getbookmarkfeedsbynickname', null, { params: { page, nickname: loginUser.nickname } })
            .then(result => {
                setFeeds([...feeds, ...result.data.feeds]);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const scrollHandler = () => {
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;

        if (clientHeight + scrollTop >= scrollHeight) {
            setPage(page => page + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, []);

    useEffect(() => {
        getFeeds();
    }, [page]);

    return (
        <div className="wrap_main">
            <header><Header/></header>
            <main>
                <div className="tab">
                    <div className="tab_col">
                        <button className="link">For you</button>
                    </div>
                    <div className="tab_col">
                        <button className="link">Following</button>
                    </div>
                </div>
                <div className="wrap_feeds">
                    {feeds.length ? (
                        feeds.map((feed) => {
                            return (
                                <Feed feed={feed} key={feed.updatedat} feeds={feeds} setFeeds={setFeeds} />
                            );
                        })
                    ) : <div className="empty_feed_message">Feed가 없습니다.</div>
                    }
                </div></main>
            <aside id="aside" ref={scrollAside}><Sub scrollAside={scrollAside} /></aside>
        </div>

    )
}

export default Feeds