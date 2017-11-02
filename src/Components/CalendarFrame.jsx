import React, { Component } from "react";
import HijriCalendar from "../Libs/hijri_calendar";
import Calendar from "../Components/Calendar";
import Modal from "../Components/Modal";
import { Button, Divider } from "material-ui";
import HijriDate from "../Libs/hijri_date.js";
import List, {
  ListItem,
  ListItemText,
} from "material-ui/List";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";

class CalendarFrame extends Component {
  statics = {
    modalId: "modal",
    miqaatsUrl: "../miqaats.json"
  };

  state = {
    dialogTitle: "",
    currentDayMiqaats: [],
    day: null,
    calendar: new HijriCalendar(
      this.props.today.getYear(),
      this.props.today.getMonth()
    ),
    miqaats: [],
    open: false
  };

  getInitialState() {
    return {
      day: null,
      calendar: new HijriCalendar(
        this.props.today.getYear(),
        this.props.today.getMonth()
      ),
      miqaats: []
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    var that = this;
    fetch("./miqaats.json", {
      method: "GET"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        that.setState({
          miqaats: data
        });
      });
  }
  navigateToToday = () => {
    this.setState({
      calendar: new HijriCalendar(
        this.props.today.getYear(),
        this.props.today.getMonth()
      )
    });
  };
  changeMonth = monthChange => {
    this.setState({
      calendar:
        monthChange < 0
          ? this.state.calendar.previousMonth()
          : this.state.calendar.nextMonth()
    });
  };
  changeYear = yearChange => {
    this.setState({
      calendar:
        yearChange < 0
          ? this.state.calendar.previousYear()
          : this.state.calendar.nextYear()
    });
  };
  showModal = (day, miqaats) => {
    this.setState({
      day: day,
      dialogTitle:
        day.hijri.date +
        " " +
        HijriDate.getMonthName(day.hijri.month) +
        " " +
        day.hijri.year,
      currentDayMiqaats: miqaats
    });

    this.handleClickOpen();
  };
  render() {
    return (
      <div>
        <div className="calendar-frame">
          <Dialog
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
          >
            <DialogTitle>{this.state.dialogTitle || "Null"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.currentDayMiqaats.length > 0 ? (
                  <List style={{ margin: "-20px" }}>
                    {this.state.currentDayMiqaats[0].miqaats.map(
                      (item, index) => {
                        return (
                          <div>
                            <ListItem style={{ padding: "10px 20px" }}>
                              <ListItemText primary={item.title} />
                            </ListItem>
                            {index !==
                            this.state.currentDayMiqaats[0].miqaats.length -
                              1 ? (
                              <Divider light />
                            ) : null}
                          </div>
                        );
                      }
                    )}
                  </List>
                ) : (
                  <span>
                    There are no miqaats found on this day. Day having pink
                    border or green dots are having miqaats. Pink border
                    indicates major miqaats and green dots indicates all other
                    miqaats.
                  </span>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleRequestClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Calendar
            calendar={this.state.calendar}
            today={this.props.today}
            modalId={CalendarFrame.modalId}
            onMonthChange={this.changeMonth}
            navigateToToday={this.navigateToToday}
            miqaats={this.state.miqaats}
            onDayClick={this.showModal}
          />
          <Modal
            modalId={CalendarFrame.modalId}
            miqaats={this.state.miqaats}
            day={this.state.day}
          />
        </div>
      </div>
    );
  }
}

export default CalendarFrame;
