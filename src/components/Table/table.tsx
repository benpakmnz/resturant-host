import React, { useEffect, useState } from 'react';
import {tableInterface} from '../../App';
import "./table.scss";


const Table:React.FC<{tableData:tableInterface, clearTable: (tableId: number) => void}> = (props) => {
    const [seconds, setSeconds ] = useState(0);

    useEffect(()=> {
      if(seconds > 10){
        props.clearTable(props.tableData.Table)
      }
        let interval:any = null;
        if(props.tableData.Order){
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
              }, 1000);
        } else if (!props.tableData.Order && seconds !== 0) {
            clearInterval(interval);
            setSeconds(0)
        }
        return () => clearInterval(interval);   
    }, [props, seconds]);

    const tableType = () => {
      if(props.tableData.Diners === 1){
        return "circle";
      }else if(props.tableData.Diners === 2){
        return "wide_circle";
      }else if(props.tableData.Diners === 3){
        return "triangle-up";
      }else if(props.tableData.Diners === 4){
        return "square";
      }else if(props.tableData.Diners >= 5){
        return "pentagon";
      }
    }
    



    return (
        <li className="table_container">
          <button className="table_btn" disabled={!props.tableData.Order}>
            <span className="table_id">{props.tableData.Table}</span>
            <span className={`table_shape ${tableType()} ${seconds === 0? " clear" : seconds < 10? " accupied" : " almost-done"}`} ></span>
          </button>
          {/* <p>Id: {props.tableData.Table},  
          Capacity: {props.tableData.Diners},
          Avaliable : {props.tableData.Order? 'false': 'true'},
          <span>time passed: {seconds}</span>  
          </p>
        {props.tableData.Order && (
            <div>
               amount of pepole: {props.tableData.Order.Diners}, 
               phone number: {props.tableData.Order.Mobile},
            </div>
        )} */}
        </li>


    )
}

export default Table;
