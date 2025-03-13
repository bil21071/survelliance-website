import React from 'react';
import '../components/a.css'; // Optional, for custom styles
import { styles } from '../style';
const techData = [
  { name: 'TensorFlow', icon: 'https://media.wired.com/photos/5927105acfe0d93c474323d7/master/pass/google-tensor-flow-logo-black-S.jpg' },
  { name: 'PyTorch', icon: '/123.png' },
  { name: 'GitHub', icon: 'data:image/png;base64,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' },
  
  { name: 'Jira', icon:'/jira.png' },
  { name: 'OpenCV', icon: '/nid.png' },
  
];

const Tech = () => {
  return (
    <>
    <h2 className={styles.sectionHeadText}>Techstack</h2>
    <div className="tech-container">
      
      {techData.map((tech) => (
        <div className="tech-box" key={tech.name}>
          <img src={tech.icon} alt={tech.name} className="tech-icon" />
          <p className="tech-name">{tech.name}</p>
        </div>
      ))}
    </div>
    </>
    
  );
};

export default Tech;
