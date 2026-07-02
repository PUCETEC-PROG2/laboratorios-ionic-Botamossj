import React from "react";
import { IonSpinner } from "@ionic/react";
import "./LoadingSpinner.css";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-overlay">
            <IonSpinner name="circular" color="primary" className="loading-spinner"/>
        </div>
    );
};

export default LoadingSpinner;
