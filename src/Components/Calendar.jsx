import React, { Component } from "react";
import Lazy from "../Libs/lazy.js";
import CalendarWeek from "../Components/CalendarWeek";
import { Paper, IconButton, Button, Card, Divider, Avatar } from "material-ui";
import HijriDate from "../Libs/hijri_date.js";
import HijriCalendar from "../Libs/hijri_calendar.js";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import ArrowForwardIcon from "material-ui-icons/ArrowForward";
import ArabicNumerals from '../Libs/arabic_numerals.js';
import Switch from "material-ui/Switch";
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from "material-ui/List";

class Calendar extends Component {
  state = {
    day: null,
    calendar: new HijriCalendar(
      this.props.today.getYear(),
      this.props.today.getMonth()
    ),
    miqaats: [],
    showGreg: false,
    arabicNums: true
  };

  miqaats = () => {
    return Lazy(this.props.miqaats)
      .filter({ month: this.props.calendar.getMonth() })
      .toArray();
  };

  allMiqaats = () => {
    var miqaats = Lazy(this.props.miqaats)
      .filter({ month: this.props.calendar.getMonth() })
      .toArray();

    var array = [];

    for (var i = 0; i < miqaats.length; i++) {
      var obj = {};
      for (var j = 0; j < miqaats[i].miqaats.length; j++) {
        obj = miqaats[i].miqaats[j];
        obj.date = miqaats[i].date;
        obj.year = miqaats[i].year;
        obj.miqaats = miqaats[i];
        array.push(obj);
      }
    }

    return array;
  };

  weeks = () => {
    var key = -1,
      today = this.props.today,
      miqaats = this.miqaats(),
      onDayClick = this.props.onDayClick,
      showGreg = this.state.showGreg,
      arabicNums = this.state.arabicNums;
    return Lazy(this.props.calendar.weeks())
      .map(function(week) {
        key += 1;
        return (
          <CalendarWeek
            key={key}
            week={week}
            today={today}
            miqaats={miqaats}
            onDayClick={onDayClick}
            showGreg={showGreg}
            arabicNums={arabicNums}
          />
        );
      })
      .toArray();
  };

  render() {
    const arrowStyle = {
      color: "#000"
    };
    const button = {
      marginTop: "15px",
      backgroundColor: "#fff",
      color: "#FF007A",
      width: "100%"
    };

    return (
      <div className="calendar">
        <Paper className="PaperShadow">
          <div className="calendarHeader">
            <h3>
              <IconButton
                style={arrowStyle}
                className="prev"
                onClick={this.props.onMonthChange.bind(null, -1)}
                color="contrast"
                aria-label="Menu"
              >
                <ArrowBackIcon />
              </IconButton>
              {HijriDate.getMonthName(this.props.calendar.getMonth())}

              <IconButton
                style={arrowStyle}
                className="next"
                onClick={this.props.onMonthChange.bind(null, +1)}
                color="contrast"
                aria-label="Menu"
              >
                <ArrowForwardIcon />
              </IconButton>
            </h3>
            <span>{this.props.calendar.getYear() + " H "}</span>
          </div>
          <div className="calendarBody">
            <table>
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>{this.weeks()}</tbody>
            </table>
          </div>
        </Paper>
        <Button
          onClick={this.props.navigateToToday}
          style={button}
          fullWidth={true}
          raised
        >
          Reset / Today
        </Button>

        <Card className={"listItems"} style={{ marginTop: 10 }}>
          <List>
            <ListItem>
              <ListItemText primary="Greg/English dates" />
              <ListItemSecondaryAction>
                <Switch
                  onChange={(event, checked) =>
                    this.setState({ showGreg: checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Arabic Numerals" />
              <ListItemSecondaryAction>
                <Switch
                  checked={this.state.arabicNums}
                  onChange={(event, checked) =>
                    this.setState({ arabicNums: checked })}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Card>
        <Card style={{ marginTop: 10, marginBottom: 10 }}>
          <List
            className="list"
            subheader={
              <div className="subheader">
                <ListSubheader>
                  Miqaats this month ({HijriDate.getMonthName(this.props.calendar.getMonth())})<span style={{float:'right'}}>{this.allMiqaats().length}</span>
                </ListSubheader>
                <Divider />
              </div>
            }
          >
            {this.allMiqaats().map((item, index) => {
              return (
                <div>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar style={{backgroundColor: '#f39c12', padding:'16px', marginRight:0}}>{ArabicNumerals.fromInteger(item.date)}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                  {index !== this.allMiqaats().length - 1 ? (
                    <Divider light />
                  ) : null}
                </div>
              );
            })}
          </List>
        </Card>
        <div class="footerText">Copyright © 2017 Hussain D. Rights reserved<br/>Found anything unapproptiate ? <a href="/" style={{textDecoration:'underline', color:"#fff"}}>Report</a></div>

      </div>
    );
  }
}

export default Calendar;
