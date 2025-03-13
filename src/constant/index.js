import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
    
  } from "../assets";
  import { FaGithub, FaYoutube } from 'react-icons/fa'; // GitHub and YouTube icons

  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  // bro stop yapping 
  const services = [
    {
      title: "AI and ML Computer Vision Solutions",
      icon: web,
    },
    {
      title: "Smart Security Surveillance product",
      icon: mobile,
    },
    {
      title: "Web development",
      icon: backend,
    },
    {
      title: "App development",
      icon: creator,
    },
  ];
  export const teamMembers = [
    {
      name: "Muhammad Bilal Zubairi",
      role: "Founder and CEO",
      photo: "/bilal.jpg",
       linkedin: "https://www.linkedin.com/in/muhammadbilal-zubairi-203124237/",
    },
    {
      name: "Muhammad Mustafa",
      role: "Devops Engineer",
      photo: "/a3.jpeg",
       linkedin: "https://www.linkedin.com/in/muhammad-bilal-zubairi/",
    },
    {
      name: "Abdullah Bin Talha",
      role: "Ai developer",
      photo: "/abdullah.jpg",
       linkedin: "https://www.linkedin.com/in/muhammad-bilal-zubairi/",
    },
    {
      name: "Zain",
      role: "Ai developer",
      photo: "/image_64.png",
       linkedin: "https://www.linkedin.com/in/muhammad-bilal-zubairi/",
    },
    {
      
      name: "Ahmed Saeed",
      role: "Devops Engineer",
      photo: "/image_64.png",
       linkedin: "https://www.linkedin.com/in/muhammad-bilal-zubairi/",
    },
    // Add more team members as needed
  ];
  // ok sir understood, all right uin your aura is negative
  const technologies = [
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    {
      name: "figma",
      icon: figma,
    },
    {
      name: "docker",
      icon: docker,
    },
  ];
  // Smart ass shit 😊
  const experiences = [
    {
      title: "React.js Developer",
      company_name: "Starbucks",
      icon: starbucks,
      iconBg: "#383E56",
      date: "March 2020 - April 2021",
      points: [
        "Developing and maintaining web applications using React.js and other related technologies.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
        "Participating in code reviews and providing constructive feedback to other developers.",
      ],
    },
    {
      title: "Ai powered video analytics using yolo V11",
      company_name: "NeuraVision.Ai",
      icon: '',
      iconBg: "#E6DEDD",
      date: " Feb 2024",
      points: [
        "Real-Time Multi-Object Detection: Utilizes YOLOv11 for detecting various objects in live RTSP camera streams with OpenCV.",
        "Trained Detection Models: Includes weapon detection, pet/baby detection, fire detection, and fall/jump detection for diverse real-time applications.",
        "Custom AI Solutions: Models are trained for high accuracy in detecting specific objects to enhance security, safety, and monitoring."
        
      ],
    },
    {
      title: "Web Developer",
      company_name: "Shopify",
      icon: shopify,
      iconBg: "#383E56",
      date: "Jan 2022 - Jan 2023",
      points: [
        "Developing and maintaining web applications using React.js and other related technologies.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
        "Participating in code reviews and providing constructive feedback to other developers.",
      ],
    },
    {
      title: "Full stack Developer",
      company_name: "Meta",
      icon: meta,
      iconBg: "#E6DEDD",
      date: "Jan 2023 - Present",
      points: [
        "Developing and maintaining web applications using React.js and other related technologies.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
        "Participating in code reviews and providing constructive feedback to other developers.",
      ],
    },
  ];
  // lol so much code 😭
  const testimonials = [
    {
      testimonial:
        "Best work and provided on time",
      name: "Abban Ali",
      designation: "Lead Product Manager",
      company: "",
      image: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients.",
      name: "Dr Naseem",
      designation: "CEO",
      company: "DEF Corp",
      image: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
    {
      testimonial:
        "Best Ai and Iot related work delivered on time",
      name: "Ayan Ali",
      designation: "Product Manager",
      company: "456 Enterprises",
      image: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
    },
  ];

  const projects = [
    {
      title: "Ai powered Multi-object and pose detection using YOLOv11",
      company_name: "NexoraVision.Ai",
      icon: "https://cdn.prod.website-files.com/6479eab6eb2ed5e597810e9e/66f680814693dd5c3b60dfcb_YOLO11_Thumbnail.png",  // Replace with your project icon image
      iconBg: "#383E56",
      date: "",
      youtubeLink: "https://youtube.com/someVideoLink",  // Replace with actual YouTube link
      githubLink: "https://github.com/yourUsername/ecom-app",  // Replace with actual GitHub link
      projectImage: "https://doimages.nyc3.cdn.digitaloceanspaces.com/010AI-ML/2024/Shaoni/yolov11/general_object_detection.png",  // Replace with your project image
      points: [
        "Real-Time Multi-Object Detection: Utilizes YOLOv11 for detecting various objects in live RTSP camera streams with OpenCV.",
        "Trained Detection Models: Includes weapon detection, pet/baby detection, fire detection, and fall/jump detection for diverse real-time applications.",
        "Custom AI Solutions: Models are trained for high accuracy in detecting specific objects to enhance security, safety, and monitoring.",
        "It is trained on GPU geforce rtx 4050"
      ],
    },
    {
      title: "6DOF Robotic Arm using Arduino UNO",
      company_name: "NexoraVision.Ai",
      icon: "C:/Users/Hp/Desktop/NeuraVision.Ai/AdobeStock_193308746_Preview.jpeg",  // Replace with your project icon image
      iconBg: "#E6DEDD",
      date: "",
      youtubeLink: "https://youtube.com/shorts/Z1gzr3FByTg?feature=share",  // Replace with actual YouTube link
      githubLink: "https://github.com/bil21071/ROBOTIC-ARM-6DOF-USING-ROS-AND-ARDUINO",  // Replace with actual GitHub link
      projectImage: "https://www.robotpark.com/image/cache/data/PRO/95114/95114-Robotpark-6-DOF-Aluminum-Robot-Arm-Kits-2-700x700.jpg",  // Replace with your project image
      points: [
        "Real-time control of the 6 Degrees of Freedom (DOF) robotic arm using ESP32 for high precision and accuracy.",
"It is controlled through the ROS2",
"Utilized advanced algorithms and sensor feedback to enable precise movement",
      ],
    },
    {
      title: "Cancer-Detection-in-Histopathology-Images-Using-TDF-Net-Module-using-ML ",
      company_name: "NexoraVision.Ai",
      icon: "C:/Users/Hp/Desktop/NeuraVision.Ai/AdobeStock_193308746_Preview.jpeg",  // Replace with your project icon image
      iconBg: "#383E56",
      date: "",
      youtubeLink: "https://youtube.com/portfolioVideo",  // Replace with actual YouTube link
      githubLink: "https://github.com/bil21071/Cancer-Detection-in-Histopathology-Images-Using-Multimodal-Data-and-TDF-Net-Module-using-ML",  // Replace with actual GitHub link
      projectImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs1g2bU5ZfOWHiWYv0DX0H5xDIJV6tGnj2xg&s",  // Replace with your project image
      points: [
        "The objective of this project was to develop an advanced system for cancer detection in histopathology images using multimodal data and the TDF-Net (Temporal Difference Fusion Network) module. The system aims to combine different types of data, such as histopathology images, genetic data, and patient metadata, to improve the accuracy .",
        
      ],
    },
    {
      title: "HUMAN-ACTIVITY-RECOGNITION-USING-OPENPOSE-OPENCV-AI ",
      company_name: "NexoraVision.Ai",
      icon: "C:/Users/Hp/Desktop/NeuraVision.Ai/AdobeStock_193308746_Preview.jpeg",  // Replace with your project icon image
      iconBg: "#383E56",
      date: "",
      youtubeLink: "https://youtube.com/portfolioVideo",  // Replace with actual YouTube link
      githubLink: "https://github.com/bil21071/HUMAN-ACTIVITY-RECOGNITION-USING-OPENPOSE-OPENCV-AI",  // Replace with actual GitHub link
      projectImage: "https://kemtai.com/wp-content/uploads/2022/12/65603fig.png",  // Replace with your project image
      points: [
        "It notes the standing and sitting postures and detect them in realtime environment.",
        "It uses Openpose Library which is used to detect the keypoints or poses.",
        "Notes the timestamp of the person who is sitting/standing."
        
      ]
    },
    {
      title: "Face-Recognition-System using DEEPFACE",
      company_name: "NexoraVision.Ai",
      icon: "C:/Users/Hp/Desktop/NeuraVision.Ai/AdobeStock_193308746_Preview.jpeg",  // Replace with your project icon image
      iconBg: "#383E56",
      date: "",
      youtubeLink: "https://youtube.com/portfolioVideo",  // Replace with actual YouTube link
      githubLink: "https://github.com/bil21071/Face-recognition-system-using-deepface",  // Replace with actual GitHub link
      projectImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX0lWq_c6_KshbMRKhftoJ1U9wQpNFQCBBYg&s",  // Replace with your project image
      points: [
       "It uses mediapipe face detector for the face detection process.",
       "It uses the deepface Facenet512 model for the facial recognition process.",
       "Detect and recognize the known and unknown visitors."
        
      ]
    },
  ];

  
 
  
  export { services, technologies, experiences, testimonials, projects };