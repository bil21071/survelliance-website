
import { BrowserRouter } from 'react-router-dom';

import { About, Contact, Experience, Feedbacks, Hero, Navbar,  Tech, Works, StarsCanvas } from './components';

import 'font-awesome/css/font-awesome.min.css';




const App = () => {
  

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
          <About />
          <Experience />
        <Tech />
        <Contact />
      
        </div>
        <div    className='relative z-0'>

          


        </div>


      </div>
    
    
    
    
    
    
    
    
    </BrowserRouter>
    
    
  )
}

export default App
