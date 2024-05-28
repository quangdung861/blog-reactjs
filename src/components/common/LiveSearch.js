import React, { useEffect, useState } from 'react'

const LiveSearch = ({ onKeySearch }) => {
    const [keyword, setKeyword] = useState('')

    useEffect(() => {
        const delayDebouce = setTimeout(() => {
            onKeySearch(keyword)
        }, 300)

        return () => clearTimeout(delayDebouce)
    }, [keyword])

    const onTyping = (event) => {
        const target = event.target;
        setKeyword(target.value);
    }
    return (
        <input type="search" onChange={onTyping} value={keyword} className="form-control form-control-sm ms-1" placeholder='Email or Name' />
    )
}

export default LiveSearch