import { FaGithub, FaYoutube } from 'react-icons/fa'; // Import GitHub and YouTube icons
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';
import 'react-vertical-timeline-component/style.min.css';
import { styles } from '../style';
import { projects } from '../constant';
import { Sectionwrapper } from '../hoc'; // Corrected the typo to SectionWrapper
import { textVariant } from '../utils/motion';

const ProjectCard = ({ project }) => (
  <VerticalTimelineElement
    contentStyle={{ background: "#1d1836", color: "#fff" }}
    contentArrowStyle={{
      borderRight: "15px solid #232631", // Increased the arrow size (previously 7px)
      borderTop: "7px solid transparent", // Ensures the top part of the arrow is visible
      borderBottom: "7px solid transparent", // Keeps the arrow proportions
      width: "20px", // Adjusted width to make the arrow bigger
      height: "20px", // Adjusted height to make the arrow bigger
    }}
    date={project.date}
    iconStyle={{
      background: "transparent", // Removed icon background to simplify
      boxShadow: "none", // Removed any box shadow
      width: "0", // Hiding the icon completely
      height: "0", // Making the icon "invisible"
    }}
    icon={null} // No icon displayed
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{project.title}</h3>
        <p className="text-secondary text-[16px] font-semibold" style={{ margin: 0 }}>
          {project.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {project.points.map((point, index) => (
          <motion.li
            key={`project-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.3 }}
          >
            {point}
          </motion.li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2">
        {/* GitHub and YouTube links with icons */}
        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500">
          <FaGithub className="mr-2" /> GitHub Repository
        </a>
        <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500">
          <FaYoutube className="mr-2" /> YouTube Demo
        </a>
      </div>

      {project.projectImage && (
        <div className="mt-5">
          <img src={project.projectImage} alt={project.title} className="w-full rounded-lg" />
        </div>
      )}
    </motion.div>
  </VerticalTimelineElement>
);

const Projects = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What we have done so far</p>
        <h2 className={styles.sectionHeadText}>Nexora Vision Projects.</h2>
      </motion.div>
      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default Sectionwrapper(Projects, "work");
