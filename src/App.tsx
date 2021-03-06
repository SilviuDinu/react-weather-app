import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Home from "@pages/Home";
import Navbar from "@components/Navbar/Navbar";
import About from "@pages/About";
import Body from "@components/Body/Body";
import Footer from "@components/Footer/Footer";
import Page404 from "@pages/Page404";
import { WeatherProvider } from "@providers/WeatherContext";
import { CoordsProvider } from "@providers/CoordsContext";
import { LoadingProvider } from "@providers/LoadingContext";
import { NotificationProvider } from "@providers/NotificationContext";
import { CurrentCityProvider } from "@providers/CurrentCityContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Body>
          <NotificationProvider>
            <WeatherProvider>
              <LoadingProvider>
                <CurrentCityProvider>
                  <CoordsProvider>
                    <Switch>
                      {/* @ts-ignore */}
                      <Route exact path="/">
                        <Home />
                      </Route>
                      {/* @ts-ignore */}
                      <Route exact path="/about">
                        <About />
                      </Route>
                      <Route path="*">
                        <Page404 />
                      </Route>
                    </Switch>
                  </CoordsProvider>
                </CurrentCityProvider>
              </LoadingProvider>
            </WeatherProvider>
          </NotificationProvider>
        </Body>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
