import React from "react";
import { Switch } from "antd";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; 

const ConfirmSwitch = ({ checked, onToggle, name }) => {
  const handleChange = () => {
    confirmAlert({
      title: "Confirm Action",
      message: `Are you sure you want to ${checked ? "disable" : "enable"} ${name}?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => onToggle()
        },
        {
          label: "No",
          onClick: () => {} 
        }
      ]
    });
  };

  return <Switch checked={checked} onChange={handleChange} />;
};

export default ConfirmSwitch;
