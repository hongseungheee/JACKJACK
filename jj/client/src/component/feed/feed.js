import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageAction } from '../../store/notifySlice';
import Slider from 'react-slick';
import jwtAxios from '../../util/jwtUtil';
import { debounce } from 'lodash';

import Modal from "react-modal";
import Dropdown from './Dropdown';
//import Editpost from './Editpost';
import Post from './post';
import CustomTextarea from '../utility/CustomTextarea';
import EmojiPicker from 'emoji-picker-react';
import ImgEmoji from '../../images/emoji.png';
import Feedimg from './feedimg';


import ImgUnlike from '../../images/unlike.png';
import ImgLike from '../../images/like.png';
import ImgReply from '../../images/reply.png';
import ImgBookmark from '../../images/bookmark.png';
import ImgBookmarked from '../../images/bookmarked.png';
import ImgRemove from '../../images/remove.png';
import ImgMore from '../../images/more.png';
import ImgCancel from '../../images/cancel.png';
import ImgDefault from '../../images/pic.png';
import { getUserimgSrc } from '../../util/ImgSrcUtil';
import Indicator from '../utility/Indicator';

function Feed(props) {
    const MAX_CONTENT_LENGTH = 200;
    const dropdownDisplay1 = useRef(false);
    const dropdownDisplay2 = useRef(false);
    const setReplyStyle = useRef(false);
    const elementReply = useRef();
    const heightReply = useRef();
    const [feed, setFeed] = useState(props.feed);
    const [images, setImages] = useState([ImgDefault]);
    const [writerInfo, setWriterInfo] = useState({});
    const [likes, setLikes] = useState([]);
    const [stateLike, setStateLike] = useState(false);
    const [replys, setReplys] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [iconBookmark, setIconBookmark] = useState(ImgBookmark);
    const inputBtn = useRef();
    const [replyContent, setReplyContent] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [style1, setStyle1] = useState({ opacity: '0', left: '-2px', height: '0px' });
    const [style2, setStyle2] = useState({ opacity: '0', right: '-2px', height: '0px' });
    const [style3, setStyle3] = useState({ display: 'none' });
    const [length, setLength] = useState(0);
    const [emojiStyle, setEmojiStyle] = useState({ display: 'none' });
    const [onoffCheck, setOnoffCheck] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [stateBookmark, setStateBookmark] = useState(false);
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getWriterInfo = (nickname) => {
        jwtAxios.post('/api/members/getmemberbynickname', null, { params: { nickname } })
            .then(result => {
                setWriterInfo(result.data.user);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const getLikes = (feedid) => {
        jwtAxios.post('/api/feeds/getlikesbyfeedid', { feedid })
            .then(result => {
                setStateLike(false);
                setLikes(result.data.likes.map((like) => {
                    if (like.nickname === loginUser.nickname) {
                        setStateLike(true);
                    }
                    return like.nickname;
                }));
                setLikeCount(result.data.likes.length);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const toggleLikes = useCallback(debounce((feedid, nickname) => {
        jwtAxios.post('/api/feeds/togglelike', { feedid, nickname })
            .then(result => {
                getLikes(feedid);
            })
            .catch(err => {
                console.error(err);
            });
    }, 500), []);

    const getImages = (feedid) => {
        jwtAxios.post('/api/feeds/getfeedimgbyfeedid', null, { params: { feedid } })
            .then(result => {
                setImages(result.data.images);
            })
            .catch(err => {
                console.error(err);
            });

    }

    const getReplys = (feedid) => {
        jwtAxios.post('/api/feeds/getreplysbyfeedid', { feedid })
            .then(result => {
                setReplys(reply => result.data.replys);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const transDateString = (dateString) => {
        const today = new Date();
        const createdat = new Date(dateString);

        // console.log('저장된 시간:', createdat, '현재시간:', today);

        let diff = Math.abs(today.getTime() - createdat.getTime());
        diff = Math.ceil(diff / (1000));
        // console.log(diff);
        let result = '';
        if (diff < 60) {
            result = '방금 전'
        } else if (diff < 60 * 60) {
            result = Math.ceil(diff / 60) + '분 전';
        } else if (diff < 60 * 60 * 24) {
            result = Math.ceil(diff / 60 / 60) + '시간 전';
        } else if (diff < 60 * 60 * 24 * 365) {
            result = Math.ceil(diff / 60 / 60 / 24) + '일 전';
        }

        return result;
    }

    const transKBM = (countKBM) => {
        const length = countKBM;
        let result = '';

        if (length < 1000) {
            result = length;
        } else if (length < 1000000) {
            result = (Math.floor((length / 1000) * 10) / 10) + 'K';
        } else if (length < 1000000000) {
            result = (Math.floor((length / 1000000) * 10) / 10) + 'M';
        } else if (length > 999999999) {
            result = (Math.floor((length / 1000000000) * 10) / 10) + 'B';
        }

        return result;
    }


    const addReply = (feedid, writer, content) => {
        if (replyContent === '') {
            dispatch(setMessageAction({ message: '댓글 내용을 입력해주세요.' }));
        } else if (replyContent.length > MAX_CONTENT_LENGTH) {
            dispatch(setMessageAction({ message: '입력 가능한 최대 글자수는 200자 입니다.' }));
        } else {
            jwtAxios.post('/api/feeds/addreply', { feedid, writer, content })
                .then(result => {
                    getReplys(feedid);
                    // inputReply.current.textContent = '';
                    setReplyContent('');
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    const deleteReply = (id, feedid) => {
        if (window.confirm('삭제하시겠습니까?')) {
            jwtAxios.post('/api/feeds/deletereply', null, { params: { id } })
                .then(result => {
                    dispatch(setMessageAction({ message: '댓글이 삭제되었습니다.' }));
                    getReplys(feedid);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }

    const getBookmarks = (feedid) => {
        jwtAxios.post('/api/feeds/getbookmarksbyfeedid', { feedid })
            .then(result => {
                setIconBookmark(ImgBookmark);
                setStateBookmark(false);
                setBookmarks(result.data.bookmarks.map((bookmark) => {
                    if (bookmark.nickname === loginUser.nickname) {
                        setIconBookmark(ImgBookmarked);
                        setStateBookmark(true);
                    }
                    return bookmark.nickname;
                }));
                setBookmarkCount(result.data.bookmarks.length);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const toggleBookmarks = useCallback(debounce((feedid, nickname) => {
        jwtAxios.post('/api/feeds/togglebookmark', { feedid, nickname })
            .then(result => {
                getBookmarks(feedid);
            })
            .catch(err => {
                console.error(err);
            });
    }, 500), []);

    useEffect(() => {
        getWriterInfo(feed.writer);
        getLikes(feed.id);
        getImages(feed.id);
        getReplys(feed.id);
        getBookmarks(feed.id);
        heightReply.current = elementReply.current.clientHeight;
    }, []);

    const settings = {
        arrows: false,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const toggleModal = () => {
        document.body.style.overflow = isOpen ? "auto" : "hidden";
        setIsOpen(!isOpen);
    }

    const setProfileDropdown = () => {
        dropdownDisplay1.current = !dropdownDisplay1.current;
        // console.log(dropdownDisplay1.current, 1);
        if (dropdownDisplay1.current === false) {
            setStyle1({
                opacity: '0',
                left: '-2px',
                height: '0px'
            })
        } else {
            setStyle1({
                opacity: '1',
                left: '-2px',
                height: 'auto'
            })
        }
        // console.log(style1);
    }
    const setMoreDropdown = () => {
        dropdownDisplay2.current = !dropdownDisplay2.current;
        // console.log(dropdownDisplay2.current, 1);
        if (dropdownDisplay2.current === false) {
            setStyle2({
                opacity: '0',
                right: '-2px',
                height: '0px'
            })
        } else {
            setStyle2({
                opacity: '1',
                right: '-2px',
                height: 'auto'
            })
        }
        // console.log(style1);
    }

    const toggleReply = () => {
        setReplyStyle.current = !setReplyStyle.current;

        if (setReplyStyle.current === false) {
            setStyle3({
                opacity: '0',
                height: '0px',
                visibility: 'hidden',
                overflow: 'hidden'
            })
            window.document.documentElement.scrollTop -= elementReply.current.clientHeight;
        } else {
            setStyle3({
                opacity: '1',
                height: 'auto',
                visibility: 'visible',
            })

        }
    }

    const onoffEmoji = () => {
        setOnoffCheck(!onoffCheck)
        if (onoffCheck == true) {
            setEmojiStyle({ display: 'none' });
        } else {
            setEmojiStyle({ display: 'block' });
        }
    }

    useEffect(() => {

        window.document.documentElement.scrollTop += elementReply.current.clientHeight;

    }, [style3])

    // useEffect(() => {
    //     setLength(inputReply.current.textContent.length);
    // }, [replyContent]);

    return (
        <div className="feed" ref={props.scrollRef}>
            <div className="feed_head">
                <div className='headlink_wrap' >
                    <div className="profileimg link" onClick={() => {
                        if (feed.writer !== loginUser.nickname) {
                            setProfileDropdown();
                        } else {
                            navigate(`/member/${feed.writer}`)
                        }
                    }}>
                        <img src={getUserimgSrc(writerInfo)} />
                    </div>
                    <div className="nickname link" onClick={() => {
                        if (feed.writer !== loginUser.nickname) {
                            setProfileDropdown();
                        } else {
                            navigate(`/member/${feed.writer}`)
                        }
                    }}>{writerInfo.nickname}</div>
                    <Dropdown pagename={'profile'} feedid={feed.id} toggleModal={toggleModal} style={style1} writer={feed.writer} />
                </div>
                <div className="timestamp">
                    {transDateString(feed.updatedat)}
                    {
                        feed.createdat === feed.updatedat
                            ? null
                            : "(수정됨)"
                    }
                </div>
                <Modal className="modal" overlayClassName="overlay_modal" isOpen={isOpen} ariaHideApp={false} >
                    <img src={ImgCancel} className="icon close link" onClick={() => {
                        toggleModal();
                    }} />
                    <Post feed={feed} images={images} setIsOpen={setIsOpen} feeds={props.feeds} setFeeds={props.setFeeds} />
                </Modal>
                {
                    feed.writer === loginUser.nickname
                        ? (
                            <>
                                <div className='morebtn'>
                                    <Dropdown pagename={'feed'} feedid={feed.id} toggleModal={toggleModal} style={style2} />
                                    <img src={ImgMore} className='icon' onClick={() => {
                                        setMoreDropdown()
                                    }} />
                                </div>
                            </>
                        )

                        : null
                }
            </div>
            <div onClick={() => {
                navigate(`/view/${feed.writer}/${feed.id}`);
            }}>
                <Slider {...settings}>
                    {
                        images.map((image, imageIndex) => {
                            return (
                                <Feedimg key={imageIndex} img_filename={image.filename} img_style={image.style} />
                            );
                        })
                    }
                </Slider>
            </div>
            <div className="feed_content">
                {feed.content}<br />
                <div className="btn"><input type="checkbox" className="toggle_content" /></div>
            </div>

            <div className="feed_icon">
                <div className="like"><img src={stateLike ? ImgLike : ImgUnlike} className="icon" onClick={() => {
                    if (stateLike) {
                        setLikeCount(likeCount - 1);
                    } else {
                        setLikeCount(likeCount + 1);
                    }
                    setStateLike(!stateLike);
                    toggleLikes(feed.id, loginUser.nickname);
                }} />
                    {transKBM(likeCount)}
                </div>
                <div className="reply" onClick={() => { toggleReply() }}><img src={ImgReply} className="icon" />{transKBM(replys.length)}</div>
                <div className="bookmark"><img src={stateBookmark ? ImgBookmarked : ImgBookmark} className="icon" onClick={() => {
                    if (stateBookmark) {
                        setBookmarkCount(bookmarkCount - 1);
                    } else {
                        setBookmarkCount(bookmarkCount + 1);
                    }
                    setStateBookmark(!stateBookmark)
                    toggleBookmarks(feed.id, loginUser.nickname);
                }} />{transKBM(bookmarkCount)}</div>
            </div>
            <div className="feed_reply" style={style3} ref={elementReply}>
                {
                    replys.map((reply) => {
                        return (
                            <div className="reply" key={reply.id}>
                                <div className="row_reply profile" onClick={() => {
                                    navigate(`/member/${reply.writer}`);
                                }}>
                                    <img src={getUserimgSrc(reply)} className="writer_img" />{reply.writer}
                                </div>
                                <div className="row_reply content">{reply.content}</div>
                                <div className="row_reply timestamp">{transDateString(reply.createdat)}</div>
                                {
                                    reply.writer === loginUser.nickname
                                        ? <div className="row_reply remove" onClick={() => {
                                            deleteReply(reply.id, reply.feedid);
                                        }}><img src={ImgRemove} className="icon" /></div>
                                        : null
                                }
                            </div>
                        );
                    })
                }

                <div className="input_box" tabIndex='0'>
                    <div className='input_container' tabIndex='0'>
                        {/* <div ref={inputReply}
                            contentEditable
                            suppressContentEditableWarning
                            placeholder="Reply here"
                            className="input_reply"
                            tabIndex='0'
                            onInput={(e) => {
                                inputReply.current.textContent = e.currentTarget.textContent;
                                setReplyContent(e.currentTarget.textContent);
                                setLength(e.currentTarget.textContent.length);
                            }}>
                        </div> */}
                        <CustomTextarea
                            value={replyContent}
                            setContent={setReplyContent}
                            onInputEnterCallback={() => { inputBtn.current.click() }}
                            placeholder={'Reply here'}
                            MAX_CONTENT_LENGTH={200} />
                        <button className="inputBtn" ref={inputBtn} onClick={() => {
                            addReply(feed.id, loginUser.nickname, replyContent);
                            if (onoffCheck) {
                                onoffEmoji();
                            }
                        }} tabIndex='0'>확인</button>
                    </div>
                    <div className='activeBtn' tabIndex='0' >
                        <button className="btn_emoji" onClick={() => {
                            onoffEmoji();
                        }}><img src={ImgEmoji} className="icon" /></button>
                        {
                            length > 0 ? (
                                <Indicator length={length} />
                            ) : null

                        }
                    </div>
                    <div className='emoji' style={emojiStyle}>
                        <EmojiPicker
                            height={'350px'}
                            width={'100%'}
                            emojiStyle={'native'}
                            emojiVersion={'5.0'}
                            searchDisabled={true}
                            previewConfig={{ showPreview: false }}
                            searchPlaceholder='Search Emoji'
                            autoFocusSearch={false}
                            onEmojiClick={(e) => {
                                // inputReply.current.textContent += e.emoji;
                                setReplyContent(content => content + e.emoji);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed
