import React from 'react'

function Media() {
  return (
        <section className="relative bg-[#f5f9fc] text-gray-800 py-20 px-4 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-pink-600 font-semibold text-xl mb-2">WELL-BEING...</h2>
        <p className="max-w-2xl mx-auto text-lg font-medium">
          “Health is a state of complete physical, mental and social well-being and not merely
          the absence of disease or infirmity.”<br />
          <span className="text-sm text-gray-600">...from the Constitution of the World Health Organization</span>
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
        {/* Left Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl shadow-lg max-w-sm">
          <h3 className="text-2xl font-bold mb-4">Well Being</h3>
          <p className="text-base">
            “Health is a state of complete physical, mental and social well-being and not merely
            the absence of disease or infirmity.”<br />
            <span className="text-sm text-gray-200">...from the Constitution of the World Health Organization</span>
          </p>
        </div>

        {/* Video Card */}
        <div className="relative w-full lg:w-2/3 max-w-3xl rounded-xl overflow-hidden shadow-xl">
          <video
            className="w-full h-auto object-cover"
            controls
            poster="/path-to-thumbnail.jpg" // หรือสามารถลบออกได้
          >
            <source src="/your-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h3 className="text-white text-4xl font-semibold drop-shadow-xl">Well-being</h3>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Media