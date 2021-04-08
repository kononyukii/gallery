import React, { Fragment } from "react";
import { createAlbumServ } from "../../../redusers";
import store from "../../../store";

//example of a class component and working with state and context
export default class CreateAlbum extends React.PureComponent {
  state = {
    isOpen: false,
    value: "",
  };

  initialCreate = () => {
    this.setState({ isOpen: true });
  };

  addAlbum = () => {
    this.setState({ isOpen: false });
    store.dispatch(createAlbumServ(this.state.value, this.props.id));
    this.setState({ value: "" });
  };

  setValue = (e) => {
    this.setState({ value: e.target.value });
  };

  enterAddAlbum = (event) => {
    if (event.key === "Enter") {
      this.addAlbum();
    }
  };

  render() {
    let checkPhotos = this.props.photos.some((item) => item.check === true);

    return (
      <Fragment>
        <div>
          <button
            type="button"
            className={`btn btn-secondary ${checkPhotos ? "" : "invisible"}`}
            onClick={this.initialCreate}
          >
            Создать альбом
          </button>
        </div>

        {this.state.isOpen && (
          <div className="modal">
            <div className="modal-body">
              <div>
                <input
                  type="text"
                  onChange={this.setValue}
                  onKeyPress={this.enterAddAlbum}
                  value={this.state.value}
                />
                <br />
                <button type="submit" onClick={this.addAlbum}>
                  Добавить название
                </button>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
