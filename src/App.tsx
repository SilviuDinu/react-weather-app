import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";
import Home from "@pages/Home";
import Navbar from "@components/Navbar";
import About from "@pages/About";
import Body from "@components/Body";
import Page404 from "@pages/Page404";
import { FORM_DATA } from "@enums/search-form.enum";
import SearchForm from "@components/SearchForm";
import CardGroup from "@components/CardGroup";
import { SearchParamsProvider } from "@providers/SearchParamsContext";
import { WeatherProvider } from "@providers/WeatherContext";

const formData = {
  input: {
    placeholder: FORM_DATA.PLACEHOLDER,
    ariaLabel: FORM_DATA.ARIA_LABEL,
    class: "city-search-form-input",
    autoComplete: false,
  },
  buttonText: FORM_DATA.BUTTON_TEXT,
  class: "city-search-form",
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Body>
          <WeatherProvider>
            <Switch>
              {/* @ts-ignore */}
              <Route exact path="/">
                <SearchParamsProvider>
                  <Home>
                    <SearchForm form={formData} />
                    <CardGroup />
                  </Home>
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
          </WeatherProvider>
        </Body>
      </Router>
    </div>
  );
}

export default App;
