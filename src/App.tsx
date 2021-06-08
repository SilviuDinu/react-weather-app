import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import Home from '@pages/Home';
import Navbar from '@components/Navbar';
import About from '@pages/About';
import Body from '@components/Body';
import Page404 from '@pages/Page404';

function App() {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Body>
          <Switch>
            {/* @ts-ignore */}
            <Route exact path='/' component={Home}></Route>
            {/* @ts-ignore */}
            <Route exact path='/about' component={About}></Route>
            <Route path='*' component={Page404}></Route>
          </Switch>
        </Body>
      </Router>
    </div>
  );
}

export default App;
