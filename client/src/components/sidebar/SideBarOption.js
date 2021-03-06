import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export  class SideBarOption extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        active:false,
        onCLick: () => {}
        
    }
    render() {
        const { active, name, onClick } = this.props
        return (
            <div 
                className={`user ${active ? 'active':''}`}
                onClick={ onClick }
                >
               
                <div className="user-info">
                    <div className="name">{name}</div>
                </div>
                
            </div>
        )
    }
}