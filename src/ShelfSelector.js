import React from "react";

class ShelfSelector extends React.Component {
  onShelfMove(e) {
    const shelfName = e.target.value;
    if (shelfName === "none") {
      if (
        confirm(
          "You are going to remove that book from your libray. Are you sure?"
        )
      ) {
        this.props.onShelfChange(this.props.book, shelfName);
      }
    } else {
      this.props.onShelfChange(this.props.book, shelfName);
    }
  }

  render() {
    return (
      <div className="book-shelf-changer">
        <select
          onChange={event => this.onShelfMove(event)}
          value={this.props.picker ? "" : this.props.book.shelf}
        >
          <option value="" disabled>
            {this.props.picker ? "Pick and place on..." : "Move to..."}
          </option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="wantToRead">Want to Read</option>
          <option value="read">Read</option>
          {!this.props.picker && <option value="none">None</option>}
        </select>
      </div>
    );
  }
}

export default ShelfSelector;
