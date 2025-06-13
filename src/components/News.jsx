import React from 'react'

function News() {
    return (
        <section id="news">
            <h2 className="text-3xl font-semibold mb-4">ข่าวสารล่าสุด</h2>
            <div className="space-y-6">
                {articles.map((a, i) => (
                    <div key={i} className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold">{a.title}</h3>
                        <span className="text-sm text-gray-500">{a.date}</span>
                        <p className="mt-2">{a.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default News