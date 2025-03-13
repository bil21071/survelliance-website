import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon

import { styles } from '../style';
import { services, teamMembers } from '../constant';
import { fadeIn, textVariant } from '../utils/motion';

import { Sectionwrapper } from '../hoc';

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'>
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450
          }}
          className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
          <img src={icon} alt={title} className='w-16 h-16 object-contain' />
          <h3 className='text-white text-[20px] font-bold text-center'>{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const TeamCard = ({ index, name, role, photo, linkedin }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("left", "spring", 0.5 * index, 0.75)}
        className='w-full blue-gradient p-[1px] rounded-[20px] shadow-card'>
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450
          }}
          className='bg-neutral-950 rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'>
          <img src={photo} alt={name} className='w-28 h-28 object-contain rounded-full' />
          <h3 className='text-white text-[20px] font-bold text-center'>{name}</h3>
          <p className='text-white text-[16px] text-center'>{role}</p>

          {/* LinkedIn Icon */}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-[20px] mt-4"
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'>
        At NexoraVision, we are at the forefront of innovation in the realms of Artificial Intelligence (AI) and Machine Learning (ML). Our expertise lies in creating cutting-edge computer vision products and services that are transforming various industries. From intelligent surveillance systems that enhance security to advanced IT applications that drive operational efficiency, NexoraVision is dedicated to leveraging the power of AI and ML to solve complex problems and create smarter solutions.
      </motion.p>
      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
      <motion.div variants={textVariant()} className='mt-20'>
        <h2 className={styles.sectionHeadText}>Our Team</h2>
      </motion.div>
      <div className='mt-10 flex flex-wrap gap-10'>
        {teamMembers.map((member, index) => (
          <TeamCard key={member.name} index={index} {...member} />
        ))}
      </div>
    </>
  )
}

export default Sectionwrapper(About, "about")
