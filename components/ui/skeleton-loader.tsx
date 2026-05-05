import React from 'react';

export const SkeletonLoader = () => {
    return (
        <div className="skeleton-screen">
            <div className="loading-container">
                <div className="ground"></div>
                <div className="skeleton">
                    <div className="head">
                        <div className="eye left"></div>
                        <div className="eye right"></div>
                        <div className="mouth"></div>
                    </div>
                    <div className="body"></div>
                    <div className="arm left"></div>
                    <div className="arm right"></div>
                    <div className="leg left"></div>
                    <div className="leg right"></div>
                </div>
            </div>
            <p className="font-display font-800 uppercase tracking-widest text-foreground mt-8 text-xl animate-pulse">
                Loading<span className="after:content-['.'] after:animate-[dots_1.5s_infinite]"></span>
            </p>
        </div>
    );
};
