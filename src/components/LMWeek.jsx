import React from 'react'

function LMWeek() {
    return (
        <section id="lmweek">
            <h2 className="text-3xl font-semibold mb-4">Lifestyle Medicine Week</h2>
            <p className="mb-4">18–24 พฤษภาคม จัดกิจกรรมรณรงค์ด้านพฤติกรรมสุขภาพเพื่อรับมือโรคเรื้อรังทั่วโลก :contentReference[oaicite:2]{index = 2}</p>
            <ul className="flex space-x-4 overflow-x-auto">
                {['May 18', 'May 19', 'May 20', 'May 21', 'May 22', 'May 23', 'May 24'].map(day => (
                    <li key={day} className="flex-shrink-0 p-3 bg-blue-100 rounded">{day}</li>
                ))}
            </ul>
        </section>
    )
}

export default LMWeek