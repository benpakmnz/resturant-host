import React, { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table/Table";
import moment from "moment";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  List,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Divider from "@mui/material/Divider";
import { AlertColor } from "@mui/material/Alert/Alert.d";

export interface tableInterface {
  Concat: number[];
  Diners: number;
  Table: number;
  Order?: orderInterface;
}

export interface orderInterface {
  Diners: number;
  Mobile: string;
  start_time?: string;
  end_time?: string;
  Table?: number[];
}

const drawerWidth = 350;

const App: React.FC = () => {
  const [tableList, setTableList] = useState<tableInterface[]>([]);
  const [ordersList, setOrdersList] = useState<orderInterface[]>([]);
  const [completedOrders, setCompletedOrders] = useState<orderInterface[]>([]);
  const [alertType, setAlertType] = useState<AlertColor | undefined>("error");
  const [alertText, setAlertText] = useState<string>("");

  useEffect(() => {
    setTableList(require("./utilitis/floor.json"));
    setOrdersList(require("./utilitis/orders.json"));
  }, []);

  const serveWaitingList = () => {
    if (ordersList.length > 0) {
      //check for free table
      if (tableList.find((table) => !table.Order)) {
        let tempTableList = [...tableList];
        let tempOrderList = [...ordersList];

        // find fit table
        tempTableList.forEach((table: tableInterface) => {
          tempOrderList.forEach((order: orderInterface, index: number) => {
            if (order.Diners === table.Diners && !table.Order) {
              // setting the order into the table and setting start time stamp
              table.Order = order;
              table.Order.start_time = moment(new Date()).format(
                "DD/MM/YYYY, HH:mm"
              );

              // removing order from orderlist
              tempOrderList.splice(index, 1);
            }
          });
        });
        setTableList(tempTableList);
        setOrdersList(tempOrderList);
      } else {
        setAlertType("error");
        setAlertText("there are no avivalble tables for serving");
      }
    } else {
      setAlertType("warning");
      setAlertText("There are no waiting orders");
    }
  };

  const writeServedOrders = (tableId: number) => {
    let tempTableList = [...tableList];

    // finding table index in the table list
    let tableIndex = tempTableList.findIndex(
      (table) => table.Table === tableId
    );

    // setting end time stamp
    tempTableList[tableIndex].Order!.end_time = moment(new Date()).format(
      "DD/MM/YYYY, HH:mm"
    );

    // setting up table id into the completed order
    tempTableList[tableIndex].Order!.Table = [tempTableList[tableIndex].Table];
    setCompletedOrders([...completedOrders, tempTableList[tableIndex].Order!]);

    // removing order from table item
    delete tempTableList[tableIndex].Order;
    console.log(completedOrders);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Resturant Host Planner
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RestaurantIcon />}
              onClick={serveWaitingList}
            >
              Serve waiting list
            </Button>
          </Toolbar>
          {alertText !== "" && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert onClose={() => setAlertText("")} severity={alertType}>
                {alertText}
              </Alert>
            </Stack>
          )}
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            {ordersList.length > 0 ? (
              <List
                subheader={
                  <ListSubheader>Orders wating for service</ListSubheader>
                }
              >
                {ordersList.map((orderItem: orderInterface, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Amount of guests: ${orderItem.Diners}`}
                        secondary={`Contact number: ${orderItem.Mobile}`}
                      />
                    </ListItemButton>
                    <Divider variant="inset" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography align="center" sx={{ mt: 20 }}>
                There are no waiting orders
              </Typography>
            )}
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <ul className="tables_list">
            {tableList.map((tableItem: tableInterface) => (
              <Table
                tableData={tableItem}
                clearTable={writeServedOrders}
                key={tableItem.Table}
              />
            ))}
          </ul>
        </Box>
      </Box>
    </>
  );
};

export default App;
