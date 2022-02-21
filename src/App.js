import React, { useState } from "react";
import "./App.css";
import { FiPlusCircle } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import styled, { keyframes } from "styled-components";


const colorsAnimate = (colors) => {
  let numberOfTransitions = colors.length; 
  let transitionSteps = 100 / numberOfTransitions; // to calculate how many divisions the keyframe there will be. 
  let percentage = 100; // used to controll the changing percentage
  let transitionText = ""; //the transition text that will be generated automatically

  function handleTransition() {
    const inverseColor = colors.slice(0).reverse(); // invert the array is necessary to show in order the colors.

    inverseColor.forEach((element, index) => {
      if (index === 0) {
        transitionText += `0%, 100%`;
        transitionText += ` {background-color: #${element.value1}${element.value2}${element.value3}}`;
      } else {
        percentage = percentage - transitionSteps;
        transitionText += `${percentage}% {background-color: #${element.value1}${element.value2}${element.value3}}`;
      }
    });
    return transitionText;
  }

  return keyframes`       
    ${handleTransition()}
        `;
};

const CycleArea = styled.div`
  height: 75vh;
  width: 100vw;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: #f5f2f2;
  animation: ${(props) => colorsAnimate(props.colors)}
    ${(props) => (props.active === false ? 0 : props.interval)}s infinite;
  animation-timing-function: ease-in-out;
`;

const ColorPreview = styled.div`
  height: 30px;
  width: 30px;
  background-color: #${(props) =>
    props.color.length === 6 ? props.color : null}};
  border-radius: 100%;
  
`;

function App() {
  const [active, setActive] = useState(false);
  const [interval, setInterval] = useState(0.25);

  const [colors, setColors] = useState([
    {
      value1: "",
      value2: "",
      value3: "",
    },
  ]);

  //check if the given values are hexadecimal
  const handleCheckValues = () => {
    let errorFind = 0;

    //function responsible for checking the string
    const isHex = (val) => {
      return Boolean(val.match(/[0-9A-Fa-f]{6}/g));
    };

    colors.forEach((element) => {
      const value1 = element.value1;
      const value2 = element.value2;
      const value3 = element.value3;

      const hexColor = value1.toString() + value2.toString() + value3.toString();
      const checkedHex = isHex(hexColor);
      
      //if its not an hexadecimal value, an error is added
      if (checkedHex === false) errorFind = errorFind + 1;
    });

    if (errorFind > 0) {
      return false;
    } else {
      return true;
    }
  };
  
  //change if the transition is happening or not
  const handleChangeActivity = ()=>{
    if (active === false) {
      const checkResponse = handleCheckValues();
      if (checkResponse === true) {
        setActive(true);
      } else {
        alert("Only hexadecimal numbers are acepted, please try again");
      }
    } else setActive(false);
  }

  //input colors
  const handleAddColor = ()=>{
    if(active === false)setColors([...colors, { value1: "", value2: "", value3: "" }]);
  }

  // delete colors
  const handleDeleteColor = (index) =>{
    if(active === false){
      let newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  }

  //change the color values
  const handleChangeColor = (e, index) => {
    const { name, value } = e.target;
    const list = [...colors];
    list[index][name] = value;
    setColors(list);
  };

  

  return (
    <div className="App">
      <h1 className="title">Color Cycle</h1>
      <CycleArea colors={colors} active={active} interval={interval} />
      <div className="config-area">
        <div className="cycle-control">
          <button
            className={
              active === true ? "initialize-button-off" : "initialize-button-on"
            }
            onClick={() => {
              handleChangeActivity();
            }}
          >
            {active === true ? "Stop" : "Start"}
          </button>
          <div className="interval-area">
            <label>Interval(s)</label>
            <input
              type="number"
              className="interval-input"
              value={interval}
              onChange={(text) => {
                setInterval(text.target.value);
              }}
              disabled={active === true ? true : false}
            />
          </div>
        </div>
        <div className="color-configuration">
          {colors.map((item, index) => {
            return (
              <div className="transition-color">
                <ColorPreview
                  color={`${item.value1 + item.value2 + item.value3}`}
                />
                <label>Color: #</label>
                <input
                  type="text"
                  name="value1"
                  maxLength={2}
                  placeholder="red"
                  value={item.value1}
                  onChange={(e) => handleChangeColor(e, index)}
                  className="color-input"
                  disabled={active}
                />
                <input
                  type="text"
                  name="value2"
                  maxLength={2}
                  placeholder="green"
                  value={item.value2}
                  onChange={(e) => handleChangeColor(e, index)}
                  className="color-input"
                  disabled={active}
                />
                <input
                  type="text"
                  name="value3"
                  maxLength={2}
                  placeholder="blue"
                  value={item.value3}
                  onChange={(e) => handleChangeColor(e, index)}
                  className="color-input"
                  disabled={active}
                />

                <label>Hex</label>
                {colors.length !== 1 ? (
                  <FiTrash2
                    className={active===false?"trash-icon":"trash-icon-disabled"}
                    onClick={() => {
                      handleDeleteColor(index);
                    }}
                  />
                ) : null}
              </div>
            );
          })}

          <button
            className={active===true?"add-color-disabled":"add-color"}
            onClick={() => {
              handleAddColor();
            }}
          >
            <FiPlusCircle className="plus-icon" />
            Add color
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
