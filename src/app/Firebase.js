import React, { Component } from "react";
import { database } from "../firebase";

export default class Firebase extends Component {
  state = {
    loading: true,
    value: null
  };

  updateFirebaseRef(path) {
    if (this.firebaseRef) {
      this.firebaseRef.off();
    }

    if (path) {
      this.firebaseRef = database.ref(path);
      this.firebaseRef.on("value", snapshot => {
        this.setState({
          loading: false,
          value: snapshot.val()
        });
      });
    }
  }

  componentDidMount() {
    this.updateFirebaseRef(this.props.path);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.path !== nextProps.path) {
      this.updateFirebaseRef(nextProps.path);
    }
  }

  componentWillUnmount() {
    this.updateFirebaseRef();
  }

  render() {
    const { loading, value } = this.state;
    return this.props.children(value, loading);
  }
}
