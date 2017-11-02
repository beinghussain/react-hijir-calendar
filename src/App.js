import React, { Component } from "react";
import "./App.css";
import HijriDate from './Libs/hijri_date';
import CalendarFrame from './Components/CalendarFrame';

class App extends Component {
  render() {
    return (
    <CalendarFrame today={HijriDate.fromGregorian(new Date())} />
    )
  }
}

export default App;
