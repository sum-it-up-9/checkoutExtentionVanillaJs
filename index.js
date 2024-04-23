// Define constants
const CustomerPreferred = {
    CarrierName: {
      label: "Carrier Name",
      type: "text",
      formName: "CustomerPreferredObj",
    },
    // other fields...
  };
  
  const WillCall = {
    ContactName: {
      label: "Contact Name",
      type: "text",
      formName: "WillCallObj",
    },
    // other fields...
  };
  
  const UPS = {
    Ground: {
      label: "Ground",
      type: "radio",
      formName: "UPSObj"
    },
    // other fields...
  };
  
  const FedEx = {
    Ground: {
      label: "Ground",
      type: "radio",
      formName: "FedExObj",
    },
    // other fields...
  };
  
  // Define form state variables
  let formData = {};
  let accountNumber = 0;
  let sellarsShipper = "Prepaid Truckload";
  
  let customerPreferredObj = {
    CarrierName: "",
    ContactName: "",
    // other fields...
  };
  
  let WillCallObj = {
    ContactName: "",
    ContactPhone: "",
    ContactEmail: "",
  };
  
  let FedExObj = "Ground";
  let UPSObj = "Ground";
  
  let whoPaysShippping = "Sellars Pays Freight";
  let isUsingFedExAccount = "Yes";
  let isDisplayingAccountNumber = "FedEx";
  let FormFields = FedEx;
  let selectedRadioOption = "Ground";
  
  // Define event handlers
  const handleSubmit = () => {
    console.log("handlesubmit called");
    fetch(`http://localhost:3000/cart/cart1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        // Do something with the response data
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  
  const handleRadioOptionChange = (event) => {
    selectedRadioOption = event.target.value;
  };
  
  const handleInputChange = (fieldName, value) => {
    formData[fieldName] = value;
  };
  
  const handleShippingChange = (event) => {
    whoPaysShipping = event.target.value;
  };
  
  const handleSellersShipperChange = (e) => {
    sellarsShipper = e.target.value;
  };
  
  function handleWillCallChange(e) {
    WillCallObj[e.target.name] = e.target.value;
  }
  
  function handleFedExChange(e) {
    FedExObj = e.target.value;
    console.log("change", e.target.value);
  }
  
  function handleUPSChange(e) {
    UPSObj = e.target.value;
  }
  
  function handleCustomerPreferredChange(e) {
    customerPreferredObj[e.target.name] = e.target.value;
  }
  
  const handleShipperChange = (event) => {
    const Shipper = event.target.value;
    console.log("shipper to use: ", event.target.value);
    // setSelectedShipper(Shipper); // You can remove this line
    if (Shipper === "UPS") {
      FormFields = UPS;
      isDisplayingAccountNumber = "UPS";
    } else if (Shipper === "Will Call") {
      FormFields = WillCall;
      isDisplayingAccountNumber = "WillCall";
    } else if (Shipper === "FedEx") {
      FormFields = FedEx;
      isDisplayingAccountNumber = "FedEx";
    } else if (Shipper === "Customer Preferred Carrier") {
      FormFields = CustomerPreferred;
      isDisplayingAccountNumber = "Customer Preferred Carrier";
    }
  };
  
  const renderFormField = (fieldName, fieldType, formName) => {
    if (fieldType.type === "text") {
      // Render text input
    } else if (fieldType.type === "dropdown") {
      // Render dropdown
    } else if (fieldType.type === "radio") {
      // Render radio input
    } else if (fieldType.type === "email") {
      // Render email input
    }
  };
  
  const handleFedExAccountChange = (e) => {
    isUsingFedExAccount = e.target.value;
  };
  
  // Rendering logic will go here
  
  // Render the form
  const renderForm = () => {
    // Rendering logic
  };
  
  // Call renderForm to render the form initially
  renderForm();
  