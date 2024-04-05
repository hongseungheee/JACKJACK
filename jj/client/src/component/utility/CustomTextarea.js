import React, { useEffect, useState, useRef } from 'react'
import Indicator from './Indicator';

function CustomTextarea(props) {
    // placeholder={props.placeholder}
    const inputText = useRef();

    const [length, setLength] = useState(0);

    const heightHandler = () => {
        inputText.current.style.height = '1px';
        inputText.current.style.height = inputText.current.scrollHeight + 'px';
    }

    useEffect(() => {
        heightHandler();
    }, [props.value])

    return (
        <>
            <textarea
                ref={inputText}
                className='input'
                value={props.value}
                onChange={
                    (e) => {
                        props.setContent(e.currentTarget.value);
                        setLength(e.currentTarget.value.length);
                    }
                }
                placeholder={props.placeholder}
                style={
                    {
                        boxSizing: 'border-box',
                        padding: '10px',
                        resize: 'none',
                        overflow: 'hidden',
                    }
                } />
            {
                length > 0
                    ? <Indicator MAX_CONTENT_LENGTH={props.MAX_CONTENT_LENGTH} length={length} />
                    : null
            }
        </>
    )
}

export default CustomTextarea