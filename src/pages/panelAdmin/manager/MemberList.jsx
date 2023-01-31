import { useSelector, useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AlertDeleteRedux from "../../../components/alertDelete/AlertDeleteRedux";
import SnackAlert from "../../../components/snackAlert/SnackAlert";
import LoadingRedux from "../../../components/loadingRedux/LoadingRedux";
import {
  fetchAllMember,
  // fetchOrganizationManagers,
  managerActions,
  suspendManager,
} from "../../../features/account/managerSlice";

const MemberList = () => {
  // const organid = JSON.parse(localStorage.getItem("organid"));

  const data = useSelector((state) => state.manager.data);
  // const loading = useSelector((state) => state.request.loading);
  const handleLoading = useSelector((state) => state.manager.handleLoading);
  const error = useSelector((state) => state.manager.error);
  const handleError = useSelector((state) => state.manager.handleError);
  const ready = useSelector((state) => state.manager.ready);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [successAlert, setSuccessAlert] = useState(false);
  const [successText, setSuccessText] = useState("");
  const handleOpenSuccess = (text) => {
    setSuccessText(text);
    setSuccessAlert(true);
  };

  const handleCloseSuccess = () => {
    setSuccessAlert(false);
  };

  const [errorAlert, setErrorAlert] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleOpenError = (text) => {
    setErrorText(text);
    setErrorAlert(true);
  };

  const handleCloseError = () => {
    setErrorAlert(false);
  };

  useEffect(() => {
    // dispatch(fetchOrganizationManagers(organid));
    dispatch(fetchAllMember());
    console.log("data", data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (handleError === "success") {
      handleOpenSuccess("عملیات با موفقیت انجام شد");
      setTimeout(() => {
        navigate(`/admin/manager`);
        dispatch(managerActions.clearHandleError());
      }, 1500);
    } else if (handleError !== "success" && handleError !== "") {
      handleOpenError("عملیات با مشکل مواجه شد");
      dispatch(managerActions.clearHandleError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleError]);

  const columns = [
    {
      field: "id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "fullName",
      flex: 1,
    },
    {
      field: "image",
      headerName: "image",
      flex: 1,
    },
    {
      field: "responsible",
      headerName: "responsible",
      flex: 1,
    },
    {
      field: "body",
      headerName: "body",
      flex: 1,
    },
    // {
    //   field: "isExecutive",
    //   headerName: "نوع مدیر",
    //   flex: 1,
    //   renderCell: (parameters) => {
    //     return (
    //       <div className="dataGridCell">
    //         {parameters.row.isExecutive ? "مدیر اصلی" : "مدیر عادی"}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "action",
      headerName: "امکانات",
      flex: 1,
      minWidth: 330,
      renderCell: (parameters) => {
        return (
          <div className="dataGridCell">
            <Button
              className="gridButton"
              color="info"
              onClick={(event) =>
                navigate(`/admin/managerEdit/${parameters.id}`)
              }
            >
              <EditOutlinedIcon className="gridIcon" />
              ویرایش
            </Button>
            <AlertDeleteRedux
              title="کاربر"
              clickFunction={(event) => {
                dispatch(suspendManager(parameters.id));
              }}
              loading={handleLoading}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div dir="rtl" className="dataGrid">
      <SnackAlert
        props={{
          successAlert,
          handleCloseSuccess,
          successText,
          errorAlert,
          handleCloseError,
          errorText,
        }}
      />

      <div className="topButtonContainer">
        <Button
          className="topButton"
          variant="outlined"
          color="success"
          onClick={(event) => navigate("/admin/managerAdd")}
        >
          اضافه کردن <AddIcon className="topButtonIcon" />
        </Button>
      </div>

      <div style={{ height: 500, width: 800 }}>
        <>
          {error !== "" || !ready ? (
            <LoadingRedux error={error} />
          ) : (
            <DataGrid
              rows={data}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              checkboxSelection
              disableSelectionOnClick
              sx={{ color: "#2C3333", fontSize: "13px" }}
            />
          )}
        </>
      </div>
    </div>
  );
};

export default MemberList;
