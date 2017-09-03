import React from 'react';
import Helmet from 'react-helmet';
import Header from './Header';
import Footer from './Footer';

const MainLayout = (props) => (
    <div id="mainLayout">
        <Helmet
            title="淘二万"
            meta={[
                { charset: 'utf-8' },
                { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
                { 'http-equiv': 'Cache-Control', content: 'no-siteapp' },
                { 'http-equiv': 'Cache-Control', content: 'max-age=0' },
                { 'http-equiv': 'Cache-Control', content: 'no-cache' },
                { 'http-equiv': 'expires', content: '0' },
                { 'http-equiv': 'expires', content: 'Tue, 01 Jan 1980 1:00:00 GMT' },
                { 'http-equiv': 'pragma', content: 'no-cache' },
                { name: 'renderer', content: 'webkit' },
                { name: 'HandheldFriendly', content: 'true' },
                { name: 'MobileOptimized', content: '320' },
                { name: 'screen-orientation', content: 'portrait' },
                { name: 'x5-orientation', content: 'portrait' },
                { name: 'full-screen', content: 'yes' },
                { name: 'x5-fullscreen', content: 'true' },
                { name: 'browsermode', content: 'application' },
                { name: 'x5-page-mode', content: 'app' },
                { name: 'msapplication-tap-highlight', content: 'no' },
                { name: 'format-detection', content: 'telephone=no,email=no' },
                { name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
                { name: 'title', content: '' },
                { name: 'keywords', content: '' },
                { name: 'description', content: '' },
            ]}
            link={[
                { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' },
            ]}
        />
        <Header />
        <div id="mainContainer">
            {props.children}
        </div>
        <Footer />
    </div>
);

export default MainLayout;
