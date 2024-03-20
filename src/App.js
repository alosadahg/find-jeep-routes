import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import jeep_routes from "./jeep_routes.json";
import { TextField, Button } from "@mui/material";

function App() {
  const [jeeps, setJeepRoutes] = useState([]);
  const [codes, setCodes] = useState("");
  const [modifiedJeepRoutes, setModifiedJeepRoutes] = useState([]);
  const [commonRouteColors, setCommonRouteColors] = useState({});

  useEffect(() => {
    setJeepRoutes(jeep_routes.jeep_routes);
  }, []);

  const getCodes = (event) => {
    const input = event.target.value;
    setCodes(input); 
  };

  const validateInput = (input) => {
    const regex = /^\d{2}[A-Za-z](,\d{2}[A-Za-z])*$/;
    return regex.test(input);
  };

  function generateRandomColor() {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');
    const color = `#${redHex}${greenHex}${blueHex}`;
    return color;
  }

  const getRoutes = () => {
    if(!validateInput(codes)) {
      return alert("Invalid input! Please enter valid Jeep Codes (ex: 04A,10C...)");
    } 
    const codesInput = codes.split(",");

    const filteredJeepRoutes = jeeps.filter(jeepData => {
      const jeepCodes = Object.keys(jeepData);
      return jeepCodes.some(code => codesInput.includes(code));
    });

    const routeCounts = {};
    filteredJeepRoutes.forEach(jeepData => {
      for (const code in jeepData) {
        jeepData[code].forEach(route => {
          routeCounts[route] = (routeCounts[route] || 0) + 1;
        });
      }
    });

    const modifiedRoutes = filteredJeepRoutes.map(jeepData => {
      const modifiedData = {};
      for (const code in jeepData) {
        modifiedData[code] = jeepData[code].map(route => {
          if (routeCounts[route] > 1) {
            if (!(route in commonRouteColors)) {
              commonRouteColors[route] = generateRandomColor();
            }
            return {
              name: route,
              isCommon: true,
              color: commonRouteColors[route]
            };
          } else {
            return {
              name: route,
              isCommon: false,
              color: "black"
            };
          }
        });
      }
      return modifiedData;
    });

    setModifiedJeepRoutes(modifiedRoutes);
  };

  return (
    <div className="App">
      <div>
        <img src='jeep_logo.jfif' className="jeep-logo" alt="logo" />
      </div>
      <TextField
        label="Jeep Codes"
        placeholder="Enter Jeep Codes (ex: 04A,10C...)"
        variant="outlined"
        style={{ width: "400px" }}
        value={codes}
        onChange={getCodes}
      />
      <Button
        variant="contained"
        style={{ height: "55px", marginLeft: "5px" }}
        onClick={getRoutes}
      >
        Find Routes
      </Button>

      <div>
        {modifiedJeepRoutes.map((modifiedData, index) => (
          <div key={index}>
            {Object.entries(modifiedData).map(([code, routes]) => (
              <div key={code}>
                {routes.map((route, index) => (
                  <span
                    key={index}
                    style={{ color: route.color }}
                  >
                    {route.name}{index !== routes.length - 1 ? " <=> " : ""}
                  </span>
                ))}
                <br />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
