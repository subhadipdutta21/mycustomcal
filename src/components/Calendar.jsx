import React from "react";
import dateFns from "date-fns";

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    data: [
      { id: 1, desc: "todo-1", day: 10 },
      { id: 2, desc: "todo-2", day: 14 },
      { id: 3, desc: "todo-3", day: 10 },
      { id: 4, desc: "todo-4", day: 14 }
    ]
  };

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            {"<"}
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">{">"}</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate, data } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    const insideCell = {
      fontSize: 15,
      background: "#4688EA",
      color: "white",
      padding: "0px 15px 0px 15px",
      marginBottom: 2
    };

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`droppable col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
            onDragOver={(e) => this.onDragOver(e, formattedDate)}
            onDrop={(e) => this.onDrop(e, dateFns.parse(cloneDay))}
          >
            <div className="number">{formattedDate}</div>
            <br />
            {data.map((itm) => {
              if (itm.day === parseInt(formattedDate, 10))
                return (
                  <div
                    className="draggable"
                    draggable
                    onDragStart={(e) => this.onDragStart(e, itm)}
                    key={itm.desc}
                    style={insideCell}
                  >
                    {itm.desc}
                  </div>
                );
              return false;
            })}
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = (day) => {
    console.log(day);
    console.log(day.getDate());
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  onDragStart = (ev, itm) => {
    console.log("dragstart:", itm);
    ev.dataTransfer.setData("id", itm.id);
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };

  onDrop = (ev, cat) => {
    let id = ev.dataTransfer.getData("id");
    console.log(id, cat);
    const movingItm = this.state.data.filter((itm) => itm.id === parseInt(id));
    console.log(movingItm);
    movingItm[0].day = cat.getDate();
    this.setState(
      {
        data: [
          ...this.state.data.filter((itm) => itm.id !== parseInt(id, 10)),
          movingItm[0]
        ]
      },
      () => console.log(this.state.data)
    );
    // let tasks = this.state.tasks.filter((task) => {
    //   if (task.name == id) {
    //     task.category = cat;
    //   }
    //   return task;
    // });
    // console.log(tasks);
    //  this.setState({
    //      ...this.state,
    //      tasks
    //  });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
