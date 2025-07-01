import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

// import line decoration
import line1 from '../assets/news/line-1.png'
import line2 from '../assets/news/line-2.png'

function News() {

    return (

        <section className="relative bg-white text-gray-900 py-24 px-4 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-pink-300 opacity-30 rounded-full z-0 translate-x-[-40%] translate-y-[-40%]"></div>
            <img className='absolute right-0' src={line1} alt="" />
            {/* วงกลมชมพู */}

            <div className="max-w-6xl mx-auto relative pt-12">

                {/* Header */}
                <div className="flex flex-col text-start mb-16">
                    <div className="text-pink-400 font-semibold text-xl mb-2">Article</div>
                    <h2 className="text-6xl font-bold mb-12 max-w-sm">Latest stories</h2>
                    <p className="text-gray-800 font-semibold text-lg max-w-8xl">
                        Lifestyle news covers topics related to daily living and personal well-being.
                        This includes articles and updates on health and wellness, fashion and beauty, home and garden, travel, food and drink, relationships, and entertainment.
                        The goal of lifestyle news is to inform and inspire readers with the latest trends, tips, and stories that enhance their quality of life.
                    </p>
                </div>
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
                        <div
                            // key={item.id}
                            className="relative bg-white border border-gray-200 rounded-xl p-7 shadow hover:shadow-lg transition"
                        >
                            {/* {item.title} */}
                            <h3 className="font-bold text-lg mb-2">title</h3>
                            {/* {item.summary} */}
                            <div className="text-gray-500 mb-4 line-clamp-2">summary</div>
                            {/* อ่านรายละเอียด */}
                            <Link
                                // {`/news/${item.id}`}
                                to="/"
                                className="text-indigo-600 font-medium hover:underline flex items-center"
                            >
                                Learn more <span className="ml-1 text-xl">&#8594;</span>
                            </Link>
                        </div>
                    </div>                  
                </div>               
                {/* button */}
                <div className="flex justify-center">
                    <Link
                        to="/Page"
                        className="bg-indigo-500 text-white font-semibold w-32 h-12 rounded-xl shadow-lg
                    hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                    >
                        Read More
                    </Link>
                </div>                
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 opacity-80 rounded-full z-0 translate-x-[30%] translate-y-[30%]"></div>
            {/* เส้นล่าง */}
            {/* <img className='absolute bottom-0 left-0 opacity-50' src={line2} alt="" /> */}
        </section>

    )
}

export default News