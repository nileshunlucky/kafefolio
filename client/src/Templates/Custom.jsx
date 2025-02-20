import React from 'react'

const Custom = ({ user }) => {
    return (
        <div style={{ backgroundColor: user?.portfolio.theme.backgroundColor, color: user?.portfolio.theme.color, fontFamily: user?.portfolio.theme.font }}>
        </div>
    )
}

export default Custom
