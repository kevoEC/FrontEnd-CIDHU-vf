import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { ComplaintUser } from "../ComplaintUser/ComplaintUser";
import { ClientAdmin } from "../ClientAdmin/Client";
import { ComplaintAdmin } from "../ComplaintAdmin/ComplaintAdmin";
import { ProcessAdmin } from "../ProcessAdmin/ProcessAdmin";
import { DatesAdmin } from "../DatesAdmin/DatesAdmin";
import { ComplaintAbogado } from "../ComplaintAbogado/ComplaintAbogado";
import { CoreDefensa } from "../CoreDefensa/CoreDefensa"; 

export default function Content() {
  const { selectedOption } = useContext(AuthContext);

  const renderContent = () => {
    switch (selectedOption) {
      case "ComplaintUser":
        return <ComplaintUser />;
      case "ClientAdmin":
        return <ClientAdmin />;
      case "ComplaintAdmin":
        return <ComplaintAdmin />;  
      case "ProcessAdmin":
        return <ProcessAdmin />;
      case "DatesAdmin":
        return <DatesAdmin />;
      case "ComplaintAbogado":
        return <ComplaintAbogado />;
      case "CoreDefensa":
        return <CoreDefensa />;
      default:
        return null;
    }
  };

  return <div className="content-wrapper">{renderContent()}</div>;
}
