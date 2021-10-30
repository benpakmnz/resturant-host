import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { tableInterface } from "../../App";
import "./table.scss";

const Table: React.FC<{
  tableData: tableInterface;
  clearTable: (tableId: number) => void;
}> = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [isShowInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    if (seconds > 90) {
      props.clearTable(props.tableData.Table);
    }
    let interval: any = null;

    if (props.tableData.Order) {
      //setting interval to check the time passed
      // only for table that gets an order

      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!props.tableData.Order && seconds !== 0) {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [props, seconds]);

  // table shape based on diners amount
  const tableType = () => {
    if (props.tableData.Diners === 1) {
      return "circle";
    } else if (props.tableData.Diners === 2) {
      return "wide_circle";
    } else if (props.tableData.Diners === 3) {
      return "triangle-up";
    } else if (props.tableData.Diners === 4) {
      return "square";
    } else if (props.tableData.Diners >= 5) {
      return "pentagon";
    }
  };

  return (
    <React.Fragment>
      <li className="table_container">
        <button
          className="table_btn"
          disabled={!props.tableData.Order}
          onClick={() => setShowInfo(true)}
        >
          <span
            className={`table_shape ${tableType()} ${
              // handeling color of table based on interval value
              seconds === 0
                ? " clear"
                : seconds < 60
                ? " accupied"
                : " almost-done"
            }`}
          ></span>
          {props.tableData.Order && <RestaurantIcon className="tabled_order" />}
        </button>
        <Typography align="center" variant="caption">
          Table number: {props.tableData.Table}
        </Typography>
      </li>

      <Modal open={isShowInfo} onClose={() => setShowInfo(false)}>
        <div className="info_modal">
          <Typography variant="h6" align="center">
            Table number: {props.tableData.Table}, now Serves:
          </Typography>
          {props.tableData.Order ? (
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneAndroidIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Order number"
                  secondary={props.tableData.Order?.Mobile}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Amount of pepole:"
                  secondary={props.tableData?.Order!.Diners}
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccessTimeFilledIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Started at"
                  secondary={props.tableData.Order?.start_time}
                />
              </ListItem>
            </List>
          ) : (
            // handle case when table gets cleared while info modal is open
            <Typography variant="body2" align="center">
              Nobody, its avaliable to get new orders
            </Typography>
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Table;
