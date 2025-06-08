"use client";

import { IconMapPin } from "@tabler/icons-react";
import React from "react";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function CheckclockMap() {
  return (
    <div className="w-full h-96">
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYW1hbmRhZmFkaWxhMTEiLCJhIjoiY21iam1vbmJ4MGl0aTJrcTY5c3dwNm54eiJ9.bNz01unwDtQUnX7vBfjp0g"
        initialViewState={{
          longitude: 112.6322144,
          latitude: -7.9546738,
          zoom: 17, // Increased zoom for better visibility
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Marker longitude={112.6322144} latitude={-7.9546738} anchor="bottom">
          <div style={{ color: "#ef4444", fontSize: "24px" }}>
            <IconMapPin size={32} />
          </div>
        </Marker>
      </Map>
    </div>
  );
}
