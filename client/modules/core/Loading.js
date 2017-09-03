import React from 'react';
export default class Loading extends React.Component {

    render() {
        return (
            <div className="loading">
				<img src="/loading.gif" className="loadingImg"></img>
            </div>
        );
    }
};
