import React, { Component } from 'react';

import { imagePath } from '../../utils/assetUtils';

class About extends Component {
    render() {
        return (
            <div>
                <h1>About page</h1>
                <img src={imagePath('react.svg')} alt="" />
            </div>
        );
    }
}

export default About;
