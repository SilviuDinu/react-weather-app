import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Home from "@pages/Home";
import Navbar from "@components/Navbar";
import About from "@pages/About";
import Body from "@components/Body";
import Page404 from "@pages/Page404";
import { SearchParamsProvider } from "@providers/SearchParamsContext";
import { WeatherProvider } from "@providers/WeatherContext";
import { CoordsProvider } from "@providers/CoordsContext";
import { LoadingProvider } from "@providers/LoadingContext";
import { NotificationProvider } from "@providers/NotificationContext";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Body>
          <NotificationProvider>
            <WeatherProvider>
              <LoadingProvider>
                <CoordsProvider>
                  <Switch>
                    {/* @ts-ignore */}
                    <Route exact path="/">
                      <SearchParamsProvider>
                        <Home />
                      </SearchParamsProvider>
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
              </LoadingProvider>
            </WeatherProvider>
          </NotificationProvider>
        </Body>
      </Router>
    </div>
  );
}

export default App;
