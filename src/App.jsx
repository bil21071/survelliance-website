
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom';

import { About, Contact, Experience, Feedbacks, Hero, Navbar,  Tech, Works, StarsCanvas ,CameraFeed} from './components';

import 'font-awesome/css/font-awesome.min.css';
import AiAlerts from './components/AiAlertDashboard';
import AnomalyReportGenerator from './components/AnomalyReportGenerator';
import SecurityAgentChatbot from './components/SecurityAgentChatbot';

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
          <Route path="/anomalyreportgen" element={<AnomalyReportGenerator />} />
          <Route path="/Securityagentchatbot" element={<SecurityAgentChatbot />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;