import { motion } from 'framer-motion';
import '../components/a.css'; 
import { styles } from '../style';
import { fadeIn, textVariant } from '../utils/motion';
import { testimonials } from '../constant';

const FeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div
    variants={fadeIn('spring', index * 0.5, 0.75)}
    className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full sm:w-[380px] max-w-[400px] mx-auto"
  >
    <p className="text-5xl text-white font-extrabold">"</p>

    <div className="mt-6">
      <p className="text-white text-lg italic">{testimonial}</p>

      <div className="mt-6 flex items-center gap-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full border-2 border-gray-500"
        />
        <div className="flex flex-col text-white">
          <p className="font-semibold">{name}</p>
          <p className="text-gray-400">{designation}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div className="mt-12 bg-black py-16 px-6 rounded-lg">
      {/* Heading Section without Background */}
      <div className="flex justify-center items-center">
        <motion.div variants={textVariant()}>
          <h2 className={`${styles.sectionHeadText} text-3xl text-center text-white font-semibold`}>
            Testimonials
          </h2>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="flex flex-wrap justify-center mt-10 gap-10">
        {testimonials.map((testimonial, index) => (
          <FeedbackCard
            key={testimonial.name}
            index={index}
            {...testimonial}
          />
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
