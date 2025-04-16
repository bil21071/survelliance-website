
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom';

import { About, Contact, Experience, Feedbacks, Hero, Navbar,  Tech, Works, StarsCanvas ,CameraFeed} from './components';

import 'font-awesome/css/font-awesome.min.css';
import AiAlerts from './components/AiAlertDashboard';

const App = () => {
  return (
    <Router>
      <div className='relative z-0 bg-primary'>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Experience />
                <Tech />
                <Contact />
              </>
            }
          />
          <Route path="/livestream" element={<CameraFeed />} />
          <Route path="/aialert" element={<AiAlerts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;