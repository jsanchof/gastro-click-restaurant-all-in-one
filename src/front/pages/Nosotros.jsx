import React from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export const Nosotros = () => {

    const center = {
        lat: 40.748817, // Empire State Building latitude
        lng: -73.985428 // Empire State Building longitude
    };


    // Optional: mapStyles if you want a custom look
    // const mapStyles = [ ... ];

    return (
        <div className='container'>
            <div className="row">
                <div className="card mb-3 w-100">
                    <div className="row g-0">
                        <div className="col-md-7">
                            <div className="card-body">
                                <h5 className="card-title">Sucursales</h5>
                                <h2>Cada vez más</h2>
                                <h2>cerca de ti</h2>
                                <p className="card-text">
                                    Te esperamos en nuestras más de 60 sucursales en CDMX y Área Metropolitana.
                                </p>
                                <a href="#" className="btn btn-primary">
                                    Go somewhere
                                </a>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <img src="https://picsum.photos/500/500" className="img-fluid rounded-start" alt="..." />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="reviews">
                    <div className="cards-container">
                        <h3>People</h3>
                        <div className="d-flex overflow-auto">
                            <h1>REVIEWS</h1>
                            {/* 
              store.people.map((item, index) => (
                <PeopleCard key={item.uid} item={item} />
              )) 
              */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                <h2 className="mb-4 text-center">Our Location</h2>
                <div className="card shadow border-0 mx-auto" style={{ maxWidth: "800px" }}>
                    <div className="card-body p-0" style={{ overflow: 'hidden', borderRadius: '0.5rem' }}>
                        <div className="ratio" style={{ aspectRatio: "4/3" }}>
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "100%" }}
                                    center={center}
                                    zoom={16}   // little closer zoom
                                    options={{
                                        fullscreenControl: false,
                                        mapTypeControl: false,
                                        streetViewControl: false,
                                    }}
                                >
                                    <Marker position={center} />
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};
