import React from 'react'
import { motion } from 'framer-motion'
// import images
import heroPeople from '../assets/hero/doctor.webp'
import bgWindow from '../assets/hero/window.png'
import bgChecklist from '../assets/hero/chat-group.png'

function Hero() {
    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    }

    const fadeInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }

    const fadeInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut", delay: 0.4 }
    }

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut", delay: 0.6 }
    }

    const floatingAnimation = {
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const bounceAnimation = {
        animate: {
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const rotateAnimation = {
        animate: {
            rotate: [0, 360],
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    }

    const pulseAnimation = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <section className="relative overflow-hidden flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full mx-auto pt-40 
        sm:pt-55 
        md:pt-75
        lg:pt-60
        xl:pt-60
        2xl:pt-60">
            {/*วงกลมสีฟ้าบนซ้าย*/}
            <motion.div
                className="absolute -left-20 -top-32 w-44 h-44 
                sm:-left-36 sm:-top-50 sm:w-80 sm:h-80
                md:-left-36 md:-top-60 md:w-80 md:h-80
                xl:-left-40 xl:-top-50 xl:w-100 xl:h-100
                2xl:-left-40 2xl:-top-50 2xl:w-100 2xl:h-100    
                bg-blue-100 rounded-full z-0 opacity-60"
                {...floatingAnimation}
            ></motion.div>

            {/*วงกลมสีม่วงอันใหญ่หลังรูปหมอ*/}
            <motion.div
                className="absolute left-[70%] top-[25%] w-[70%] 
                sm:left-[70%] sm:top-[30%] sm:w-[55%] 
                md:left-[60%] md:top-[29%] md:w-[55%]
                lg:left-[80%] lg:top-[48%] lg:w-[35%]
                xl:left-[77%] xl:top-[52%] xl:w-[30%]
                2xl:left-[77%] 2xl:top-[52%] 2xl:w-[30%]   
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-gradient-to-br from-purple-300 to-blue-100 rounded-full z-10 opacity-70"
            // {...rotateAnimation}
            ></motion.div>

            {/*วงกลมสีชมพูเด้งๆ*/}
            <motion.div
                className="absolute left-[55%] top-[11.6%] w-[3%] 
                sm:left-[55%] sm:top-[12%] sm:w-[2%]
                md:left-[45%] md:top-[12%] md:w-[2%]
                lg:left-[65%] lg:top-[20%] lg:w-[2%] 
                xl:left-[65%] xl:top-[25%] xl:w-[1%]
                2xl:left-[70%] 2xl:top-[18%] 2xl:w-[1%]  
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-pink-400 rounded-full z-10"
                {...bounceAnimation}
                transition={{ ...bounceAnimation.animate.transition, delay: 0.5 }}
            />
            {/*วงกลมสีฟ้าเด้งๆ*/}
            <motion.div
                className="absolute left-[95%] top-[40%] w-[3%] 
                sm:left-[90%] sm:top-[50%] sm:w-[3%]
                md:left-[85%] md:top-[50%] md:w-[3%]
                lg:left-[97%] lg:top-[75%] lg:w-[2%]
                xl:left-[91%] xl:top-[75%] xl:w-[1%]
                2xl:left-[90%] 2xl:top-[80%] 2xl:w-[1%]
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-blue-400 rounded-full z-10"
                {...bounceAnimation}
                transition={{ ...bounceAnimation.animate.transition, delay: 1 }}
            />
            {/*วงกลมสีขาวกระพริบ*/}
            <motion.div
                className="absolute left-[85%] top-[17%] w-[5%] 
                sm:left-[79%] sm:top-[21%] sm:w-[3%]
                md:left-[74%] md:top-[23%] md:w-[3%]
                lg:left-[88%] lg:top-[35%] lg:w-[2%]
                xl:left-[85%] xl:top-[32%] xl:w-[1%]
                2xl:left-[83.5%] 2xl:top-[27%] 2xl:w-[1%]  
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-white rounded-full z-10"
                {...pulseAnimation}
            />

            {/*กล่องสีเหลือง*/}
            <motion.div
                className="absolute left-[80%] bottom-[3%] w-[4%]
                sm:left-[70%] sm:bottom-[3%] sm:w-[3%]
                lg:left-[25%] lg:bottom-[3%] lg:w-[2%]
                xl:left-[32%] xl:bottom-[12%] xl:w-[1.5%]
                2xl:left-[30%] 2xl:bottom-[8%] 2xl:w-[1%]    
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-yellow-300 rounded-sm z-10"
                animate={{
                    rotate: [12, 25, 12],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            {/*กล่องสีชมพู*/}
            <motion.div
                className="absolute left-[90%] bottom-[8%] w-[5%]
                sm:left-[85%] sm:bottom-[8%] sm:w-[4%]
                lg:left-[30%] lg:bottom-[12%] lg:w-[3%]
                xl:left-[35%] xl:bottom-[18%] xl:w-[2%]
                2xl:left-[35%] 2xl:bottom-[12%] 2xl:w-[1.5%]    
                aspect-square -translate-x-1/2 -translate-y-1/2 
                bg-pink-300 rounded-sm z-10"
                animate={{
                    rotate: [-6, -20, -6],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />

            {/* CONTENT */}
            <div className="flex flex-col-reverse 
            lg:flex-row pb-10
            xl:px-30
            2xl:px-40">
                {/* LEFT */}
                <motion.div
                    className="flex flex-col z-20 pt-5
                    md:relative md:-top-10 md:pt-0"
                    {...fadeInLeft}
                >

                    <div className="flex w-full px-4 justify-center
                    lg:px-10 lg:w-100 lg:justify-start
                    xl:px-10 2xl:w-150 xl:justify-start">
                        <motion.span
                            className="text-4xl font-bold text-gray-800 drop-shadow-sm text-center max-w-4xl
                            lg:text-5xl lg:text-left
                            xl:text-5xl xl:text-left
                            2xl:text-7xl 2xl:text-left"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Thai Lifestyle Medicine and Wellbeing Association
                        </motion.span>
                    </div>

                    <div className='xl:w-100'>
                        <motion.p
                            className="text-center text-gray-600 text-base leading-relaxed p-4 
                        sm:text-lg sm:px-15 
                        md:text-xl md:px-30
                        lg:text-lg lg:px-10 lg:text-left
                        xl:text-xl xl:px-10 xl:text-left"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                        >
                            As people in countries throughout the world are becoming increasingly interested in the modification of their lifestyle to strengthen their physical and mental health.
                        </motion.p>
                    </div>

                    <div className='flex justify-center mt-4
                    lg:w-100'>
                        <motion.button
                            className="bg-indigo-500 text-white font-semibold w-32 h-15 rounded-xl shadow-lg 
                            hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 "
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(91, 73, 216, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Read More
                        </motion.button>
                    </div>
                </motion.div>

                {/* RIGHT */}
                <div className="w-full flex justify-center items-center relative">
                    {/* Browser Window พื้นหลัง - Slide In */}
                    <motion.img
                        src={bgWindow}
                        alt=""
                        className="absolute -left-[7%] -top-[20%] w-[70%] 
                        sm:left-[8%] sm:-top-[20%] sm:w-[55%] 
                        md:left-[8%] md:-top-[37%] md:w-[50%]
                        lg:left-[2%] lg:-top-[12%] lg:w-[55%]
                        xl:left-[8%] xl:-top-[5%] xl:w-[50%]
                        2xl:-left-[1%] 2xl:-top-[10%] 2xl:w-[60%]  
                        z-10 drop-shadow-lg"
                        draggable={false}
                        {...fadeInRight}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3 }}
                    />
                    {/* Chat Group/Checklist ขวาบน - Scale In */}
                    <motion.img
                        src={bgChecklist}
                        alt=""
                        className="absolute left-[65%] -top-[45%] w-[17%] 
                        sm:left-[65%] sm:-top-[45%] sm:w-[12%] 
                        md:left-[57%] md:-top-[72%] md:w-[12%]
                        lg:left-[60%] lg:-top-[35%] lg:w-[12%]
                        xl:left-[65%] xl:-top-[25%] xl:w-[12%]
                        2xl:left-[60%] 2xl:-top-[30%] 2xl:w-[13%]   
                        z-20"
                        draggable={false}
                        {...scaleIn}
                        animate={{
                            ...scaleIn.animate,
                            y: [-5, 5, -5]
                        }}
                        transition={{
                            ...scaleIn.transition,
                            y: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    />
                    {/*รูปหมอ*/}
                    <motion.img
                        src={heroPeople}
                        alt="Thai Medical Team"
                        className="relative z-30 -left-[2%] top-0 w-[90%] 
                        sm:left-[0%] sm:top-0 sm:w-[70%] 
                        md:left-[0%] md:-top-15 md:w-[60%]
                        lg:left-[0%] lg:-top-0 lg:w-[80%]
                        xl:left-[0%] xl:-top-0 xl:w-[90%]
                        2xl:left-[0%] 2xl:-top-0 2xl:w-[90%]    
                        drop-shadow-2xl rounded-lg"
                        draggable={false}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    />

                    {/*วงกลมสีเหลืองเด้ง*/}
                    <motion.div
                        className="absolute left-[6%] top-[10%] w-[5%] 
                        sm:left-[18%] sm:top-[10%] sm:w-[3%]
                        md:left-[17%] md:-top-[10%] md:w-[3%]
                        lg:left-[12.5%] lg:top-[8%] lg:w-[3%]
                        xl:left-[17.5%] xl:top-[12%] xl:w-[3%]
                        2xl:left-[10.5%] 2xl:top-[8%] 2xlw-[3%]    
                        aspect-square -translate-x-1/2 -translate-y-1/2 
                        bg-yellow-200 rounded-full z-20 shadow"
                        {...bounceAnimation}
                        transition={{ ...bounceAnimation.animate.transition, delay: 1.5 }}
                    />
                    {/*วงกลมสีฟ้ากระพริบ*/}
                    <motion.div
                        className="absolute left-[100%] top-[15%] w-[5%] 
                        sm:left-[90%] sm:top-[15%] sm:w-[3%]
                        md:left-[83%] md:top-[0%] md:w-[3%]
                        lg:left-[90%] lg:top-[25%] lg:w-[3%]
                        xl:left-[98%] xl:top-[25%] xl:w-[3%]
                        2xl:left-[95%] 2xl:top-[26%] 2xl:w-[3%]  
                        aspect-square -translate-x-1/2 -translate-y-1/2 
                        bg-blue-200 rounded-full z-20 shadow"
                        {...pulseAnimation}
                        transition={{ ...pulseAnimation.animate.transition, delay: 2 }}
                    />
                    {/*วงกลมปะ สีฟ้าหมุนๆ ล่างซ้าย*/}
                    <motion.div
                        className="absolute left-[1%] bottom-[2%] w-[10%] 
                        sm:left-[14%] sm:bottom-[1%] sm:w-[8%]
                        md:left-[19%] md:bottom-[19%] md:w-[7%]
                        lg:left-[9%] lg:bottom-[7%] lg:w-[9%]
                        xl:left-[4%] xl:bottom-[5%] xl:w-[10%]
                        2xl:left-[4%] 2xl:bottom-[5%] 2xl:w-[10%]   
                        aspect-square -translate-x-1/2 -translate-y-1/2 
                        border-4 border-dotted border-blue-300 rounded-full z-20"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                    {/* วงกลมสีเขียวเด้ง */}
                    <motion.div
                        className="absolute left-[0%] bottom-[60%] w-[5%] 
                        sm:left-[13%] sm:bottom-[65%] sm:w-[3%]
                        md:left-[13%] md:bottom-[75%] md:w-[3%]
                        lg:left-[7.5%] lg:bottom-[65%] lg:w-[3%]
                        xl:left-[13.1%] xl:bottom-[64%] xl:w-[3%]
                        2xl:left-[5%] 2xl:bottom-[60%] 2xl:w-[3%]    
                        aspect-square -translate-x-1/2 -translate-y-1/2 
                        bg-teal-400 rounded-full z-20"
                        {...bounceAnimation}
                        transition={{ ...bounceAnimation.animate.transition, delay: 0.8 }}
                    />
                    {/* วงกลมปะ สีม่วงหมุน ล่างซ้าย*/}
                    <motion.div
                        className="absolute left-[3%] bottom-[25%] w-[10%] 
                        sm:left-[15%] sm:bottom-[25%] sm:w-[8%]
                        md:left-[12%] md:bottom-[40%] md:w-[7%]
                        lg:left-[5%] lg:bottom-[40%] lg:w-[7%]
                        xl:left-[5%] xl:bottom-[40%] xl:w-[10%]
                        2xl:-left-[5%] 2xl:bottom-[30%] 2xl:w-[10%] 
                        aspect-square -translate-x-1/2 -translate-y-1/2 
                        border-4 border-dashed border-purple-400 rounded-full z-20"
                        animate={{
                            rotate: [0, -360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero