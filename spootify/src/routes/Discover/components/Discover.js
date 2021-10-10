import React, { Component } from "react";
import axios from "axios";
import qs from "qs";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import config from "../../../config";
import "../styles/_discover.scss";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  componentDidMount() {
    const b64encoded_clientCreds = btoa(
      config.api.clientId + ":" + config.api.clientSecret
    );
    const params = qs.stringify({
      grant_type: "client_credentials",
    });
    let token = "";

    // Get Token
    axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: " Basic " + b64encoded_clientCreds,
      },
      data: params,
    })
      .then((res) => {
        token = res.data.access_token;
        const header = { Authorization: "Bearer " + token };

        // New Releases
        axios({
          url: "https://api.spotify.com/v1/browse/new-releases",
          headers: header,
        }).then((r) => {
          this.setState({
            newReleases: r.data.albums.items,
          });
        });
        // Playlists
        axios({
          url: "https://api.spotify.com/v1/browse/featured-playlists",
          headers: header,
        }).then((r) => {
          this.setState({
            playlists: r.data.playlists.items,
          });
        });
        // Categories
        axios({
          url: "https://api.spotify.com/v1/browse/categories",
          headers: header,
        }).then((r) => {
          this.setState({
            categories: r.data.categories.items,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
