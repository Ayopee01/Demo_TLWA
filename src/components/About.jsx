import React from 'react'

function About() {
    return (
        <section className="bg-white text-gray-800 px-6 md:px-20 py-16">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 text-pink-600">About TLWA</h2>

                <div className="grid md:grid-cols-2 gap-10 text-lg leading-relaxed text-gray-700">
                    {/* LEFT CONTENT */}
                    <div>
                        <p className="mb-6">
                            As people in countries throughout the world are becoming increasingly interested in the modification of their lifestyle to strengthen their physical and mental health. This will lead to the long term disease prevention and treatment for chronic non-communicable diseases that result from unhealthy lifestyle.
                        </p>
                        <p className="mb-6">
                            A group of medical doctors who are interested in this field of study and realize the importance of having doctors and medically related professionals gathering together in an organization that allows the gaining and sharing of knowledge, experience, understanding and best practices of this field of medicine among those interested individuals who live in the country and abroad.
                        </p>
                        <p className="mb-6">
                            Such establishment will also serve to collaborate with other Thai and foreign institutions in developing the up-to-date knowledge and advanced techniques in practicing Lifestyle Medicine and promoting Wellbeing.
                        </p>
                        <p className="mb-6">
                            Thai Lifestyle Medicine and Wellbeing Association or TLWA is therefore established by the group of medical doctors with the following objectives:
                        </p>
                    </div>

                    {/* RIGHT CONTENT - OBJECTIVES */}
                    <div>
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>Widely promote academic knowledge of and medical practice that employs the use of Lifestyle Medicine in accordance with academic principle.</li>
                            <li>Promote the study and research on Lifestyle Medicine</li>
                            <li>Promote continuous education of Lifestyle Medicine through collaboration with other institutions, both within and outside Thailand</li>
                            <li>Support knowledge and experience sharing in the field of Lifestyle Medicine among the association members and members of other associations of similar or different interests, both within and outside Thailand</li>
                            <li>Disseminate the knowledge and promote disease prevention with the use of Lifestyle Medicine to the general public</li>
                            <li>Serve as an association that is not directly or indirectly involved in any political or gambling activity.</li>
                        </ol>
                        <p className="mt-6">
                            The association is a not-for-profit organization and is governed by statutes and bylaws. TLWA resides in the house of medicine and is 100% evidence-based. It is a democratically-elected physician-led organization, financially transparent and inclusive. TLWA is neutral in terms of politics, religion, gender, race or nationality.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About