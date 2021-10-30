import React, { useEffect, useState } from 'react';
import './App.css';
import './utilitis/normalize.scss';
import Table from './components/Table/table';

export interface tableInterface {
  Concat: number[],
  Diners: number,
  Table: number,
  Order?: orderInterface 
}

export interface orderInterface {
  Diners: number,
  Mobile: string,
  start_time?: Date,
  end_time?: Date,
  Table?: number[]
}

export interface completedOrder {

}

const App: React.FC = () => {
  const [tableList, setTableList]= useState<tableInterface[]>([]);
  const [ordersList, setOrdersList] = useState<orderInterface[]>([]);
  const [completedOrders, setCompletedOrders] = useState<orderInterface[]>([]);

useEffect(() => {
  setTableList(require('./utilitis/floor.json'));
  setOrdersList(require('./utilitis/orders.json'));
}, []);

const ServeWaitingList = () => {
  let tempTableList = [...tableList];
  let tempOrderList = [...ordersList];
  tempTableList.forEach((table: tableInterface) => {
    tempOrderList.forEach((order: orderInterface, index: number) =>{
      if(order.Diners === table.Diners && !table.Order){
        table.Order = order;
        table.Order.start_time = new Date();
        tempOrderList.splice(index, 1);
      }
    })
  })
  setTableList(tempTableList)
  setOrdersList(tempOrderList)

}

const clearTable = (tableId: number) => {
  let tempTableList = [...tableList];
  let tableIndex = tempTableList.findIndex(table => table.Table === tableId);
  tempTableList[tableIndex].Order!.end_time = new Date();
  tempTableList[tableIndex].Order!.Table = [tempTableList[tableIndex].Table]
  setCompletedOrders([...completedOrders, tempTableList[tableIndex].Order!])
  delete tempTableList[tableIndex].Order;
  console.log(completedOrders)
}


  return (
    <div>
    {tableList.length > 0 && (
      <ul className="tables_list">
        {tableList.map((tableItem: tableInterface) => (
          <Table tableData = {tableItem}  clearTable ={clearTable} key = {tableItem.Table}/>
        ))}
      </ul>
    )}
      <button onClick={ServeWaitingList}>setTables</button>
    {ordersList.length > 0 && (
            <ul>
            {ordersList.map((orderItem: orderInterface, index) => (
              <li key = {index}></li>
            ))}
          </ul>
    )}  
    </div>
  );
}

export default App;
