import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useForm } from 'react-hook-form';
import { section } from 'framer-motion/client';


function Contact() {
    const form = useRef();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // ส่งอีเมลด้วย EmailJS
        emailjs.sendForm(
            'ayopee01',
            'template_ychozgb',
            form.current,
            '28OMdSdVazafrHpK2'
        )
            .then((result) => {
                console.log("Email sent successfully:", result.text);
                alert("Email sent successfully!");
                reset(); // รีเซ็ตฟอร์มหลังส่งสำเร็จ
            }, (error) => {
                console.log("Email sending error:", error.text);
                alert("Email sending error");
            });
    };
    const handleCancel = () => {
        reset(); // ล้างค่าฟอร์มทั้งหมด
    };
    return (
        <form id='contact' ref={form} onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center h-full gap-y-14 py-10 bg-gray-800">
                <div className="flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-semibold text-gray-100">Contact Us</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-200 pt-4 px-8">Our customer care is open from Mon-Fri, 10:00 am to 5:00 pm</p>
                    <a className="mt-1 text-sm font-semibold text-gray-200 pt-4 px-8 transition-all duration-300 hover:text-indigo-500" href="mailto:info@tlwa.or.th">info@tlwa.or.th</a>
                    <a className="mt-1 text-sm font-semibold text-gray-200 pt-4 px-8 transition-all duration-300 hover:text-indigo-500" href="tel:0809897415">080-9897415 ( คุณใหญ่ )</a>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-100">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Your Name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    {...register("firstname", {
                                        required: "First name is required",
                                        minLength: {
                                            value: 3,
                                            message: "First name must be at least 3 characters"
                                        }
                                    })}
                                />
                                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-100">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Your Lastname"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    {...register("lastname", {
                                        required: "Last name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Last name must be at least 3 characters"
                                        }
                                    })}
                                />
                                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email address</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Your Email"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter a valid email address"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-100">Phone</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        {...register("phone", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "Phone number must be exactly 10 digits"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-4">
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-100">Subject</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="Your Subject"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        {...register("subject")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-100">Message</label>
                            <div className="mt-2">
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your Message"
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    {...register("message", {
                                        required: "Message is required"
                                    })}
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-x-6">
                        <button
                            type="button"
                            className="cursor-pointer transition-all duration-300 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-400"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer transition-all duration-300 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700 "
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Contact